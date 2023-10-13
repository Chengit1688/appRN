import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ConversationState} from '../types/conversation';
import imsdk, {IMSDK} from '../../utils/IMSDK';
import {updatePcIcon} from '../../utils/pclib';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform, NativeModules} from 'react-native';
import PushNotification from 'react-native-push-notification';
import msg from '@/utils/IMSDK/db/data/msg';

const initialState: ConversationState = {
  currentConversation: null,
  conversationAtList: [],
  conversationList: [],
  currentMessageList: [],
  nextReqMessageID: '',
  settingInfo: {},
  unreadCount: 0,
};

let unread = -1;
const checkUnread = list => {
  let num = 0;
  list.forEach(vo => {
    num += vo.unread_count;
  });
  if (num != unread) {
    unread = num;
    updatePcIcon(num, {});
  }
};

const formatData = (arr: any) => {
  const resultMap = arr.reduce((acc: any, curr) => {
    const {conversation_id, update_time} = curr;

    if (
      !acc[conversation_id] ||
      acc[conversation_id].update_time < update_time
    ) {
      acc[conversation_id] = curr;
    }

    return acc;
  }, {});
  const resultArray: any = Object.values(resultMap);
  return resultArray;
};

export const conversationState = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    updateConversationList: (
      state,
      action: PayloadAction<IMSDK.Conversation[]>,
    ) => {
      let curConv = null;
      action.payload.forEach(conv => {
        if (
          conv.conversation_id === state.currentConversation?.conversation_id
        ) {
          curConv = conv;
        }
        if (!conv.is_topchat) {
          conv.is_topchat = 2;
        }
      });

      state.conversationList = formatData(action.payload);
      if (curConv) {
        state.currentConversation = {...state.currentConversation, ...curConv};
      }

      checkUnread(state.conversationList);
    },
    updateConversationItem: (
      state,
      action: PayloadAction<{
        data: IMSDK.Conversation;
      }>,
    ) => {
      const convItem = action.payload.data;
      if (!convItem.is_topchat) {
        convItem.is_topchat = 2;
      }
      const index = state.conversationList.findIndex(
        conv => conv.conversation_id === convItem.conversation_id,
      );
      const temp = Object.assign([], state.conversationList);
      temp[index] = {...temp[index], ...convItem};
      if (
        state.currentConversation?.conversation_id === convItem.conversation_id
      ) {
        state.currentConversation = {...temp[index], ...convItem};
      }
      state.conversationList = formatData(temp);
      // state.conversationList = temp;

      checkUnread(state.conversationList);
    },
    removeConversationItem: (
      state,
      action: PayloadAction<{
        data: string;
      }>,
    ) => {
      const convId = action.payload.data;
      const index = state.conversationList.findIndex(
        conv => conv.conversation_id === convId,
      );
      const temp = Object.assign([], state.conversationList);
      if (index === -1) {
        return;
      }
      temp.splice(index, 1);
      if (state.currentConversation?.conversation_id === convId) {
        state.currentConversation = null;
      }
      state.conversationList = temp;
      checkUnread(state.conversationList);
    },
    checkoutConversation(
      state,
      action: PayloadAction<IMSDK.Conversation['conversation_id']>,
    ) {
      const preConversationId = state.currentConversation?.conversation_id;
      // console.log(checkoutConversation,'checkoutConversation')

      if (preConversationId) {
        // TODO 当前会话进行已读上报
      }
      // TODO 切换的会话进行已读上报
      const conversation = state.conversationList.find(
        conv => conv.conversation_id === action.payload,
      );
      if (conversation) {
        state.currentConversation = conversation;
      } else {
        state.currentConversation = null;
        state.currentMessageList = [];
      }
    },

    insertCurrentMessageList: (
      state,
      action: PayloadAction<{
        data?: any;
        isHistory?: boolean;
      }>,
    ) => {
      if (action.payload?.data) {
        const msgs = state.currentMessageList || [];
        const list = action.payload.data;
        // const list = action.payload.data.filter(_ => ![311].includes(_.type))
        if (action.payload.isHistory) {
          state.currentMessageList = [...list, ...msgs];
        } else {
          state.currentMessageList = [...msgs, ...list];
        }
      } else {
        state.currentMessageList = [];
      }
    },
    updateCurrentMessageList: (state, action: PayloadAction<any>) => {
      state.currentMessageList = action.payload.data;
    },
    updateMessageItem: (state, action: PayloadAction<any>) => {
      const msgItem = action.payload.data;
      const index = state.currentMessageList.findIndex(
        msg => msg.client_msg_id === msgItem.client_msg_id,
      );
      state.currentMessageList[index] = msgItem;
      state.currentMessageList = JSON.parse(
        JSON.stringify(state.currentMessageList),
      );
    },
    deleteCurrentMessageList: (state, action: PayloadAction<any>) => {
      const {client_msg_id} = action.payload;
      const index = state.currentMessageList.findIndex(
        i => i.client_msg_id === client_msg_id,
      );
      if (index > -1) {
        const result = JSON.parse(JSON.stringify(state.currentMessageList));
        result.splice(index, 1);
        state.currentMessageList = result;
      }
    },
    updateSettingInfo: (state, action: PayloadAction<any>) => {
      if (action.payload) {
        const data = action.payload;
        if (
          data?.muteUserList?.length &&
          state.settingInfo?.muteUserList?.length
        ) {
          data.muteUserList = state.settingInfo.muteUserList.concat(
            data.muteUserList,
          );
        } else if (data?.unMuteUserList?.length) {
          const origin = state.settingInfo?.muteUserList || [];
          const result = [];
          origin.forEach(i => {
            if (
              data.unMuteUserList.findIndex(m => m.user_id === i.user_id) === -1
            ) {
              result.push(i);
            }
          });
          data.muteUserList = result;
        }
        state.settingInfo = Object.assign({}, state.settingInfo, data);
      } else {
        state.settingInfo = null;
      }
    },
    updateUnreadCount: (state, action: PayloadAction<any>) => {
      if (action.payload) {
        const data = action.payload;
        state.unreadCount = data.unreadCount;

        if (Platform.OS === 'android') {
          NativeModules.RNBadge.setBadge(state.unreadCount);
        } else {
          PushNotificationIOS.setApplicationIconBadgeNumber(state.unreadCount);
        }
      }
    },

    //设置会话列表@信息
    setConversationAtList: (state, action: PayloadAction<any>) => {
      const index = state.conversationAtList.findIndex(
        (item: any) => item.conversation_id === action.payload.conversation_id,
      );
      if (index > -1) return;
      state.conversationAtList.push(action.payload);
    },
    //设置已读当前会话@信息
    chearConversationAtInfo: (state, action: PayloadAction<any>) => {
      const index = state.conversationAtList.findIndex(
        (item: any) => item.conversation_id === action.payload.conversation_id,
      );
      state.conversationAtList.splice(index, 1);
    },
  },
});

export const {
  updateConversationList,
  updateConversationItem,
  removeConversationItem,
  updateMessageItem,
  /**
   *  选中会话
   *  如：通讯录 发消息
   *  **/
  checkoutConversation,
  insertCurrentMessageList,
  updateCurrentMessageList,
  updateSettingInfo,
  updateUnreadCount,
  deleteCurrentMessageList,
  setConversationAtList,
  chearConversationAtInfo,
} = conversationState.actions;

export default conversationState.reducer;
