import squel from 'squel';
import {IMSDK} from '../../types';
import {checkDatabaseVersion} from './databaseVersion';
import {formatData} from '../utils';
import _, {toString} from 'lodash-es';

export async function localCollectMessage(db: any) {
  if (!(await checkDatabaseVersion(db))) {
    db.exec(`drop table if exists collectmessage_list`);
  }
  return db.exec(`
      create table if not exists 'collectmessage_list' (
        'file_name' varchar(255),
        'client_msg_id' varchar(255),
        'msg_id' varchar(255),
        'conversation_id' varchar(255),
        'send_id' varchar(255),
        'send_nickname' varchar(255),
        'send_face_url' varchar(255),
        'send_time' INTEGER DEFAULT 0,
        'conversation_type' INTEGER DEFAULT 0,
        'bus_id' varchar(255),
        'type' INTEGER DEFAULT 0,
        'status' INTEGER DEFAULT 0,
        'recv_id' varchar(255),
        'seq' INTEGER DEFAULT 0,
        'content' varchar(1024),
        'recv_name' varchar(255),
        'role' varchar(64),
		'is_collect' INTEGER DEFAULT 0,
      primary key  ('client_msg_id')
    ) 
  `);
}

export function getCollectMaxSeq(db: any, conversation_id: number) {
  return db.exec(`select max(seq) as seq from collectmessage_list`);
}

export function getTotalForCollectMessage(db: any) {
  return db.exec(`select count(*) as total from collectmessage_list`);
}

// 分页获取
export function getCollectMessage(db: any, pageSize: number = 1, seq = 0) {
  let sql = squel
    .select()
    .from('collectmessage_list')
    .order('seq', false)
    .limit(pageSize)
    .where(`(seq <= ${seq} and seq >= ${seq - pageSize})`)
    .toString();
  return db.exec(sql);
}

// 搜索
export function searchCollectMessageByContent(
  db: any,
  keyword: string,
  type?: IMSDK.MessageType,
  isFile?: boolean,
) {
  let sql;
  let where = '';
  if (isFile) {
    where = `file_name like '%${keyword}%' and type = ${type}`;
  } else {
    where = `content like '%${keyword}%' and type = ${type}`;
  }
  if (type) {
    sql = squel.select().from('collectmessage_list').where(where).toString();
  } else {
    sql = squel
      .select()
      .from('collectmessage_list')
      .where(`content like '%${keyword}%'`)
      .toString();
  }
  console.log(sql, 'sql-----');
  return db.exec(sql);
}

// 根据client_msg_id获取
export function getCollectMessageById(db: any, id: string) {
  return db.exec(`
    select * from collectmessage_list where client_msg_id = "${id}";
  `);
}

// 根据msg_id获取
export function getCollectMessageByMsgId(db: any, id: string) {
  return db.exec(`
    select * from collectmessage_list where msg_id = "${id}";
  `);
}

// 根据client_msg_id更新
export function updateCollectMessageById(db: any, message: any) {
  formatData(message);
  const sql = squel
    .update()
    .table('collectmessage_list')
    .setFields(message)
    .where(`client_msg_id = '${message.client_msg_id}'`)
    .toString();
  return db.exec(sql);
}

// 根据msg_id更新
export function updateCollectMessageByMsgId(db: any, message: any) {
  formatData(message);
  const sql = squel
    .update()
    .table('collectmessage_list')
    .setFields(message)
    .where(`msg_id = '${message.msg_id}'`)
    .toString();
  return db.exec(sql);
}

export function deleteAllCollectMessage(db: any) {
  return db.exec(`DELETE FROM collectmessage_list`);
}

export function batchDeleteCollectMessage(db: any, ids: string[]) {
  let str = ids.join('","');
  return db.exec(
    `DELETE FROM collectmessage_list WHERE client_msg_id IN ("${str}")`,
  );
}

export function insertCollectMessage(db: any, message: any) {
  // if(message.content.includes("'")) {
  //   message.content = message.content.replaceAll("'", `\'\'`)
  // }
  formatData(message);
  const sql = squel
    .insert()
    .into('collectmessage_list')
    .setFields(message)
    .toString();
  console.log(sql, 'sql--------');
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}

export function batchInsertCollectMessageList(db: any, messageList: any[]) {
  messageList.forEach(item => {
    if (item.content && item.content.includes("'")) {
      item.content = item.content.replaceAll("'", `\'\'`);
    }
  });

  formatData(messageList);
  // for(let i = 0;i<messageList.length;i++){
  //   let keys = Object.keys(messageList[i])
  //   let str = ''
  //   keys.map(item=>{
  //     str+=(item+",")
  //   })
  //   console.log(str)
  // }
  const sql = squel
    .insert()
    .into('collectmessage_list')
    .setFieldsRows(messageList)
    .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}
