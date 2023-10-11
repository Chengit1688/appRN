import {getInstance} from './instance';
import {
  getConversationList as getConversationListLocal,
  getConversationById as getConversationByIdLocal,
  deleteConversationById as deleteConversationByIdLocal,
  updateConversationById as updateConversationByIdLocal,
  insertConversation as insertConversationLocal,
  updateConversationList as updateConversationListLocal,
  getConversationCountByGroupId as getConversationCountByGroupIdLocal,
  getConversationByIdAndType as getConversationByIdAndTypeLocal,
  getConversationCountByUserId as getConversationCountByUserIdLocal,
  getDisabledConversation as getDisabledConversationLocal,
  updateConversationListNotFullValue as updateConversationListNotFullValueLocal,
  batchDeleteConversation,
  batchInsertConversationList,
  deleteAllConversation as deleteAllConversationLocal,
  getConversationByType as getConversationByTypeLocal,
  updateConversationName as updateConversationNameLocal,
} from '../sqls/localConversation';
import {converSqlExecResult, formatResponse} from '../utils';
import {IMSDK} from '../../types';
import {DatabaseErrorCode} from '../constant';

export async function getConversationList() {
  try {
    const db = await getInstance();
    const execResult = await getConversationListLocal(db, 1);
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
    const execResult2 = await getConversationListLocal(db, 2);
    let data2 = converSqlExecResult(
      execResult2,
      'SnakeCase',
      [],
      {},
      {
        key: 'group',
        suffix: '_group',
      },
    );
    // data2 = data2.filter(item => item.group.group_id)
    data.data = data.data.concat(data2);
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

export async function getConversationById(conversationID: string) {
  try {
    const db = await getInstance();
    const execResult = await getConversationByIdLocal(db, conversationID);
    return formatResponse(
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
  } catch (e) {
    console.error(e);
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function getConversationByType(conversationType: number) {
  try {
    const db = await getInstance();
    const execResult = await getConversationByTypeLocal(db, conversationType);
    return formatResponse(
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
  } catch (e) {
    console.error(e);
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function getDisabledConversation() {
  try {
    const db = await getInstance();
    const execResult = await getDisabledConversationLocal(db);
    return formatResponse(
      converSqlExecResult(execResult[0], 'SnakeCase', [], {}),
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

export async function getConversationByIdAndType(
  conversationID: string,
  type: number,
) {
  try {
    let option;
    if (type == 1) {
      option = {
        key: 'user',
        suffix: '_user',
      };
    } else {
      option = {
        key: 'group',
        suffix: '_group',
      };
    }
    const db = await getInstance();
    const execResult = await getConversationByIdAndTypeLocal(
      db,
      conversationID,
      type,
    );
    return formatResponse(
      converSqlExecResult(execResult[0], 'SnakeCase', [], {}, option),
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

export async function getConversationCountByGroupId(groupId: string) {
  try {
    const db = await getInstance();
    const execResult = await getConversationCountByGroupIdLocal(db, groupId);
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
export async function updateConversationName(
  conversation_id: string,
  value: string,
) {
  try {
    const db = await getInstance();
    const execResult = await updateConversationNameLocal(
      db,
      conversation_id,
      value,
    );
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

export async function getConversationCountByUserId(groupId: string) {
  try {
    const db = await getInstance();
    const execResult = await getConversationCountByUserIdLocal(db, groupId);
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

export async function deleteConversationById(conversationID: string) {
  try {
    const db = await getInstance();
    const execResult = await deleteConversationByIdLocal(db, conversationID);
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

export async function deleteAllConversation() {
  try {
    const db = await getInstance();
    const execResult = await deleteAllConversationLocal(db);
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

export async function deleteConversationListByGroupId(ids: string[]) {
  try {
    const db = await getInstance();
    const execResult = await batchDeleteConversation(db, ids);
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

export async function updateConversationById(conversation: any) {
  try {
    const db = await getInstance();
    const execResult = await updateConversationByIdLocal(db, conversation);
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

export async function insertConversation(conversation: IMSDK.Conversation) {
  try {
    const db = await getInstance();
    const execResult = await insertConversationLocal(db, conversation);
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

export async function insertConversationList(
  conversationList: IMSDK.Conversation[],
) {
  try {
    const db = await getInstance();
    const execResult = await batchInsertConversationList(db, conversationList);
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

export async function updateConversationList(
  conversationList: IMSDK.Conversation[],
) {
  try {
    const db = await getInstance();
    const execResult = await updateConversationListLocal(db, conversationList);
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

export async function updateConversationListNotFullValue(
  conversationList: IMSDK.Conversation[],
) {
  try {
    const db = await getInstance();
    const execResult = await updateConversationListNotFullValueLocal(
      db,
      conversationList,
    );
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
