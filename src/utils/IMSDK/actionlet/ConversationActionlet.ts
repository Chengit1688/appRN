import {MessageActionlet} from './MessageActionlet';
import {UserActionlet} from './UserActionlet';
import {IMSDK, ConversationConfig} from '../types';
import {
  updateConversationItem,
  updateConversationList,
  removeConversationItem,
} from '@/store/reducers/conversation';
import {getUserConfig} from '@/store/actions';
import {throttle} from 'lodash-es';

export interface GetConversationListParams {
  page?: number;
  page_size?: number;
}

export interface GetConversationListResponse {
  count: number;
  page: number;
  page_size: number;
  list: IMSDK.Conversation[];
}

type ConversationId = IMSDK.Conversation['conversation_id'];
type ConversationList = IMSDK.Conversation[];

const updateUserConfig = throttle((updateArray, that) => {
  if (updateArray.length)
    that.updateUserConfig(JSON.stringify({conversation: updateArray}));
}, 2000);

export abstract class ConversationActionlet extends UserActionlet {
  private recievedMsgs: IMSDK.Message[] = [];

  /**
   * 获取会话的消息列表
   * @param conv_id conversation id
   */
  async getMessageList(data: {conv_id: string; seq: number}) {
    return Promise.resolve([]);
  }

  /**
   * 生成会话实例
   * @param conv_id conversation id
   * @param data 会话数据
   */
  createConversationEntity(conv_id: string, data: any) {
    const entity = {
      conversation_id: conv_id,
      type: data.conversation_type,
      friend: '',
      group_id: '',
      latest_message: data.msg_id,
      face_url: data.face_url,
      name: data.name,
      status: 1,
      unread_count: 0,
      is_disturb: 2,
      is_topchat: 2,
      max_seq: data.seq || 1,
    };
    if (data.conversation_type === IMSDK.ConversationType.C2C) {
      entity.friend = data.recv_id;
    } else if (data.conversation_type === IMSDK.ConversationType.GROUP) {
      entity.group_id = data.conversation_id;
    }
    return entity;
  }

  /**
   * 设置消息已读
   * @param conv_id conversation id
   */
  setMessageRead(conv_id: string) {
    const {type, id} = this.parseConversationId(conv_id);

    // TODO 调用本地数据库获取当前会话的最后一条消息的seq，作为参数ack_seq传入
    return this.post('/api/chat/conversation_ack_seq', {
      conversation_type: type,
      conversation_id: id,
      ack_seq: 0,
    });
  }

  conversation_ack_seq(conversation_type, conversation_id, ack_seq) {
    return this.post('/api/chat/conversation_ack_seq', {
      operation_id: Date.now(),
      conversation_type,
      conversation_id,
      ack_seq,
    });
  }

  /**
   * 获取最新会话接口
   * @param conv_id conversation id
   */
  fetchConversationList(params) {
    return this.get<IMSDK.UserProfile | null>('/api/chat/conversation_list', {
      operation_id: Date.now(),
      ...params,
    });
  }

  // getMessageContent(msg:IMSDK.Message){
  //     const newMsg =Object.assign({},msg)
  //     let content
  //     try {
  // content = JSON.parse(msg.content)
  // switch (msg.type) {
  //     case 1:
  //         content = content.text
  //         break
  //     case 6:
  //         content = content.file_info.file_name
  //         break
  // }
  //     } catch (error) {
  //         console.error(error)
  //     }
  //     if (content) newMsg.content = content
  //     return newMsg
  // }

  /**
   * 获取会话列表
   * @param update 服务端上传
   * @param sync 同步服务端配置
   * @param version 单聊会话的最大version，用于增量获取单聊会话
   */
  async getConversationList(
    {update = false, sync = false, updateRedux = true} = {},
    params?: GetConversationListParams,
  ): Promise<ConversationList> {
    const res = await this.comlink.getConversationList();
    if (res?.data.length) {
      const updateArray: ConversationConfig[] = [];
      if (sync) await this.store.dispatch(getUserConfig());
      let list = (await Promise.all(
        res.data &&
          res.data.map(async (conversation: IMSDK.Conversation) => {
            if (conversation.latest_message) {
              const r = await this.comlink.getMessageByMsgId(
                conversation.latest_message,
              );

              if (r?.data?.[0]) {
                const msg = r.data[0];
                if (msg.seq != null) msg.seq++;
                else msg.seq = 1;
                // Object.assign(msg,this.getMessageContent(msg))
                conversation.msg = msg;
              }
            }

            const state = this.store.getState();
            if (sync && state.user?.config?.conversationMap) {
              const config =
                state.user.config.conversationMap[conversation.conversation_id];
              if (config) {
                conversation.is_disturb = config.is_nocare;
                conversation.is_topchat = config.is_top;
                conversation.update_time = config.update_time;
              }
            }
            if (update) {
              const {is_disturb, is_topchat, conversation_id, update_time} =
                conversation;
              if (is_disturb || is_topchat) {
                updateArray.push({
                  conversation_id,
                  is_top: is_topchat,
                  is_nocare: is_disturb,
                  update_time,
                });
              }
            }
            return conversation;
          }),
      )) as ConversationList;
      // list = sort(list)
      if (updateRedux) {
        this.store.dispatch(updateConversationList(list));
      }
      if (update) {
        updateUserConfig(updateArray, this);
      }
      return (
        list
          //todo 暂时容错
          .filter(_ => [1, 2, 3].includes(_.type))
      );
    } else return [];
  }
  private updateConversation(_conversation: any) {
    const conversation = Object.assign(
      {
        latest_message: null,
        group_id: null,
        friend: null,
      },
      _conversation,
      {
        update_time: Date.now(),
      },
    );
    const {type} = conversation;
    delete (conversation as unknown as Record<string, unknown>).msg;
    if (type === 1) {
      if (conversation.user) conversation.friend = conversation.user.user_id;
      delete conversation.user;
    } else {
      const group_id = conversation.group?.group_id;
      if (group_id) {
        delete conversation.group;
        conversation.group_id = group_id;
      }
    }
    return conversation;
  }

