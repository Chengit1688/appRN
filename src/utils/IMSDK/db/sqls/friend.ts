import squel from 'squel';
import {IMSDK} from '../../types';
import {checkDatabaseVersion} from './databaseVersion';
import {formatData} from '../utils';

export async function localFriend(db: any) {
  if (!(await checkDatabaseVersion(db))) {
    db.exec(`drop table if exists friend_list`);
  }

  return db.exec(`
      create table if not exists 'friend_list' (
        'user_id' varchar(64),
        'conversation_id' varchar(255),
        'remark' varchar(255),
        'create_time' INTEGER DEFAULT 0,
        'friend_status' INTEGER DEFAULT 0,
        'online_status' INTEGER DEFAULT 2,
        'black_status' INTEGER DEFAULT 2,
      primary key ('user_id')
    ) 
  `);
}

export function getFriend(db: any) {
  return db.exec(`
    select friend_list.conversation_id,
      friend_list.remark,
      friend_list.create_time,
      friend_list.friend_status,
      friend_list.online_status,
      friend_list.black_status,
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
      from friend_list left join user_list on 
      friend_list.user_id == user_list.user_id
  `);
}

export function searchFriendByName(db: any, keyword: string) {
  return db.exec(`
    select friend_list.conversation_id,
      friend_list.remark,
      friend_list.create_time,
      friend_list.friend_status,
      friend_list.online_status,
      friend_list.black_status,
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
      from friend_list left join user_list on 
      friend_list.user_id == user_list.user_id
    where (user_list.nick_name like '%${keyword}%' or user_list.user_id like '%${keyword}%' or friend_list.remark like '%${keyword}%') and friend_list.friend_status <> 2
  `);
}

export function getFriendById(db: any, id: string) {
  return db.exec(`
    select * from friend_list where user_id = "${id}";
  `);
}

export function updateFriendById(db: any, friend: any) {
  delete friend.user;
  formatData(friend);
  const sql = squel
    .update()
    .table('friend_list')
    .setFields(friend)
    .where(`user_id = '${friend.user_id}'`)
    .toString();
  return db.exec(sql);
}

export function batchDeleteFriend(db: any, ids: string[]) {
  let str = ids.join('","');
  return db.exec(`
    DELETE FROM friend_list WHERE user_id IN ("${str}")
  `);
}

export function insertFriend(db: any, friend: any) {
  delete friend.user;
  formatData(friend);
  const sql = squel.insert().into('friend_list').setFields(friend).toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}

export function batchInsertFriendList(db: any, friendList: any[]) {
  if (friendList.length > 0) {
    friendList.forEach(item => {
      delete item.user;
    });
  } else {
    return [];
  }
  formatData(friendList);
  const sql = squel
    .insert()
    .into('friend_list')
    .setFieldsRows(friendList)
    .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}
