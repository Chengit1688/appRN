import squel from 'squel'
import { IMSDK } from '../../types'
import { checkDatabaseVersion } from './databaseVersion'
import { formatData } from '../utils'

export async function localGroup(db: any) {
  if(!await checkDatabaseVersion(db)) {
    db.exec(`drop table if exists group_list`)
  }
  return db.exec(`
      create table if not exists 'group_list' (
        'id' INTEGER DEFAULT 0,
        'group_id' varchar(64),
        'conversation_id' varchar(255),
        'name' varchar(64),
        'role' varchar(64),
        'face_url' varchar(255),
        'members_total' INTEGER DEFAULT 0,
        'notification' varchar(255),
        'introduction' varchar(255),
        'create_time' INTEGER DEFAULT 0,
        'create_user_id' varchar(64),
        'status' INTEGER DEFAULT 0,
        'no_show_normal_member' INTEGER DEFAULT 0,
        'no_show_all_member' INTEGER DEFAULT 0,
        'show_qrcode_by_normal' INTEGER DEFAULT 0,
        'join_need_apply' INTEGER DEFAULT 0,
        'ban_remove_by_normal' INTEGER DEFAULT 0,
        'mute_all_member' INTEGER DEFAULT 0,
        'admins_total' INTEGER DEFAULT 0,
        'last_version' INTEGER DEFAULT 0,
        'last_member_version' INTEGER DEFAULT 0,
        'is_default' INTEGER DEFAULT 0,
        'is_topchat' INTEGER DEFAULT 0,
        'is_disturb' INTEGER DEFAULT 0,
        'is_topannocuncement' INTEGER DEFAULT 0,
        'is_open_admin_list' INTEGER DEFAULT 0,
        'is_open_admin_icon' INTEGER DEFAULT 0,
        'is_open_group_id' INTEGER DEFAULT 0,
		'is_display_nickname_open' INTEGER DEFAULT 0,
        'group_send_limit' INTEGER DEFAULT 0,
        'mute_all_period' varchar(255),
        'robot_total' INTEGER DEFAULT 0,
      primary key ('group_id')
    ) 
  `);
}

export function getGroup(db: any) {
  let sql = squel
    .select()
    .from('group_list')
    .toString()
  return db.exec(sql)
}

export function getGroupById(db: any, id: string) {
  return db.exec(`
    select * from group_list where group_id = "${id}";
  `);
}

export function searchGroupById(db: any, keyword: string) {
  let sql = squel
    .select()
    .from('group_list')
    .where(`group_id like '%${keyword}%'`)
    .toString()
  return db.exec(sql)
}

export function searchGroupByName(db: any, keyword: string) {
  let sql = squel
    .select()
    .from('group_list')
    .where(`name like '%${keyword}%'`)
    .toString()
  return db.exec(sql)
}

export function updateGroupById(db: any, group: any) {
  delete group.updateGroupById
  formatData(group)
  // if(group.notification.includes(`'`)) {
  //   group.notification = group.notification.replaceAll("'", `\'\'`)
  // }
  const sql = squel
      .update()
      .table('group_list')
      .setFields(group)
      .where(`group_id = '${group.group_id}'`)
      .toString();
  return db.exec(sql);
}

export function batchDeleteGroup(db: any, ids: string[]) {
  let str = ids.join('","')
  return db.exec(`
    DELETE FROM group_list WHERE group_id IN ("${str}")
  `);
}

export function insertGroup(db: any, group: any) {
  // if(group.notification.includes(`'`)) {
  //   group.notification = group.notification.replaceAll("'", `\'\'`)
  // }
  formatData(group)
  const sql = squel
      .insert()
      .into('group_list')
      .setFields(group)
      .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}

export function batchInsertGroupList(db: any, groupList: any[]) {
  // groupList.forEach(group => {
  //   if(group.notification.includes(`'`)) {
  //     group.notification = group.notification.replaceAll("'", `\'\'`)
  //   }
  // })
  let str =JSON.stringify(groupList)
  groupList = JSON.parse(str)
  formatData(groupList)
  const sql = squel
      .insert()
      .into('group_list')
      .setFieldsRows(groupList)
      .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}