import squel from 'squel'
import { IMSDK } from '../../types'
import { checkDatabaseVersion } from './databaseVersion'
import { formatData } from '../utils'

export async function localMassSendMsg(db: any) {
  if(!await checkDatabaseVersion(db)) {
    db.exec(`drop table if exists mass_send`)
  }
  return db.exec(`
      create table if not exists 'mass_send' (
        'mass_send_id' varchar(255),
        'send_time' INTEGER DEFAULT 0,
        'recv_id' varchar(1024),
        'content' varchar(1024),
      primary key ('mass_send_id')
    ) 
  `);
}

export function getMassSendMsgList(db: any, pageSize: number = 99999999, pageNo: number = 1) {
  let sql = squel
    .select()
    .from('mass_send')
    .limit(pageSize)
    .offset(pageSize * (pageNo - 1))
    .toString()
  return db.exec(sql)
}

export function insertMassSendMsg(db: any, message: any) {
  // if(message.content.includes("'")) {
  //   message.content = message.content.replaceAll("'", `\'\'`)
  // }
  formatData(message)
  const sql = squel
      .insert()
      .into('mass_send')
      .setFields(message)
      .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}

export function batchDeleteMassMessage(db: any, ids: string[]) {
  let str = ids.join('","')
  return db.exec(`
    DELETE FROM mass_send WHERE mass_send_id IN ("${str}")
  `);
}
