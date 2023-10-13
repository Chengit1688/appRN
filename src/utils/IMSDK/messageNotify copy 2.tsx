/**
 * 不影响之前的，单独创建个文件处理消息通知
 */
import {transfer311ToText} from '@/utils/common';
import {AppState, NativeModules, Vibration} from 'react-native';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {
  updateConversationList,
  updateConversationItem,
  insertCurrentMessageList,
  updateSettingInfo,
} from '@/store/reducers/conversation';
import {useEffect, useMemo, useRef} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {useLatest} from 'ahooks';
import {RootState} from '@/store';
// import {useRoute} from '@react-navigation/native';
import Sound from 'react-native-sound';
import {getConvMsgContent} from '@/utils/common';
const notice = require('@/assets/media/notice.mp3');
const activeSound = require('@/assets/media/d.mp3');
Sound.setCategory('Playback'); // 设置音频播放类型

import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import BackgroundTimer from 'react-native-background-timer';
import {create} from 'lodash-es';
import {requestOverlayPermission} from '@/utils/permission';
import {hasAndroidPermission} from '../permission';

PushNotification.configure({
  onRegister: function (token: any) {
  },
  onNotification: function (notification: any) {
    if (Platform.OS === 'ios') {
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    }
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

// PushNotification.configure({
//   popInitialNotification: true,
//   requestPermissions: Platform.OS === 'ios',
// });

// if (Platform.OS === 'android') {
//   PushNotification.createChannel(
//     {
//       channelId: 'message', // (required)
//       channelName: '消息通知', // (required)
//     },
//     () => {},
//   );
// }
if (Platform.OS === 'android') {
  requestOverlayPermission();
}
const soundNotice = new Sound(notice, error => {
  if (error) {
  } else {
    // soundCall.setNumberOfLoops(-1); // 设置循环播放
  }
});
const activeSoundCall = new Sound(activeSound, error => {
  if (error) {
  } else {
    activeSoundCall.setNumberOfLoops(-1); // 设置循环播放
  }
});

activeSoundCall.play();

export default function MessageNotify() {
  const dispatch = useDispatch();
  const USER = useSelector((state: RootState) => state.user);
  const user_id = useMemo(() => USER.selfInfo.user_id, [USER]);
  const seqRef = useRef(null);
  const conversationList = useSelector(
    (state: RootState) => state.conversation.conversationList,
  );
  const lastConversationList = useLatest(conversationList);

  const currentConversation: any = useSelector(
    (state: RootState) => state.conversation.currentConversation,
    shallowEqual,
  );

  //这里还缺少群发页面的判断
  //   const {path} = useRoute();
  const isMassSendPage = false; //目前还没有群发页面

  const updateConversationListHandler = ({
    findConvIndex,
    convEntity,
    messageEntity,
  }: any) => {
    // if(findConvIndex === -1) return;
    // const list = Object.assign([],lastConversationList.current);
    let temp = Object.assign({}, convEntity);
    temp.msg = {
      ...convEntity.msg,
      content: messageEntity.content,
      send_time: messageEntity.send_time,
      send_id: messageEntity.send_id,
      type: messageEntity.type,
      be_operator_list: messageEntity.be_operator_list,
      time_type: messageEntity.time_type,
    };
    temp.user = convEntity.user;
    // list[findConvIndex] = temp;
    // list.sort((a,b) => {
    //     if (a.is_topchat < b.is_topchat || a.is_topchat === b.is_topchat && a.msg?.send_time > b.msg?.send_time) return -1
    //     return 0;
    // });
    delete temp.draft;
    if (findConvIndex === -1) {
      dispatch(updateConversationList([temp, ...lastConversationList.current]));
    } else {
      dispatch(updateConversationItem({data: temp}));
    }
    imsdk.updateConversationById(convEntity);
  };

  const throttle = function (func: any, delay: number) {
    let prev = Date.now();
    return function () {
      const context = this;
      const args = arguments;
      const now = Date.now();
      if (now - prev >= delay) {
        func.apply(context, args);
        prev = Date.now();
      }
    };
  };
  const ackSeqThrottle = throttle(async (convEntity: any) => {
    await imsdk.conversation_ack_seq(
      convEntity.type,
      convEntity.conversation_id,
      seqRef.current,
    );
  }, 1000);

  const onMessageNotify = async (data: any) => {
    if (data.type === IMSDK.MessageType.READED) {
      return;
    }
    if (data.type === IMSDK.MessageType.GROUP_NOTIFICATION_NOTIFY) {
      data = transfer311ToText(data);
    }

    if (data.send_id === user_id) {
      let temp = await imsdk.comlink.getMessageById(data.client_msg_id);
      // console.log('onMessageNotify==========>', temp);
      if (temp.data.length > 0) {
        return;
      }
    }
    const {operator_id, be_operator_list, msg_id_list} = JSON.parse(
      data.content,
    );
    if (data.type === IMSDK.MessageType.GROUP_CREATE_NOTIFY) {
      if (operator_id === user_id) return;
    }

    if (data.type === IMSDK.MessageType.GROUP_DELETE_NOTIFY) {
      if (be_operator_list.some((item: any) => item.be_operator_id === user_id))
        return;
    }
    const conv_id = data.conversation_id; // 会话id  群会话: group_id  私聊会话:  ${user_id}_${user_id} 自己跟对方的id，id小的在前,大的在后
    let findConvIndex = lastConversationList.current.findIndex(
      (conv: any) => conv.conversation_id === conv_id,
    );
    let hasConv = lastConversationList.current[findConvIndex] || {};

    if (!hasConv?.is_disturb) {
      hasConv.is_disturb = data.is_disturb;
    }
    if (data.type === IMSDK.MessageType.DELETE) {
      await imsdk.deleteLocalMessage(msg_id_list, null);
    }
    const messageEntity = imsdk.createMessageEntity(conv_id, data);

    // await imsdk.insertMessageByThrottle(messageEntity);

    imsdk.comlink.insertMessageList([messageEntity]);
    let convEntity: any = {};
    if (findConvIndex === -1) {
      convEntity = imsdk.createConversationEntity(conv_id, data);
      // console.log('convEntity==========>', convEntity);
      await imsdk.comlink.insertConversation(convEntity);
    } else {
      convEntity = JSON.parse(JSON.stringify(hasConv));
    }
    convEntity.latest_message = data.msg_id;
    convEntity.update_time = data.send_time;
    if (
      currentConversation?.conversation_id !== hasConv?.conversation_id &&
      data.send_id !== user_id &&
      (data.type < 100 ||
        data.type === IMSDK.MessageType.GROUP_NOTIFICATION_NOTIFY)
    ) {
      //普通消息、系统通知未读数+1
      convEntity.unread_count += 1;
      // if (Platform.OS === 'ios') {
      //   PushNotificationIOS.setApplicationIconBadgeNumber(
      //     convEntity.unread_count,
      //   );
      // } else {
      //   NativeModules.RNBadge.setBadge(convEntity.unread_count);
      // }
      // PushNotificationIOS.setApplicationIconBadgeNumber(
      //   convEntity.unread_count,
      // );
    }
    convEntity.max_seq = data.seq;
    if (data.type === IMSDK.MessageType.GROUP_SET_ADMIN_NOTIFY) {
      // 设置管理员
      if (
        be_operator_list.some((item: any) => item.be_operator_id === user_id)
      ) {
        convEntity.group.role = 'admin';
        await imsdk.comlink.updateGroupById({...convEntity.group});
      }
    }
    if (data.type === IMSDK.MessageType.GROUP_UNSET_ADMIN_NOTIFY) {
      // 取消设置管理员
      if (
        be_operator_list.some((item: any) => item.be_operator_id === user_id)
      ) {
        convEntity.group.role = 'user';
        await imsdk.comlink.updateGroupById({...convEntity.group});
      }
    }
    if (data.type === IMSDK.MessageType.GROUP_TRANSFER_NOTIFY) {
      //转移群主
      if (
        be_operator_list.some((item: any) => item.be_operator_id === user_id)
      ) {
        convEntity.group.role = 'owner';
        await imsdk.comlink.updateGroupById({...convEntity.group});
      }
    }
    if (data.type === IMSDK.MessageType.REVOKE && hasConv) {
      await imsdk.deleteLocalMessage(msg_id_list, hasConv);
    }
    if (data.send_id !== user_id) {
      seqRef.current = data.seq;
    }

    await updateConversationListHandler({
      findConvIndex,
      convEntity,
      messageEntity: {
        ...messageEntity,
        be_operator_list: data.be_operator_list,
        time_type: data.time_type,
      },
    });
    if (
      currentConversation?.conversation_id === hasConv?.conversation_id &&
      !isMassSendPage
    ) {
      // 群发页面过滤插入msg
      if (data.type === IMSDK.MessageType.GROUP_SET_ADMIN_NOTIFY) {
        // 设置管理员
        if (
          be_operator_list.some((item: any) => item.be_operator_id === user_id)
        ) {
          dispatch(updateSettingInfo({role: 'admin'}));
        }
      }
      if (data.type === IMSDK.MessageType.GROUP_UNSET_ADMIN_NOTIFY) {
        // 取消设置管理员
        if (
          be_operator_list.some((item: any) => item.be_operator_id === user_id)
        ) {
          dispatch(updateSettingInfo({role: 'user'}));
        }
      }
      if (data.type === IMSDK.MessageType.GROUP_TRANSFER_NOTIFY) {
        //转移群主
        if (
          be_operator_list.some((item: any) => item.be_operator_id === user_id)
        ) {
          dispatch(updateSettingInfo({role: 'owner'}));
        }
      }
      if (data.type === IMSDK.MessageType.GROUP_ALL_MUTE_NOTIFY) {
        dispatch(updateSettingInfo({mute_all_member: 1}));
      }
      if (data.type === IMSDK.MessageType.GROUP_ALL_UNMUTE_NOTIFY) {
        dispatch(updateSettingInfo({mute_all_member: 2}));
      }
      dispatch(
        insertCurrentMessageList({
          data: [
            {
              ...data,
              content: messageEntity?.content,
              time_type: data.time_type,
            },
          ],
        }),
      );
      imsdk.emit('msgScrollView', 'bottom');
      if (data.type < 100 || data.type === 311) {
        ackSeqThrottle(convEntity);
      }
    }
    if (isMassSendPage) {
      return;
    }
    // if (data.send_id !== user_id) {
    //   soundNotice.play();
    //   Vibration.vibrate(200);
    // }
    // if (
    //   (data.type === 400 && operator_id === user_id) ||
    //   convEntity.is_disturb === 1
    // ) {
    if (data.type === 400 || convEntity.is_disturb === 1) {
      // 400的消息通知 操作的人是自己 没有提示音
      return;
    } else {
      // let localNotification = PushNotification.localNotificationSchedule({
      //   channelId: 'message',
      //   title: 'Local Notification Title',
      //   date: new Date(Date.now() + 60 * 1000),
      //   message: 'Local Notification Message',
      // });
      if (
        currentConversation?.conversation_id !== data?.conversation_id &&
        hasConv.is_disturb === 2 &&
        data.send_id !== user_id &&
        ![102, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310].includes(
          data.type,
        )
      ) {
        if (hasConv.type === 2) {
          let messageInfo: any = {
            title: `${hasConv?.group.name}`,
            playSound: true,
            message: `${data.send_nickname}：${getConvMsgContent(data)}`, // (required)
          };
          if (Platform.OS === 'android') {
            PushNotification.createChannel(
              {
                channelId: '1',
                channelName: 'name',
              },
              created => console.log(`ceeateChannel returned '${created}'`),
            );
            messageInfo.channelId = '1';
          }

          PushNotification.localNotification({
            ...messageInfo,
          });
        } else {
          let messageInfo: any = {
            title: `${data?.send_nickname}`,
            playSound: true,
            message: `${getConvMsgContent(data)}`, // (required)
          };
          if (Platform.OS === 'android') {
            PushNotification.createChannel(
              {
                channelId: 'message',
                channelName: '消息',
              },
              created => console.log(`ceeateChannel returned '${created}'`),
            );
            messageInfo.channelId = 'message';
          }

          PushNotification.localNotification({
            ...messageInfo,
          });
        }
      }
      // soundNotice.play();
      Vibration.vibrate(200);
    }
    if (data.type < 100 || data.type === 311) {
      // 系统提示 除去311类型
      // play();
    }
  };
  // let num = 0;
  // setInterval(() => {
  //   num++;
  //   console.log('有没有活跃', num);
  // }, 1000);
  useEffect(() => {
    let task: any;

    AppState.addEventListener('change', state => {
      if (state === 'background') {
        task = BackgroundTimer.setInterval(() => {
          imsdk.off(IMSDK.dataType['MessageNotify'], onMessageNotify);
          imsdk.on(IMSDK.dataType['MessageNotify'], onMessageNotify);
        }, 1000);
      } else {
        imsdk.on(IMSDK.dataType['MessageNotify'], onMessageNotify);
        BackgroundTimer.clearInterval(task);
      }
    });
    return () => {
      imsdk.off(IMSDK.dataType['MessageNotify'], onMessageNotify);
    };
  }, [currentConversation]);

  // useEffect(() => {
  //   // BackgroundTimer.runBackgroundTimer(() => {
  //   //   imsdk.off(IMSDK.dataType['MessageNotify'], onMessageNotify);
  //   //   imsdk.on(IMSDK.dataType['MessageNotify'], onMessageNotify);
  //   // }, 300);
  //   imsdk.on(IMSDK.dataType['MessageNotify'], onMessageNotify);

  //   return () => {
  //     imsdk.off(IMSDK.dataType['MessageNotify'], onMessageNotify);
  //     // BackgroundTimer.stopBackgroundTimer();
  //   };
  // }, [currentConversation]);

  return <></>;
}