  updateUserConfigWithConv() {
    // "conversation" : [
    //     {
    //       "conversation_id" : "122321_433321",
    //       "is_top" : 1,
    //       "is_nocare" : 2
    //     },
    //     {
    //       "conversation_id" : "1223213312321",
    //       "is_top" : 2,
    //       "is_nocare" : 2
    //     }
    //   ]
  }

  /** 更新会话列表 **/
  async updateConversationList(list: ConversationList) {
    await this.comlink.updateConversationList(
      list.map(this.updateConversation),
    );
    //   return this.getConversationList({update,sync})
  }
  /** 更新会话 **/
  async updateConversationById(conversation: IMSDK.Conversation) {
    return await this.comlink.updateConversationById(
      this.updateConversation(conversation),
    );
    // return this.getConversationList({update, updateRedux})
  }

  /** 会话置顶 **/
  async topConversationList(
    conversation: IMSDK.Conversation,
  ): Promise<ConversationList> {
    const newConversation = Object.assign({}, conversation);
    if (newConversation.is_topchat == 1) {
      newConversation.is_topchat = 2;
    } else {
      newConversation.is_topchat = 1;
    }
    this.store.dispatch(updateConversationItem({data: newConversation}));
    await this.updateConversationById(newConversation);
    return this.getConversationList({update: true});
  }

  /** 消息免打扰 **/
  async muteConversation(conversation: IMSDK.Conversation) {
    const newConversation = Object.assign({}, conversation);
    newConversation.is_disturb = newConversation.is_disturb === 1 ? 2 : 1;
    await this.updateConversationById(newConversation);
    return this.getConversationList({update: true});
  }
  /**
   * 删除会话
   */
  async deleteConversation(id: ConversationId) {
    await this.comlink.deleteConversationById(id);
    this.store.dispatch(removeConversationItem({data: id}));
  }

  /**
   * 搜索
   * @returns Promise<[Message,Friend,Group,File]>
   * **/
  async search(
    keyword: string,
    type?: IMSDK.MessageType,
  ): Promise<[IMSDK.SearchMessageGroup[], ...unknown[]]> {
    // const method = {
    //   chat:'searchMessageByContent',
    //   contacts:'searchFriendById',
    //   group:'searchGroupById'
    // }[location.pathname.slice(1)]

    // if (method === 'searchMessageByContent') return console.error(`
    //   require message type,...
    //   TEXT,
    //   FACE,
    //   PIC,
    //   VOICE,
    //   VIDEO,
    //   FILE
    // `)
    // return this.comlink[method](keyword,...method === 'searchMessageByContent' ? [type] : [])
    const res = await Promise.all([
      this.comlink.searchMessageByContent(keyword),
      this.comlink.searchFriendByName(keyword),
      this.comlink.searchGroupByName(keyword),
      this.comlink.searchMessageByContent(keyword, 6, true),
    ]);
    // if(res[3].length>0&&res[3].data&&res[3].data.length>0){
    //     JSON.parse(res[3].data[0].content)
    // }
    for (let i in res[3].data) {
      if (res[3].data[i].content) {
        res[3].data[i].fileName = JSON.parse(
          res[3].data[i].content,
        ).file_info.file_name;
      }
    }

    const msg = (res[0].data as IMSDK.Message[]).reduce(async (acc, cur) => {
      let conversationAttr = {};
      const {conversation_id, conversation_type} = cur;
      acc = await acc;
      const lastData = acc.at(-1) as IMSDK.SearchMessageGroup;
      if (conversation_id === lastData?.conversation_id) {
        lastData.data.push(cur);
      } else {
        const r = await this.comlink.getConversationByIdAndType(
          conversation_id,
          conversation_type,
        );
        if (r?.data?.[0]) {
          const data = r.data[0];
          if (data.group) Object.assign(conversationAttr, data.group);
          if (data.user)
            Object.assign(conversationAttr, data.user, {
              name: data.user.nick_name,
            });
        }
        //
        acc.push({
          conversation_id,
          conversation_type,
          data: [cur],
          ...conversationAttr,
        });
      }
      return acc;
    }, [] as any);
    return [await msg, ...res.slice(1).map(_ => _.data)];

    //  as [IMSDK.SearchMessageGroup[],...unknown[]]
  }
  /**
   * 搜索
   * @returns Promise<[Message,Friend,Group]>
   * **/
  async searchByType(
    keyword: string,
    type?: IMSDK.MessageType,
    isFile?: boolean,
  ): Promise<[IMSDK.SearchMessageGroup[], ...unknown[]]> {
    const res = await this.comlink.searchMessageByContent(
      keyword,
      type,
      isFile,
    );
    if (res.errCode === 0) {
      return res.data;
    }
  }

  /** 清空全部会话 **/
  async deleteAllConversation() {
    return await this.comlink.deleteAllConversation();
  }
}
