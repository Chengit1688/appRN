import { getInstance } from './instance';
import { 
  getMassSendMsgList as getMsgList,
  insertMassSendMsg as insertMsg,
  batchDeleteMassMessage as batchDeleteMessageLocal
} from '../sqls'
import { converSqlExecResult, formatResponse } from '../utils'
import { DatabaseErrorCode } from '../constant'

export async function getMassSendMsgList(pageSize: number, pageNo: number) {
  try {
    const db = await getInstance();
    const execResult = await getMsgList(db, pageSize, pageNo)
    const data = formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', [], {}))
    return data;
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}



export async function insertMassSendMsg(message) {
  try {
    const db = await getInstance();
    const execResult = await insertMsg(db, message)
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}

export async function batchDeleteMassMessage(ids: string[]) {
  try {
    const db = await getInstance();
    const execResult = await batchDeleteMessageLocal(db, ids)
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}
