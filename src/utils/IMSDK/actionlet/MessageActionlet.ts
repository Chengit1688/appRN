import {IMSDK} from '../types';
import {ConversationActionlet} from './ConversationActionlet';
import {BaseActionlet} from './BaseActionlet';
import uuid from 'react-native-uuid';
import {encrypt, decrypt} from '@/utils/aes/native';
import {
  insertCurrentMessageList,
  updateMessageItem,
  checkoutConversation,
  updateCurrentMessageList,
  deleteCurrentMessageList,
} from '@/store/reducers/conversation';
import {parseContent, transfer311ToText} from '@/utils/common';
import {StorageFactory} from '@/utils/storage';
import {throttle} from 'lodash';

let messageQueueList = [];
const messageThrottle = throttle((callback: () => void) => {
  callback();
}, 500);

interface CreateMessageParams {
  recv_id: string;
  conversation_type: IMSDK.ConversationType;
  type: IMSDK.MessageType;
  content: string;
  at_list?: (string | number)[];
}
export interface MessagePayload extends CreateMessageParams {}
export abstract class MessageActionlet extends ConversationActionlet {
  createMessage(msg: CreateMessageParams) {
    return {
      type: msg.type,
      content: msg.content,
      recv_id: msg.recv_id,
      conversation_type: msg.conversation_type,
      status: IMSDK.MessageStatus.UNREAD,
      at_list: msg.at_list,
    };
  }

  createMessageEntity(conv_id, data) {
    if (!data) return;
    const content = parseContent(data);
    return {
      client_msg_id: data.client_msg_id,
      msg_id: data.msg_id,
      conversation_id: conv_id,
      send_id: data.send_id,
      send_nickname: data.send_nickname,
      send_face_url: data.send_face_url,
      send_time: data.send_time,
      conversation_type: data.conversation_type,
      bus_id: data.send_id,
      type: data.type,
      status: data.status || IMSDK.MessageStatus.UNREAD,
      content: content,
      role: data.role || '',
      seq: data.seq,
    };
  }

  createTextMessage(data: any): MessagePayload {
    return this.createMessage(data);
  }

  // createFaceMessage(data: CreateMessageParams<{ text: string }>): MessagePayload {
  //     return this.createMessage(
  //         data,
  //         IMSDK.MessageType.FACE,
  //         data.payload.text,
  //     );
  // }

  /**
   * 发送消息
   */
  async sendMessage(
    payload: MessagePayload,
    message: Partial<Omit<IMSDK.Message, 'content'>> & {content: string},
    conversation: IMSDK.Conversation,
  ) {
    payload.content = encrypt(payload.content);
    const client_msg_id = message.client_msg_id
      ? message.client_msg_id
      : uuid.v4();
    const {user_id} =
      (await StorageFactory.getSession('USER_LOGIN_INFO')) || {};
    await this.comlink.insertMessage({...message, client_msg_id});
    // Object.assign(newMsg,this.getMessageContent(newMsg))
    if ([1, 2, 3, 6, 7, 9, 10].includes(message.type)) {
      this.store.dispatch(
        insertCurrentMessageList({
          data: [
            {
              ...message,
              client_msg_id,
              send_id: user_id,
              send_time: Date.now(),
            },
          ],
        }),
      );
    }
    const newMsg = await this.post<IMSDK.Message>('/api/chat/message_send', {
      client_msg_id,
      ...payload,
    });
    if (newMsg?.msg_id) {
      newMsg.content = decrypt(newMsg.content);
      // 不匹配，调整
      newMsg.conversation_id = message.conversation_id;
      this.comlink.insertMessage({
        ...newMsg,
        client_msg_id,
        conversation_id: message.conversation_id,
        ...(message.type === 6 ? {file_name: message.file_name} : {}),
      });
    }

    const _conversation = Object.assign({}, conversation);
    _conversation.latest_message = newMsg.msg_id;
    _conversation.max_seq = newMsg.seq;
    // Object.assign(newMsg,this.getMessageContent(newMsg))

    this.store.dispatch(checkoutConversation(_conversation.conversation_id));
    await this.updateConversationById(_conversation);
    this.getConversationList({update: true, updateRedux: true});
    this.store.dispatch(updateMessageItem({data: newMsg}));
    return _conversation;
  }

