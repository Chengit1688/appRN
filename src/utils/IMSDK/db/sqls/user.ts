import squel from 'squel';
import {IMSDK} from '../../types';
import {checkDatabaseVersion} from './databaseVersion';
import {formatData} from '../utils';

export async function localUser(db: any) {
  if (!(await checkDatabaseVersion(db))) {
    db.exec(`drop table if exists user_list`);
  }
  return db.exec(`
      create table if not exists 'user_list' (
        'user_id' varchar(64),
        'face_url' varchar(255),
        'big_face_url' varchar(255),
        'nick_name' varchar(255),
        'age' INTEGER DEFAULT 0,
        'account' INTEGER,
        'phone_number' varchar(255),
        'login_ip' varchar(64),
        'gender' INTEGER DEFAULT 0,
        'signatures' varchar(255),
      primary key ('user_id')
    ) 
  `);
}

export function getUser(db: any, pageSize: number = 3, pageNo: number = 1) {
  console.log(pageSize, pageNo);
  let sql = squel
    .select()
    .from('user_list')
    .limit(pageSize)
    .offset(pageSize * (pageNo - 1))
    .toString();
  return db.exec(sql);
}

export function getTotal(db: any, table: string) {
  return db.exec(`select count(*) as total from ${table}`);
}

export function getUserById(db: any, id: string) {
  return db.exec(`
    select * from user_list where user_id = "${id}";
  `);
}

export function updateUserById(db: any, user: any) {
  formatData(user);
  const sql = squel
    .update()
    .table('user_list')
    .setFields(user)
    .where(`user_id = '${user.user_id}'`)
    .toString();
  return db.exec(sql);
}

export function deleteUserById(db: any, id: string) {
  return db.exec(`
    DELETE
      FROM user_list
      WHERE user_id = "${id}"
  `);
}
export function batchDeleteUser(db: any, ids: string[]) {
  let str = ids.join('","');
  return db.exec(`
    DELETE FROM user_list WHERE user_id IN ("${str}")
  `);
}

export function insertUser(db: any, user: any) {
  formatData(user);
  const sql = squel.insert().into('user_list').setFields(user).toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}

export function batchInsertUserList(db: any, userList: any[]) {
  formatData(userList);
  const sql = squel
    .insert()
    .into('user_list')
    .setFieldsRows(userList)
    .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}
