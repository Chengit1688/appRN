import { getInstance } from './instance';
import { getBlackList as databaseGetBlackList, insertBlack as databaseInsertBlack } from '../sqls/localblack'
import uuid from 'react-native-uuid';
import { converSqlExecResult, formatResponse } from '../utils'
export async function getBlackList() {
  try {
    const db = await getInstance();
    const execResult = await databaseGetBlackList(db)
    return converSqlExecResult(execResult[0], 'SnakeCase', []);
  }
  catch (e) {
    console.error(e);
  }
}

export async function insertBlack() {
  try {
    const db = await getInstance();
    return await databaseInsertBlack(db, {
      owner_user_id: uuid.v4(),
      block_user_id: uuid.v4(),
      nickname: uuid.v4(),
      face_url: uuid.v4()
    })
  }
  catch (e) {
    console.error(e);
  }
}