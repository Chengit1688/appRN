import squel from 'squel'
import { checkDatabaseVersion } from './databaseVersion'

export async function localGroupVersion(db: any) {
  if(!await checkDatabaseVersion(db)) {
    db.exec(`drop table if exists group_version_list`)
  }
  return db.exec(`
    create table if not exists 'group_version_list' (
        'group_id' varchar(64),
        'group_version' INTEGER DEFAULT 0,
        'member_version' INTEGER DEFAULT 0,
      primary key ('group_id')
    ) 
  `);
}

export function getGroupVersion(db: any, pageSize: number = 3, pageNo: number = 1) {
  let sql = squel
    .select()
    .from('group_version_list')
    .limit(pageSize)
    .offset(pageSize * (pageNo - 1))
    .toString()
  return db.exec(sql)
}

export function getGroupVersionById(db: any, id: string) {
  return db.exec(`
    select * from group_version_list where group_id = "${id}";
  `);
}

export function updateGroupVersionById(db: any, groupVersion: any) {
  const sql = squel
      .update()
      .table('group_version_list')
      .setFields(groupVersion)
      .where(`group_id = '${groupVersion.group_id}'`)
      .toString();
  return db.exec(sql);
}

export function insertGroupVersion(db: any, groupVersion: any) {
  const sql = squel
      .insert()
      .into('group_version_list')
      .setFields(groupVersion)
      .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}

export function batchInsertGroupVersionList(db: any, groupVersion: any[]) {
  const sql = squel
    .insert()
    .into('group_version_list')
    .setFieldsRows(groupVersion)
    .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}

export function deleteAllGroupVersionList(db: any) {
  return db.exec(`
    DELETE FROM group_version_list
  `);
}