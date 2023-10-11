import {getInstance} from './instance';
import {
  getUser as getUserLocal,
  updateUserById as updateUserByIdLocal,
  getUserById as getUserByIdLocal,
  deleteUserById as deleteUserByIdLocal,
  insertUser as insertUserLocal,
  getTotal,
  batchInsertUserList,
} from '../sqls';
import {converSqlExecResult, formatResponse} from '../utils';
import {IMSDK} from '../../types';
import {DatabaseErrorCode} from '../constant';

export async function getUserList(pageSize: number, pageNo: number) {
  try {
    const db = await getInstance();
    const execResult = await getUserLocal(db, pageSize, pageNo);
    let data = formatResponse(
      converSqlExecResult(execResult[0], 'SnakeCase', [], {}),
    );
    const res = await getTotal(db, 'user_list');
    console.debug('getUserList getTotal res--------', res);
    data.total = res[0]?.total;
    return data;
  } catch (e) {
    console.error(e);
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function insertUser(user: any) {
  try {
    const db = await getInstance();
    const execResult = await insertUserLocal(db, user);
    const data = formatResponse(
      converSqlExecResult(execResult[0], 'SnakeCase', [], {}),
    );
    return data;
  } catch (e) {
    console.error(e);
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function getUserById(id: string) {
  try {
    const db = await getInstance();
    const execResult = await getUserByIdLocal(db, id);
    const data = formatResponse(
      converSqlExecResult(execResult[0], 'SnakeCase', [], {}),
    );
    return data;
  } catch (e) {
    console.error(e);
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function deleteUserById(conversationID: string) {
  try {
    const db = await getInstance();
    const execResult = await deleteUserByIdLocal(db, conversationID);
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  } catch (e) {
    console.error(e);
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function updateUserById(user: any) {
  try {
    const db = await getInstance();
    const execResult = await updateUserByIdLocal(db, user);
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  } catch (e) {
    console.error(e);
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function insertUserList(user: any[]) {
  try {
    const db = await getInstance();
    const execResult = await batchInsertUserList(db, user);
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  } catch (e) {
    console.error(e);
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}
