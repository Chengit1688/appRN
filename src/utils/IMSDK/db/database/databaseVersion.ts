import { getInstance } from './instance';
import { getDatabaseVersionById as getDatabaseVersionByIdLocal,
  insertDatabaseVersion as insertDatabaseVersionLocal } from '../sqls'
import { converSqlExecResult, formatResponse } from '../utils'
import { DatabaseErrorCode } from '../constant'

export async function getDatabaseVersionById(id: string) {
  try {
    const db = await getInstance();
    const execResult = await getDatabaseVersionByIdLocal(db, id)
    let data = formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', [], {}))
    return data;
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}

export async function insertDatabaseVersion(version: object) {
  try {
    const db = await getInstance();
    const execResult = await insertDatabaseVersionLocal(db, version)
    console.debug('execResult------------',execResult)
    const data = formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', [], {}))
    return data;
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}