import AsyncStorage from '@react-native-async-storage/async-storage';
import imsdk from '@/utils/IMSDK';

import {IMSDK} from '../../types';
import store from '../../../../store';
import user from './user';
import _ from 'lodash';
import {transfer311ToText} from '@/utils/common';
import {decrypt} from '@/utils/aes';

let localStorage = AsyncStorage;
export const initConversationData = async (serVersion?: string) => {
  const user_id = store.getState().user.selfInfo.user_id;
  const version = await localStorage.getItem('conversation' + user_id);
  let currentPage = 1;
  let currentSyncPage = 1;
  //全量获取会话列表
  const getList = async (page: number, page_size: number) => {
    imsdk.getConversationList({sync: true}).then(async res => {
      let max_version = res?.length
        ? Math.max.apply(
            Math,
            res.map(item => item.version),
          )
        : 0;
      const fetchConversationList = async () => {
        let conversationList: any = [];
        let total = Number.MAX_VALUE;
        let page = 1;
        while (total > conversationList.length) {
          const result: any = await imsdk.fetchConversationList({
            version: max_version,
            pageSize: 10,
            page: page,
          });
          console.log(result, '初始化服务端会话result');
          if (!result.list) break;
          page++;
          result.list = result.list.filter(
            i => i.id && !i.deleted_at && !!i.message,
          );
          total = result?.count ? result.count : 0;
          conversationList = conversationList.concat(result.list || []);
          // console.log(res)
        }
        return Promise.resolve(conversationList);
      };
      let result = await fetchConversationList();

      if (!result.length) return;

      res.map((item: any, index) => {
        const cv =
          result?.filter(c => c.id === item.conversation_id)?.[0] || null;
        if (!cv) {
          let data = {id: item.conversation_id};
          data = Object.assign(data, item);
          result.push(data);
        }
      });

      await Promise.all(
        result.map(async (item: any, index: number) => {
          const cv: any =
            res?.filter(c => c.conversation_id === item.id)?.[0] || {};

          if (item.message) {
            item.latest_message = item.message.msg_id;
            item.message.content = decrypt(item.message.content);
            if (
              item.message.type === IMSDK.MessageType.GROUP_NOTIFICATION_NOTIFY
            ) {
              item.message = transfer311ToText(item.message);
            }
          }

          if (!item.msg) {
            const msg_id = item.latest_message || item.message?.msg_id;
            try {
              let message: any = await imsdk.comlink.getMessageByMsgId(msg_id);
              let messageEntity = message?.data?.[0];
              if (!messageEntity) {
                messageEntity = imsdk.createMessageEntity(
                  item.id,
                  item.message,
                );
                messageEntity &&
                  imsdk.comlink.insertMessageList([messageEntity]);
              }

              // const messageEntity: any = imsdk.createMessageEntity(
              //   item.id,
              //   item.message,
              // );

              // await imsdk.insertMessageList([messageEntity]);
              item.msg = {
                ...messageEntity,
                be_operator_list: item.message?.be_operator_list,
              };
            } catch (e) {
              console.log(e, 'e');
            }
          }

          if (!item.conversation_id) {
            item.conversation_id = item.id;
          }
          item.status = 1;
          if (item.type === 1) {
            const friend_id = item.id
              .replace(`${user_id}`, '')
              .replace('_', '');
            item.friend = friend_id;
            item.user = {
              user_id: friend_id,
              nick_name: item.name,
              remark: item.user?.remark,
              face_url: item.face_url,
            };
          }
          if (item.type === 2) {
            item.group_id = item.id;
            item.group = {
              group_id: item.id,
              name: item.name,
              face_url: item.face_url,
            };
          }

          const state = store.getState();
          if (state.user?.config?.conversationMap) {
            const config =
              state.user.config.conversationMap[item.conversation_id];
            if (config) {
              item.is_disturb = config.is_nocare;
              item.is_topchat = config.is_top;
              item.update_time = config.update_time;
            }
          }

          delete item.message;
          delete item.deleted_at;
          delete item.id;
          //delete item.name;
          //delete item.face_url;
        }),
      );

      const serverData = _.keyBy(result, 'conversation_id');
      imsdk.emit(IMSDK.Event.CONVERSATION_LIST_UPDATED, result);
      console.log(result, '初始化会话result');
      await imsdk.updateConversationList(result);
    });

    // imsdk.getConversationList({sync: false}).then(async res => {
    //   console.log(res, '===>会话列表');
    //   let max_version = res?.length
    //     ? Math.max.apply(
    //         Math,
    //         res.map(item => item.version),
    //       )
    //     : 0;

    //   const fetchConversationList = async () => {
    //     let conversationList: any = [];
    //     let total = Number.MAX_VALUE;
    //     let page = 1;
    //     while (total > conversationList.length) {
    //       const result: any = await imsdk.fetchConversationList({
    //         version: max_version,
    //         pageSize: 10,
    //         page: page,
    //       });
    //       if (!result.list) {
    //         break;
    //       }
    //       page++;
    //       result.list = result.list.filter(
    //         i => i.id && !i.deleted_at && !!i.message,
    //       );
    //       total = result?.count ? result.count : 0;
    //       conversationList = conversationList.concat(result.list || []);
    //       // console.log(res)
    //     }
    //     return Promise.resolve(conversationList);
    //   };
    //   let result = await fetchConversationList();
    //   if (!result.length) {
    //     return;
    //   }
    //   res.map((item: any, index) => {
    //     const cv =
    //       result?.filter(c => c.id === item.conversation_id)?.[0] || null;
    //     if (!cv) {
    //       let data = {id: item.conversation_id};
    //       data = Object.assign(data, item);
    //       result.push(data);
    //     }
    //   });
    //   await Promise.all(
    //     result.map(async item => {
    //       const cv: any =
    //         res?.filter(c => c.conversation_id === item.id)?.[0] || {};
    //       if (item.message) {
    //         item.latest_message = item.message.msg_id;
    //         item.message.content = decrypt(item.message.content);
    //         if (
    //           item.message.type === IMSDK.MessageType.GROUP_NOTIFICATION_NOTIFY
    //         ) {
    //           item.message = transfer311ToText(item.message);
    //         }
    //       }

    //       if (!item.msg) {
    //         const messageEntity: any = imsdk.createMessageEntity(
    //           item.id,
    //           item.message,
    //         );

    //         // await imsdk.insertMessageList([messageEntity]);
    //         item.msg = {
    //           ...messageEntity,
    //           be_operator_list: item.message?.be_operator_list,
    //         };
    //       }
    //       if (!item.conversation_id) {
    //         item.conversation_id = item.id;
    //       }

    //       item.status = 1;
    //       if (item.type === 1) {
    //         item.user = cv.user;
    //         if (!item.user || !item.user.user_id) {
    //           const friend_id = item.id
    //             .replace(`${user_id}`, '')
    //             .replace('_', '');
    //           const user_info = await imsdk.getFriendProfile(friend_id);
    //           item.user = user_info;
    //         }
    //       } else if (item.type === 2) {
    //         item.group = cv.group;
    //         if (!item.group || !item.group.group_id) {
    //           const group_info = await imsdk.getGroupProfile(item.id);
    //           item.group = group_info;
    //         }
    //       }
    //       const state = store.getState();
    //       if (state.user?.config?.conversationMap) {
    //         const config =
    //           state.user.config.conversationMap[item.conversation_id];
    //         if (config) {
    //           item.is_disturb = config.is_nocare;
    //           item.is_topchat = config.is_top;
    //           item.update_time = config.update_time;
    //         }
    //       }
    //       delete item.message;
    //       delete item.deleted_at;
    //       delete item.id;
    //       delete item.name;
    //       delete item.face_url;
    //     }),
    //   );
    //   // const localData = _.keyBy(res, 'conversation_id')

    //   const serverData = _.keyBy(result, 'conversation_id');
    //   //console.log('localData=======>', serverData);
    //   // const newData = Object.assign({}, localData, serverData)

    //   await imsdk.updateConversationList(result);

    //   // const getMaxSeq = (list: any) => {
    //   //   let max = 0;
    //   //   for (let i = 0; i < list.length; i++) {
    //   //     if (max < list[i].seq) {
    //   //       max = list[i].seq;
    //   //     }
    //   //   }
    //   //   return max;
    //   // };
    //   // const checkMessage = async () => {
    //   //   let res: any = await imsdk.getMyGroupMaxSeq(1, 20);

    //   //   let list = res.list;
    //   //   for (let i = 0; i < res.count; i++) {
    //   //     let conversation = await imsdk.comlink.getConversationById(
    //   //       list[i].conversation_id,
    //   //     );

    //   //     let localSeq =
    //   //       (await imsdk.comlink.getMaxSeq(list[i].conversation_id)) || 0;

    //   //     if (list[i].MaxGroupSeq - 1 > localSeq) {
    //   //       let msgres = await imsdk.fetchMessage(
    //   //         2,
    //   //         conversation.data[0]?.group_id,
    //   //         list[i].MaxGroupSeq,
    //   //         list[i].conversation_id,
    //   //       );

    //   //       if (
    //   //         currentConversation?.conversation_id == list[i].conversation_id
    //   //       ) {
    //   //         // dispatch(
    //   //         //   updateCurrentMessageList({
    //   //         //     data: msgres,
    //   //         //   }),
    //   //         // );
    //   //       }
    //   //     }
    //   //   }

    //   //   res = await imsdk.getMyGFriendMaxSeq(1, 20);
    //   //   list = res.list;
    //   //   for (let i = 0; i < res.count; i++) {
    //   //     let conversation = await imsdk.comlink.getConversationById(
    //   //       list[i]?.conversation_id,
    //   //     );

    //   //     let localSeq =
    //   //       (await imsdk.comlink.getMaxSeq(list[i]?.conversation_id)) || 0;

    //   //     if (list[i]?.MaxFriendSeq > localSeq) {
    //   //       let msgres = await imsdk.fetchMessage(
    //   //         1,
    //   //         conversation.data[0]?.friend,
    //   //         list[i].MaxFriendSeq,
    //   //         list[i].conversation_id,
    //   //       );
    //   //       if (
    //   //         currentConversation?.conversation_id == list[i].conversation_id
    //   //       ) {
    //   //         // dispatch(
    //   //         //   updateCurrentMessageList({
    //   //         //     data: msgres,
    //   //         //   }),
    //   //         // );
    //   //       }
    //   //     }
    //   //   }
    //   // };

    //   // checkMessage();
    //   // await imsdk.getConversationList({sync:true, updateRedux: true});
    // });
  };
  getList(1, 200);

  if (!version) {
    //版本不存在则全量初始化好友
    // getList(1, 200);
  } else if (version != serVersion) {
    //如果版本和服务器不一样则获取增量
    // syncList(1, 200);
  } else {
    //如果版本一样则获取本地数据库数据
  }
};
/**
 * 格式化数据
 * @param list
 */

const formatData = (list: any, user_id: string | undefined) => {
  let tmp: any = [];
  let userTmp: any = [];
  list.forEach((item: any) => {
    const user_id_1 =
      Number(item.user_id) > Number(user_id) ? user_id : item.user_id;
    const user_id_2 =
      Number(item.user_id) > Number(user_id) ? item.user_id : user_id;
    imsdk.subscribeSingleChat({
      user_id_1,
      user_id_2,
    });
    userTmp.push({
      user_id: item.user_id,
      face_url: item.face_url,
      nick_name: item.nick_name,
      age: item.age,
      account: item.account,
      phone_number: item.phone_number,
      login_ip: item.login_ip,
      gender: item.gender,
      signatures: item.signatures,
      // remark:item.remark,
    });
    tmp.push({
      user_id: item.user_id,
      conversation_id: item.user_id,
      remark: item.remark,
      create_time: item.create_time,
      friend_status: item.status || 1,
      online_status: item.online_status || 2,
      black_status: item.black_status || 2,
    });
  });

  return {tmp, userTmp};
};