  /**
   * 获取群最大seq
   */
  async getMyGroupMaxSeq(page, pageSize) {
    return this.post('/api/group/get_my_group_max_seq', {
      operation_id: Date.now(),
      page,
      pageSize,
    });
  }
  /**
   * 获取好友最大seq
   */
  async getMyGFriendMaxSeq(page, pageSize) {
    return this.post('/api/friend/get_friends_msg_max_seq', {
      operation_id: Date.now(),
      page,
      pageSize,
    });
  }

  /**
   * 群发送消息
   */

  async multiSendMessage({message_list, content, type, conversation_type}) {
    this.comlink.insertMassSendMsg({
      mass_send_id: uuid.v4(),
      send_time: Date.now(),
      content: content,
      recv_id: JSON.stringify(
        message_list.map(i => {
          return {
            user_id: i.recv_id,
            nick_name: i.nick_name,
          };
        }),
      ),
    });
    // await this.comlink.insertMessage({ ...message, client_msg_id })
    return this.post('/api/chat/message_multi_send', {
      message_list: message_list.map(i => {
        return {
          recv_id: i.recv_id,
          client_msg_id: i.client_msg_id,
        };
      }),
      content: encrypt(content),
      type,
      conversation_type,
      operation_id: Date.now(),
    });
  }

  /**
   * 转发消息
   */
  async forwardSendMessage(message_list) {
    const time = Date.now();
    message_list.map(i => {
      this.comlink.insertMassSendMsg({
        mass_send_id: uuid.v4(),
        send_time: time,
        // send_id: i.send_id,
        content: i.content,
        recv_id: JSON.stringify([
          {
            user_id: i.recv_id,
            nick_name: i.nick_name,
          },
        ]),
      });
    });
    return this.post('/api/chat/message_forward', {
      operation_id: time,
      message_list: message_list.map(i => {
        return {
          recv_id: i.recv_id,
          client_msg_id: i.client_msg_id,
          send_id: i.send_id,
          content: encrypt(i.content),
          type: i.type,
          conversation_type: i.conversation_type,
        };
      }),
    });
  }

  private modifyMessage(
    msg_list: IMSDK.Message[],
    status: IMSDK.MessageStatus,
    conversation_id,
    conversation_type,
  ) {
    return this.post('/api/chat/message_change', {
      msg_id_list: msg_list.map(msg => msg.msg_id),
      // conversation_id,
      // conversation_type,
      status,
    });
  }

  private messagePull(
    seqList: any,
    conversation_type: any,
    recv_id: any,
    seq: any,
    pageSize: number,
  ) {
    // return this.get<{list: IMSDK.Message[]}>('/api/chat/message_pull_v2', {
    //   seq_list: seqList,
    //   operation_id: Date.now(),
    //   recv_id,
    //   conversation_type,
    //   seq,
    //   page_size: pageSize,
    // });
    return this.post<{list: IMSDK.Message[]}>('/api/chat/message_pull_v2', {
      seq_list: seqList,
      operation_id: Date.now(),
      recv_id,
      conversation_type,
      seq,
      page_size: pageSize,
    });
  }

  clearMsg(conversation_type, conversation_id, max_seq) {
    return this.post('/api/chat/message_clear', {
      operation_id: Date.now(),
      conversation_id,
      conversation_type,
      max_seq,
    });
  }

  /**
   * 修改消息状态
   */
  async modifyMessageStatus(conversation_id: string) {
    // 不确定是否需要修改服务端
    //先改本地
    await this.comlink.modifyMessageStatus(conversation_id);
  }

