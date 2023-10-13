import {getInstance} from './instance';
import {
	getTotalForCollectMessage,

	getCollectMessage as getMessageLocal,
	getCollectMessageById as getMessageByIdLocal,
	getCollectMessageByMsgId as getMessageByMsgIdLocal,

	searchCollectMessageByContent as searchMessageByContentLocal,

	insertCollectMessage as insertMessageLocal,

	updateCollectMessageById as updateMessageByIdLocal,
	updateCollectMessageByMsgId as updateMessageByMsgIdLocal,

	batchDeleteCollectMessage as batchDeleteMessageLocal,
	deleteAllCollectMessage as deleteAllMessageLocal,

	batchInsertCollectMessageList as batchInsertMessageListLocal,

} from '../sqls/collectMessage';
import {converSqlExecResult, formatResponse} from '../utils';
import {IMSDK} from '../../types';
import {DatabaseErrorCode} from '../constant';

export async function getCollectMessage(
  pageSize: number,
  seq: number,
) {
  try {
    const db = await getInstance();
    const execResult = await getMessageLocal(
      db,
      pageSize,
      seq,
    );
    // let data = formatResponse(
    //   converSqlExecResult(execResult[0], 'SnakeCase', []),
    // );
    let data = formatResponse(converSqlExecResult(execResult, 'SnakeCase', []));
    data.data.reverse();
    const res = await getTotalForCollectMessage(db);
    //console.info('getMessage getTotalForMessage res--------',res)
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

export async function getCollectMessageById(id: string) {
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

export async function searchCollectMessageByContent(
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

export async function getCollectMessageByMsgId(id: string) {
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

export async function updateCollectMessageById(message: IMSDK.Message) {
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

export async function updateCollectMessageByMsgId(message: IMSDK.Message) {
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

export async function batchDeleteCollectMessage(ids: string[]) {
  try {
    const db = await getInstance();
    const execResult = await batchDeleteMessageLocal(db, ids);
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

export async function deleteAllCollectMessage() {
  try {
    const db = await getInstance();
    const execResult = await deleteAllMessageLocal(db);
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

export async function insertCollectMessage(message: IMSDK.Message) {
  try {
    const db = await getInstance();
    const execResult = await insertMessageLocal(db, message);
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

export async function insertCollectMessageList(messageList: IMSDK.Message[]) {
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
    console.error(e, data);
    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e),
    );
  }
}