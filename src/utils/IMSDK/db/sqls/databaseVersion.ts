import Config from 'react-native-config'
import squel from 'squel'

export async function localDatabaseVersion(db: any) {
  let data = db.exec(`
    create table if not exists 'database_version' (
        'id' varchar(255),
        'version' INTEGER DEFAULT 0,
      primary key  ('id')
    )
  `)
  let res = await getDatabaseVersionById(db, '1')
  if(res.length == 0) {
    await insertDatabaseVersion(db, {id: 1, version: Config.VITE_DATABSE_VERSION})
	res = await getDatabaseVersionById(db, '1')
  }
  return res;
}

export async function getDatabaseVersionById(db: any, id: string) {
  let sql = squel
    .select()
    .from('database_version')
    .where(`id = '${id}'`)
    .toString()
  return db.exec(sql)
}

export async function insertDatabaseVersion(db: any, version: object) {
  const sql = squel
      .insert()
      .into('database_version')
      .setFields(version)
      .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}

export async function checkDatabaseVersion(db: any) {
  let data = await db.exec(`
    select * from database_version where id = "${1}";
  `)
  return (data[0]?.version == Config.VITE_DATABSE_VERSION)
}