  async fetchMessage(
    max_seq: number,
    conversation_type: any,
    recv_id: string,
    seq: number,
    conversation_id: string,
    pageSize: number,
  ) {
    const localRes = await this.comlink.getMessage(
      pageSize,
      conversation_id,
      seq,
    );
    const localResAll = await this.comlink.getMessageAll(
      pageSize,
      conversation_id,
      seq,
    );
    // const localData = localRes.data.map((item: any) => item.seq);
    const localDataAll = localResAll.data.map((item: any) => item.seq);

    const decreasingNumbersArray = Array.from(
      {length: pageSize},
      (_, index) => seq - index,
    );

    // 找到缺失的项

    const missingItems = decreasingNumbersArray
      .filter(nums => nums > 0)
      .filter(item => !localDataAll.includes(item));

    // const localSeq = await this.comlink.getMaxSeq(conversation_id);
    // const minSeq = await this.comlink.getMinSeq(conversation_id);
    // console.log(max_seq, seq, localRes, localSeq, minSeq, '====>本地数据');

    // 本地有数据
    // const lastestMsg = localRes.data[localRes.data.length - 1];
    let list = localRes.data;

    //  if (lastestMsg?.seq <= localSeq && lastestMsg?.seq >= minSeq) {
    //    return Promise.resolve(localRes.data);
    //  } else {
    //    return [];
    //  }

    if (missingItems.length > 0) {
      const res = await this.messagePull(
        missingItems,
        conversation_type,
        recv_id,
        seq,
        pageSize,
      );
      let seq_num = seq;
      if (res?.list && res?.list.length) {
        // res.list = res.list.filter(item => item.status !== 2)
        let arr = [],
          obj: any = {};
        res.list.forEach(item => {
          obj = item;

          // arr.push(messageEntity);
          // if (seq_num > item.seq) {
          //   console.log('noseq==========>', item.seq); //缺少seq
          //   new Array(seq_num - item.seq).fill(1).forEach((item, index) => {
          //     const id = uuid.v4();
          //     const messageEntity = this.createMessageEntity(
          //       obj.conversation_id,
          //       {
          //         ...obj,
          //         status: -99,
          //         seq: seq_num - index,
          //         client_msg_id: id,
          //         msg_id: id,
          //         content: '',
          //       },
          //     );
          //     arr.push(messageEntity);
          //   });
          // }
          item.content = decrypt(item.content);
          if (item.type === IMSDK.MessageType.GROUP_NOTIFICATION_NOTIFY) {
            item = transfer311ToText(item);
          }

          // if (item.content.includes('quote_info')) {
          //     const a = item.content
          // }
          // item.content = parseContent(item);
          item.is_collect = item.is_collect ? 1 : 0;
          const messageEntity = this.createMessageEntity(obj.conversation_id, {
            ...obj,
            status: item.status,
            seq: item.seq,
            client_msg_id: item.client_msg_id,
            msg_id: item.msg_id,
            content: item.content,
            is_collect: item.is_collect,
          });
          arr.push(messageEntity);
          // seq_num = item.seq - 1;
        });
        const newList = arr.reverse();
        list = newList.concat(list);
        await this.insertMessageList(newList);
        // return Promise.resolve(list);
      }
    }
    return Promise.resolve(list);
  }

  /**
   * 队列异步插入数据库,用于高并发时
   * @param message
   */
  insertMessageByThrottle(message: IMSDK.Message) {
    messageQueueList.push(message);
    messageThrottle(async () => {
      const tempQueueList = Object.assign([], messageQueueList);
      // if (tempQueueList.length >= 10) {
      messageQueueList = [];
      this.comlink.insertMessageList(tempQueueList);
      // }
    });
  }

  insertMessageList(list: IMSDK.Message[]) {
    // list = list.filter(_ => ![311].includes(_.type))
    return this.comlink.insertMessageList(list);
  }

  async updateMessageById(
    msg: IMSDK.Message | IMSDK.Message['msg_id'],
    modify: Partial<IMSDK.Message>,
  ) {
    if (typeof msg === 'string') {
      const res = await this.comlink.getMessageById(msg);
      if (res?.data?.length) msg = res.data[0];
    }
    return this.comlink.updateMessageById(Object.assign({}, msg, modify));
  }

  /**
   * 删除消息
   */
  async deleteMessage(msg_list: IMSDK.Message[], conversation) {
    const conv_id =
      conversation.type === 1
        ? conversation.user.user_id
        : conversation.group.group_id;
    const res = await this.modifyMessage(
      msg_list,
      IMSDK.MessageStatus.DELETED,
      conv_id,
      conversation.type,
    );
    if (!res) return;
    const conversationList = await this.getConversationList();
    await Promise.all(
      msg_list.map(async msg => {
        const currentConv = conversationList?.find(
          _ => _.conversation_id === msg.conversation_id,
        );
        if (currentConv) {
          const rMsg = await this.comlink.getMessage(
            1000,
            1,
            msg.conversation_id,
          );
          if (rMsg?.data?.length) {
            const newConv = Object.assign({}, currentConv);
            const msgList: IMSDK.Message[] = rMsg.data.filter(
              _ => _.status !== 100,
            );
            if (msgList.length === 1) delete newConv.latest_message;
            else {
              const lastMsg = msgList.at(-1);
              if (lastMsg.msg_id === msg.msg_id) {
                newConv.latest_message = msgList.at(-2).msg_id;
              }
            }
            await this.updateConversationById(newConv);
          }
        }
        await this.updateMessageById(msg, {status: 3});
      }),
    );
    return this.getConversationList();
  }

