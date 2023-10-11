import { getInstance } from './instance';
import { getGroupVersion as getGroupVersionLocal,
  updateGroupVersionById as updateGroupVersionByIdLocal,
  getGroupVersionById as getGroupVersionByIdLocal,
  insertGroupVersion as insertGroupVersionLocal,
  getTotal,
  batchInsertGroupVersionList,
  deleteAllGroupVersionList
} from '../sqls'
import { converSqlExecResult, formatResponse } from '../utils'
import { IMSDK } from '../../types'
import { DatabaseErrorCode } from '../constant'

export async function getGroupVersionList(pageSize: number, pageNo: number) {
  try {
    const db = await getInstance();
    const execResult = await getGroupVersionLocal(db, pageSize, pageNo)
    let data = formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', [], {}))
    const res = await getTotal(db, 'group_version_list')
    // console.debug('getGroupVersionList getTotal res--------',res)
    data.total = res[0]?.total
    return data;
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}

export async function getGroupVersionById(id: string) {
  try {
    const db = await getInstance();
    const execResult = await getGroupVersionByIdLocal(db, id)
    const data = formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', [], {}, {
      key: 'user',
      suffix: '_user'
    }))
    return data;
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}

export async function updateGroupVersionById(groupVersion: any) {
  try {
    const db = await getInstance();
    const execResult = await updateGroupVersionByIdLocal(db, groupVersion)
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}

export async function insertGroupVersion(groupVersion: any) {
  try {
    const db = await getInstance();
    const execResult = await insertGroupVersionLocal(db, groupVersion)
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}

export async function insertGroupVersionList(groupVersionList: any[]) {
  try {
    const db = await getInstance();
    const execResult = await batchInsertGroupVersionList(db, groupVersionList)
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}

export async function deleteAllGroupVersion() {
  try {
    const db = await getInstance();
    const execResult = await deleteAllGroupVersionList(db)
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}