import squel from 'squel';
import {IMSDK} from '../../types';
import {checkDatabaseVersion} from './databaseVersion';
import {formatData} from '../utils';
import _, {toString} from 'lodash-es';

export async function localMessage(db: any) {
  //bus_id 业务ID, 跟CKMessage conversation_id相同概念, 群消息是群ID, 私聊是用户ID
  //status 状态 删除 撤回 不显示
  //  db.exec(`drop table if exists message_list`)
  if (!(await checkDatabaseVersion(db))) {
    db.exec(`drop table if exists message_list`);
  }
  return db.exec(`
      create table if not exists 'message_list' (
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

export function getMaxSeq(db: any, conversation_id: number) {
  return db.exec(
    `select max(seq) as seq from message_list where conversation_id = "${conversation_id}"`,
  );
}
export function getMinSeq(db: any, conversation_id: number) {
  return db.exec(
    `select min(seq) as seq from message_list where conversation_id = "${conversation_id}"`,
  );
}
export function getMessage(
  db: any,
  pageSize: number = 1,
  conversation_id: string,
  seq = 0,
) {
  let sql = squel
    .select()
    .from('message_list')
    .order('seq', false)
    .limit(pageSize)
    .where(
      `conversation_id = '${conversation_id}' and (status <> 2 and status <> 3) and (seq <= ${seq} and seq >= ${
        seq - pageSize
      })`,
    )
    .toString();
  return db.exec(sql);
}

export function getMessageAll(
  db: any,
  pageSize: number = 1,
  conversation_id: string,
  seq = 0,
) {
  let sql = squel
    .select()
    .from('message_list')
    .order('seq', false)
    .limit(pageSize)
    .where(
      `conversation_id = '${conversation_id}' and (seq <= ${seq} and seq >= ${
        seq - pageSize
      })`,
    )
    .toString();
  return db.exec(sql);
}

export function getTotalForMessage(db: any, conversation_id: string) {
  return db.exec(
    `select count(*) as total from message_list where conversation_id = "${conversation_id}" and (status <> 2 and status <> 3)`,
  );
}

export function modifyMessageStatus(db: any, conversation_id: string) {
  return db.exec(
    `update message_list set status = 2  where conversation_id = "${conversation_id}"`,
  );
}

export function searchMessageByContent(
  db: any,
  keyword: string,
  type?: IMSDK.MessageType,
  isFile?: boolean,
) {
  let sql;
  let where = '';
  if (isFile) {
    where = `file_name like '%${keyword}%' and type = ${type} and (status <> 2 and status <> 3)`;
  } else {
    where = `content like '%${keyword}%' and type = ${type} and (status <> 2 and status <> 3)`;
  }
  if (type) {
    sql = squel.select().from('message_list').where(where).toString();
  } else {
    sql = squel
      .select()
      .from('message_list')
      .where(`content like '%${keyword}%' and (status <> 2 and status <> 3)`)
      .toString();
  }
  return db.exec(sql);
}

export function searchMessageContent(db: any, keyword: string, id: string) {
  let sql = squel
    .select()
    .from('message_list')
    .where(
      `content like '%${keyword}%' and (status <> 2 and status <> 3) and conversation_id = '${id}'`,
    )
    .toString();

  return db.exec(sql);
}

export function searchMessageByContentAndConversationId(
  db: any,
  keyword: string,
  type?: IMSDK.MessageType,
  conversation_id?: string,
) {
  let sql;
  if (keyword) {
    if (type) {
      if (type != 1 && type != 10) {
        sql = squel
          .select()
          .from('message_list')
          .where(
            `file_name like '%${keyword}%' and type = ${type} and conversation_id = '${conversation_id}'`,
          )
          .toString();
      } else {
        sql = squel
          .select()
          .from('message_list')
          .where(
            `content like '%${keyword}%' and type = ${type} and conversation_id = '${conversation_id}'`,
          )
          .toString();
      }
    } else {
      sql = squel
        .select()
        .from('message_list')
        .where(
          `content like '%${keyword}%' and conversation_id = '${conversation_id}'`,
        )
        .toString();
    }
  } else {
    sql = squel
      .select()
      .from('message_list')
      .where(`conversation_id = '${conversation_id}' and type = ${type}`)
      .toString();
  }
  return db.exec(sql);
}

export function searchMessageByContentAndConvIdAndCollect(
  db: any,
  keyword: string,
  type?: IMSDK.MessageType | IMSDK.MessageType[],
  user_id?: string,
) {
  let whereTypeStr = '';
  let whereUidStr = '';
  if (_.isArray(type)) {
    const whereType: string[] = [];
    type.map(item => {
      whereType.push(` type = ${item} `);
    });
    whereTypeStr = whereType.join(' or ');
    if (whereTypeStr) {
      whereTypeStr = ` and ${whereTypeStr} `;
    }
  } else if (type) {
    whereTypeStr = ` and type = ${type} `;
  }
  if (user_id) {
    //whereUidStr = ` and conversation_id like '%${user_id}%' `;
  }
  let sql;
  if (keyword) {
    if (type) {
      if (type != 1 && type != 10) {
        sql = squel
          .select()
          .from('message_list')
          .where(
            `file_name like '%${keyword}%' and is_collect = 1 ${whereTypeStr} ${whereUidStr}`,
          )
          .toString();
      } else {
        sql = squel
          .select()
          .from('message_list')
          .where(
            `content like '%${keyword}%' and is_collect = 1 ${whereTypeStr} ${whereUidStr}`,
          )
          .toString();
      }
    } else {
      sql = squel
        .select()
        .from('message_list')
        .where(`content like '%${keyword}%' and is_collect = 1 ${whereUidStr}`)
        .toString();
    }
  } else {
    sql = squel
      .select()
      .from('message_list')
      .where(`is_collect = 1 ${whereTypeStr} ${whereUidStr}`)
      .toString();
  }
  return db.exec(sql);
}

export function getMessageById(db: any, id: string) {
  return db.exec(`
    select * from message_list where client_msg_id = "${id}";
  `);
}

export function getMessageByMsgId(db: any, id: string) {
  return db.exec(`
    select * from message_list where msg_id = "${id}";
  `);
}

export function updateMessageById(db: any, message: any) {
  formatData(message);
  const sql = squel
    .update()
    .table('message_list')
    .setFields(message)
    .where(`client_msg_id = '${message.client_msg_id}'`)
    .toString();
  return db.exec(sql);
}

export function updateMessageByMsgId(db: any, message: any) {
  formatData(message);
  const sql = squel
    .update()
    .table('message_list')
    .setFields(message)
    .where(`msg_id = '${message.msg_id}'`)
    .toString();
  return db.exec(sql);
}

export function clearMessageByConversationId(db: any, id: string[]) {
  return db.exec(`
    DELETE FROM message_list WHERE conversation_id = '${id}'
  `);
}

export function deleteAllMessage(db: any) {
  return db.exec(`
    DELETE FROM message_list
  `);
}

export function batchDeleteMessage(db: any, ids: string[]) {
  let str = ids.join('","');
  return db.exec(`
    DELETE FROM message_list WHERE client_msg_id IN ("${str}")
  `);
}

export function insertMessage(db: any, message: any) {
  // if(message.content.includes("'")) {
  //   message.content = message.content.replaceAll("'", `\'\'`)
  // }
  formatData(message);
  const sql = squel.insert().into('message_list').setFields(message).toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}

export function batchInsertMessageList(db: any, messageList: any[]) {
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
    .into('message_list')
    .setFieldsRows(messageList)
    .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}

export function deleteLocalMessageByUserId(db: any, ids: string[], conv_id) {
  let str = ids.join('","');
  return db.exec(`
    UPDATE message_list set status = 3 WHERE conversation_id = "${conv_id}" and send_id IN ("${str}")
  `);
}

export function deleteLocalMessageByConvId(db: any, conv_id) {
  let str = conv_id.join('","');
  return db.exec(`
    UPDATE message_list set status = 3 WHERE conversation_id in ("${str}")
  `);
}