  /**
   * 删除消息
   */
  async deleteLocalMessage(msg_list: IMSDK.Message[], currentConv) {
    let msgData;
    await Promise.all(
      msg_list.map(async msg => {
        if (currentConv) {
          const newConv = Object.assign({}, currentConv);
          if (newConv.latest_message === msg.msg_id) {
            newConv.latest_message = '';
            await this.updateConversationById(newConv);
          }
        }
        const {data} = await this.comlink.getMessageByMsgId(msg);
        await this.updateMessageById(data[0], {status: 3});
        msgData = data[0];
      }),
    );
    if (msgData) {
      await this.store.dispatch(
        deleteCurrentMessageList({client_msg_id: msgData.client_msg_id}),
      );
    }
    return msgData;
  }

  /**
   * 撤回消息
   */
  async revokeMessage(msg_list: IMSDK.Message[], conversation) {
    const {user_id} = StorageFactory.getSession('USER_LOGIN_INFO') || {};
    let conv_id = '';
    if (conversation.type === 1) {
      conv_id = [conversation.user.user_id, user_id]
        .sort((a, b) => a - b)
        .join('_');
    } else {
      conv_id = conversation.group.group_id;
    }
    await this.modifyMessage(
      msg_list,
      IMSDK.MessageStatus.REVOKED,
      conv_id,
      conversation.type,
    );
    // const conversationList = await this.getConversationList({updateRedux: false})
    // await Promise.all(msg_list.map(async (msg) => {
    //     const currentConv = conversationList?.find(_ => _.conversation_id === msg.conversation_id)
    //     if (currentConv) {
    //         const rMsg = await this.comlink.getMessage(1000, msg.conversation_id, 1)
    //         if (rMsg?.data?.length) {
    //             const newConv = Object.assign({}, currentConv)
    //             const msgList: IMSDK.Message[] = rMsg.data.filter(_ => _.status !== 100)
    //             if (msgList.length === 1) delete newConv.latest_message
    //             else {
    //                 const lastMsg = msgList.at(-1)
    //                 if (lastMsg.msg_id === msg.msg_id) {
    //                     newConv.latest_message = msgList.at(-2).msg_id
    //                 }
    //             }
    //             await this.updateConversationById(newConv)
    //         }
    //     }
    //     await this.updateMessageById(msg, { status: 2 })
    // }))
    // return this.getConversationList()
  }
  /**
   * 设置消息已读
   */
  async readMessage(msg_list: IMSDK.Message[], conversation) {
    await this.modifyMessage(
      msg_list,
      IMSDK.MessageStatus.READED,
      conversation.conversation_id,
      conversation.type,
    );
  }

  /**
   * 更新消息是否收藏消息
   */
  async collectMessage(msg: IMSDK.Message, flag?: boolean) {
    this.comlink.collectMessage(msg, flag);
  }

  async getCollectMessage(keyword: string, type?: number | number[]) {
    this.comlink.searchCollectMessageByContent(keyword, type);
  }

  /**
   * 获取群发消息历史记录
   */
  async getMassSendMsgList() {
    return this.comlink.getMassSendMsgList();
  }

  /**
   * 删除群发消息历史记录
   */
  async batchDeleteMassMessage(ids) {
    this.comlink.batchDeleteMassMessage(ids);
  }

  /**
   * 清空本地消息数据
   */
  async deleteAllMessage() {
    this.comlink.deleteAllMessage();
  }

  /**
   * 清空用户消息数据
   */
  async deleteMessageByUserId(user_ids, conv_id) {
    this.comlink.deleteMessageByUserId(user_ids, conv_id);
    const {currentConversation, currentMessageList} =
      this.store.getState().conversation;
    if (currentConversation?.conversation_id === conv_id) {
      const list = currentMessageList.filter(
        msg => !msg.send_id || !user_ids.includes(msg.send_id),
      );
      this.store.dispatch(
        updateCurrentMessageList({
          data: list,
        }),
      );
    }
  }
}
