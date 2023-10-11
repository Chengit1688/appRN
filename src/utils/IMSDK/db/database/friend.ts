import {getInstance} from './instance';
import {
  getFriend as getFriendLocal,
  updateFriendById as updateFriendByIdLocal,
  getFriendById as getFriendByIdLocal,
  batchDeleteFriend,
  searchFriendByName as searchFriendByNameLocal,
  batchInsertFriendList,
} from '../sqls';
import {converSqlExecResult, formatResponse} from '../utils';
import {IMSDK} from '../../types';
import {DatabaseErrorCode} from '../constant';

export async function getFriendList() {
  try {
    const db = await getInstance();

    const execResult = await getFriendLocal(db);
    const data = formatResponse(
      converSqlExecResult(
        execResult,
        'SnakeCase',
        [],
        {},
        {
          key: 'user',
          suffix: '_user',
        },
      ),
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

export async function getFriendById(id: string) {
  try {
    const db = await getInstance();
    const execResult = await getFriendByIdLocal(db, id);
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

export async function searchFriendByName(keyword: string) {
  try {
    const db = await getInstance();
    const execResult = await searchFriendByNameLocal(db, keyword);
    return formatResponse(
      converSqlExecResult(execResult[0], 'SnakeCase', [], {
        key: 'user',
        suffix: '_user',
      }),
    );
  } catch (e) {
    console.error(e);
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function deleteFriends(ids: string[]) {
  try {
    const db = await getInstance();
    const execResult = await batchDeleteFriend(db, ids);
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

export async function updateFriendById(friend: any) {
  try {
    const db = await getInstance();
    const execResult = await updateFriendByIdLocal(db, friend);
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

export async function insertFriendList(friend: any[]) {
  try {
    const db = await getInstance();
    const execResult = await batchInsertFriendList(db, friend);
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
