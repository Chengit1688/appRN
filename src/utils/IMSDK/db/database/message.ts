import {getInstance} from './instance';
import {
  getMessage as getMessageLocal,
  updateMessageById as updateMessageByIdLocal,
  batchDeleteMessage as batchDeleteMessageLocal,
  deleteAllMessage as deleteAllMessageLocal,
  insertMessage as insertMessageLocal,
  getMessageById as getMessageByIdLocal,
  getMessageByMsgId as getMessageByMsgIdLocal,
  searchMessageByContent as searchMessageByContentLocal,
  searchMessageByContentAndConversationId as searchMessageByContentAndConversationIdLocal,
  searchMessageByContentAndConvIdAndCollect as searchMessageByContentAndConvIdAndCollectocal,
  updateMessageByMsgId as updateMessageByMsgIdLocal,
  clearMessageByConversationId as clearMessageByConversationIdLocal,
  getTotalForMessage,
  batchInsertMessageList as batchInsertMessageListLocal,
  deleteLocalMessageByUserId,
  deleteLocalMessageByConvId,
  getMaxSeq as getMaxSeqLocal,
  getMinSeq as getMinSeqLocal,
  modifyMessageStatus as modifyMessageStatusLocal,
  getMessageAll as getMessageAllLocal,
} from '../sqls';
import {converSqlExecResult, formatResponse} from '../utils';
import {IMSDK} from '../../types';
import {DatabaseErrorCode} from '../constant';

export async function getMaxSeq(conversation_id: any) {
  try {
    const db = await getInstance();
    const execResult = await getMaxSeqLocal(db, conversation_id);
    let data = formatResponse(
      converSqlExecResult(execResult[0], 'SnakeCase', []),
    );

    return data.data[0].seq;
  } catch (e) {
    console.error(e);
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function getMinSeq(conversation_id: any) {
  try {
    const db = await getInstance();
    const execResult = await getMinSeqLocal(db, conversation_id);
    let data = formatResponse(
      converSqlExecResult(execResult[0], 'SnakeCase', []),
    );

    return data.data[0].seq;
  } catch (e) {
    console.error(e);
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function modifyMessageStatus(conversation_id: any) {
  try {
    const db = await getInstance();
    const execResult = await modifyMessageStatusLocal(db, conversation_id);
    let data = formatResponse(
      converSqlExecResult(execResult[0], 'SnakeCase', []),
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

export async function getMessage(
  pageSize: number,
  conversation_id: string,
  seq: number,
) {
  try {
    const db = await getInstance();
    const execResult = await getMessageLocal(
      db,
      pageSize,
      conversation_id,
      seq,
    );
    // let data = formatResponse(
    //   converSqlExecResult(execResult[0], 'SnakeCase', []),
    // );
    let data = formatResponse(converSqlExecResult(execResult, 'SnakeCase', []));
    data.data.reverse();
    const res = await getTotalForMessage(db, conversation_id);
    //console.debug('getMessage getTotalForMessage res--------',res)
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

export async function getMessageAll(
  pageSize: number,
  conversation_id: string,
  seq: number,
) {
  try {
    const db = await getInstance();
    const execResult = await getMessageAllLocal(
      db,
      pageSize,
      conversation_id,
      seq,
    );
    // let data = formatResponse(
    //   converSqlExecResult(execResult[0], 'SnakeCase', []),
    // );
    let data = formatResponse(converSqlExecResult(execResult, 'SnakeCase', []));
    data.data.reverse();
    const res = await getTotalForMessage(db, conversation_id);
    //console.debug('getMessage getTotalForMessage res--------',res)
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

export async function getMessageById(id: string) {
  try {
    const db = await getInstance();
    const execResult = await getMessageByIdLocal(db, id);
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

export async function searchMessageByContent(
  keyword: string,
  type?: IMSDK.MessageType,
  isFile?: boolean,
) {
  try {
    const db = await getInstance();
    const execResult = await searchMessageByContentLocal(
      db,
      keyword,
      type,
      isFile,
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

export async function searchMessageByContentAndConversationId(
  keyword: string,
  type?: IMSDK.MessageType,
  conversation_id?: string,
) {
  try {
    const db = await getInstance();
    const execResult = await searchMessageByContentAndConversationIdLocal(
      db,
      keyword,
      type,
      conversation_id,
    );
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

export async function searchMessageByContentAndConvIdAndCollect(
  keyword: string,
  type?: IMSDK.MessageType | IMSDK.MessageType[],
  conversation_id?: string,
) {
  try {
    const db = await getInstance();
    const execResult = await searchMessageByContentAndConvIdAndCollectocal(
      db,
      keyword,
      type,
      conversation_id,
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

export async function getMessageByMsgId(id: string) {
  try {
    const db = await getInstance();
    const execResult = await getMessageByMsgIdLocal(db, id);
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

export async function updateMessageById(message: IMSDK.Message) {
  try {
    const db = await getInstance();
    const execResult = await updateMessageByIdLocal(db, message);
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

export async function updateMessageByMsgId(message: IMSDK.Message) {
  try {
    const db = await getInstance();
    const execResult = await updateMessageByMsgIdLocal(db, message);
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

export async function clearMessageByConversationId(ids: string[]) {
  try {
    const db = await getInstance();
    const execResult = await clearMessageByConversationIdLocal(db, ids);
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

export async function batchDeleteMessage(ids: string[]) {
  try {
    const db = await getInstance();
    const execResult = await batchDeleteMessageLocal(db, ids);
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  } catch (e) {
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function deleteAllMessage() {
  try {
    const db = await getInstance();
    const execResult = await deleteAllMessageLocal(db);
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  } catch (e) {
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function insertMessage(message: IMSDK.Message) {
  try {
    const db = await getInstance();
    const execResult = await insertMessageLocal(db, message);
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  } catch (e) {
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function insertMessageList(messageList: IMSDK.Message[]) {
  let data = JSON.parse(JSON.stringify(messageList));
  data.forEach(item => {
    delete item?.be_operator_list;
    delete item?.time_type;
  });
  try {
    const db = await getInstance();
    const execResult = await batchInsertMessageListLocal(db, data);
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  } catch (e) {
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function deleteMessageByUserId(ids: string[], conv_id) {
  try {
    const db = await getInstance();
    const execResult = await deleteLocalMessageByUserId(db, ids, conv_id);
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  } catch (e) {
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}

export async function deleteMessageByConvId(conv_id) {
  try {
    const db = await getInstance();
    const execResult = await deleteLocalMessageByConvId(db, conv_id);
    return formatResponse(converSqlExecResult(execResult[0], 'SnakeCase', []));
  } catch (e) {
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}
