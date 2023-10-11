import { getInstance } from './instance';
import { getGroup as getGroupLocal,
  updateGroupById as updateGroupByIdLocal,
  getGroupById as getGroupByIdLocal,
  batchDeleteGroup as batchDeleteGroupLocal,
  searchGroupById as searchGroupByIdLocal,
  searchGroupByName as searchGroupByNameLocal,
  batchInsertGroupList } from '../sqls'
import { converSqlExecResult, formatResponse } from '../utils'
import { IMSDK } from '../../types'
import { DatabaseErrorCode } from '../constant'

export async function getGroupList() {
  try {
    const db = await getInstance();
    const execResult = await getGroupLocal(db)
    const data = formatResponse(converSqlExecResult(execResult, 'SnakeCase', [], {}))
    return data;
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}

export async function getGroupById(id: string) {
  try {
    const db = await getInstance();
    const execResult = await getGroupByIdLocal(db, id)
    const data = formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', [], {}))
    return data;
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}

export async function searchGroupById(keyword: string) {
  try {
    const db = await getInstance();
    const execResult = await searchGroupByIdLocal(db, keyword)
    const data = formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', [], {}))
    return data;
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}

export async function searchGroupByName(keyword: string) {
  try {
    const db = await getInstance();
    const execResult = await searchGroupByNameLocal(db, keyword)
    const data = formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', [], {}))
    return data;
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}

export async function updateGroupById(group: any) {
  try {
    const db = await getInstance();
    const execResult = await updateGroupByIdLocal(db, group)
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}

export async function insertGroupList(group: any[]) {
  try {
    const db = await getInstance();
    const execResult = await batchInsertGroupList(db, group)
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}

export async function deleteGroups(ids: string[]) {
  try {
    const db = await getInstance();
    const execResult = await batchDeleteGroupLocal(db, ids)
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  }
  catch (e) {
    console.error(e);
    return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
  }
}