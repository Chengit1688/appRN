import {getInstance} from './instance';
import {
  getGroupMember as getGroupMemberLocal,
  updateGroupMemberById as updateGroupMemberByIdLocal,
  getGroupMemberById as getGroupMemberByIdLocal,
  insertGroupMember as insertGroupMemberLocal,
  getTotal,
  batchDeleteGroupMember,
  getGroupMemberTotal,
  getGroupMemberAdminOrOwner as getGroupMemberAdminOrOwnerLocal,
  batchInsertGroupMemberList,
} from '../sqls';
import {converSqlExecResult, formatResponse} from '../utils';
import {IMSDK} from '../../types';
import {DatabaseErrorCode} from '../constant';

export async function getGroupMemberList(
  pageSize: number,
  pageNo: number,
  groupId: string,
) {
  if (!groupId) return [];
  try {
    const db = await getInstance();
    const execResult = await getGroupMemberLocal(db, pageSize, pageNo, groupId);
    // 这里永远拿到的只有1个，有问题在改回
    // let data = formatResponse(
    //   converSqlExecResult(
    //     execResult[0],
    //     'SnakeCase',
    //     [],
    //     {},
    //     {
    //       key: 'user',
    //       suffix: '_user',
    //     },
    //   ),
    // );
    let data = formatResponse(
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
    const res = await getGroupMemberTotal(db, groupId);

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

export async function getGroupMemberById(id: string) {
  try {
    const db = await getInstance();
    const execResult = await getGroupMemberByIdLocal(db, id);
    const data = formatResponse(
      converSqlExecResult(
        execResult[0],
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

export async function insertGroupMember(groupMember: any) {
  try {
    const db = await getInstance();
    const execResult = await insertGroupMemberLocal(db, groupMember);
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

export async function updateGroupMemberById(groupMember: any) {
  try {
    const db = await getInstance();
    const execResult = await updateGroupMemberByIdLocal(db, groupMember);
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
export async function getGroupMemberAdminOrOwner(id: string) {
  try {
    const db = await getInstance();
    const execResult = await getGroupMemberAdminOrOwnerLocal(db, id);
    return formatResponse(converSqlExecResult(execResult, 'SnakeCase', []));
  } catch (e) {
    console.error(e);
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function deleteGroupMembers(ids: string[]) {
  try {
    const db = await getInstance();
    const execResult = await batchDeleteGroupMember(db, ids);
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

export async function insertGroupMemberList(groupMember: any[]) {
  try {
    const db = await getInstance();
    const execResult = await batchInsertGroupMemberList(db, groupMember);
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
