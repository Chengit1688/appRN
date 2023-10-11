import squel from 'squel';
import {IMSDK} from '../../types';
import {checkDatabaseVersion} from './databaseVersion';
import {formatData} from '../utils';

export async function localGroupMember(db: any) {
  if (!(await checkDatabaseVersion(db))) {
    db.exec(`drop table if exists group_member_list`);
  }
  //member_id通过[group_id]_[user_id]组装生成
  return db.exec(`
    create table if not exists 'group_member_list' (
        'member_id' varchar(64),
        'group_id' varchar(255),
        'user_id' varchar(255),
        'id' INTEGER DEFAULT 0,
        'group_nick_name' varchar(64),
        'role' varchar(64),
        'big_face_url' varchar(255),
        'mute_end_time' INTEGER DEFAULT 0,
        'version' INTEGER DEFAULT 0,
        'status' INTEGER DEFAULT 0,
      primary key ('member_id')
    ) 
  `);
}

export function getGroupMember(
  db: any,
  pageSize: number = 3,
  pageNo: number = 1,
  group_id: string,
) {
  let sql = `
    select group_member_list.member_id,
      group_member_list.group_nick_name,
      group_member_list.role,
      group_member_list.mute_end_time,
      group_member_list.version,
      group_member_list.status,
      user_list.user_id as user_id_user,
      user_list.face_url as face_url_user,
      user_list.big_face_url as big_face_url_user,
      user_list.nick_name as nick_name_user,
      user_list.age as age_user,
      user_list.account as account_user,
      user_list.phone_number as phone_number_user,
      user_list.login_ip as login_ip_user,
      user_list.gender as gender_user,
      user_list.signatures as signatures_user
      from group_member_list left join user_list on 
      group_member_list.user_id == user_list.user_id
      where group_member_list.group_id = ${group_id}
    LIMIT ${pageSize} OFFSET ${pageSize * (pageNo - 1)}
  `;
  // console.log(sql)
  return db.exec(sql);
}

export function getGroupMemberTotal(db: any, id: string) {
  return db.exec(
    `select count(*) as total from group_member_list where group_id = ${id} and status = 1`,
  );
}

export function getGroupMemberAdminOrOwner(db: any, id: string) {
  let sql = `
    select group_member_list.member_id,
      group_member_list.group_nick_name,
      group_member_list.role,
      group_member_list.mute_end_time,
      group_member_list.version,
      group_member_list.status,
      user_list.user_id,
      user_list.face_url,
      user_list.big_face_url,
      user_list.nick_name,
      user_list.age,
      user_list.account,
      user_list.phone_number,
      user_list.login_ip,
      user_list.gender,
      user_list.signatures
      from group_member_list left join user_list on 
      group_member_list.user_id == user_list.user_id
      where group_member_list.group_id = ${id}
      and role in("admin","owner") order by role desc;
  `;
  // return db.exec(
  //   `select * from group_member_list where group_id=${id} and role in("admin","owner") order by role desc;`,
  // );
  return db.exec(sql);
}

export function getGroupMemberById(db: any, id: string) {
  return db.exec(`
    select * from group_member_list where member_id = "${id}";
  `);
}

export function updateGroupMemberById(db: any, groupMember: any) {
  delete groupMember.user;
  formatData(groupMember);
  const sql = squel
    .update()
    .table('group_member_list')
    .setFields(groupMember)
    .where(`member_id = '${groupMember.member_id}'`)
    .toString();
  return db.exec(sql);
}

export function batchDeleteGroupMember(db: any, ids: string[]) {
  let str = ids.join('","');
  return db.exec(`
    DELETE FROM group_member_list WHERE member_id IN ("${str}")
  `);
}

export function insertGroupMember(db: any, groupMember: any) {
  delete groupMember.user;
  formatData(groupMember);
  const sql = squel
    .insert()
    .into('group_member_list')
    .setFields(groupMember)
    .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}

export function batchInsertGroupMemberList(db: any, groupMember: any[]) {
  if (groupMember.length > 0) {
    groupMember.forEach(item => {
      delete item.user;
    });
  } else {
    return [];
  }
  formatData(groupMember);
  const sql = squel
    .insert()
    .into('group_member_list')
    .setFieldsRows(groupMember)
    .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}
