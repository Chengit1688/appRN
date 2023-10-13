import React, {useCallback, useEffect, useMemo} from 'react';
import {VirtualizedList} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import imsdk, {IMSDK} from '@/utils/IMSDK';
import {RootState} from '@/store';
import {
  checkoutConversation,
  insertCurrentMessageList,
  updateSettingInfo,
  updateConversationItem,
  updateCurrentMessageList,
  chearConversationAtInfo,
} from '@/store/reducers/conversation';
import MessageItem from './MessageItem';

export default function Main({source}: {source: any[]}) {
  const dispatch = useDispatch();
  const {navigate} = useNavigation();
  const currentConversation: any = useSelector(
    (state: RootState) => state.conversation.currentConversation,
    shallowEqual,
  );
  const USER = useSelector((state: RootState) => state.user);
  const selfInfo = USER.selfInfo;
  const user_id = useMemo(() => USER.selfInfo.user_id, [USER]);

  const currentMessageList = useSelector(
    (state: RootState) => state.conversation.currentMessageList,
    shallowEqual,
  );

  const getGroupInfo = (group_id: string) => {
    //获取群禁言信息,群信息
    const promiseArr = [
      imsdk.getGroupMemberList({group_id, is_mute: 1, page_size: 1000}),
      imsdk.getGroupProfile(group_id),
    ];
    Promise.all(promiseArr).then(res => {
      const groupInfo: any = res[1];
      groupInfo.muteUserList = res[0].list;
      dispatch(updateSettingInfo(groupInfo));
    });
  };

  const getFriendInfo = (friend_id: string) => {
    //获取群信息
    return imsdk
      .getFriendProfile(friend_id)
      .then(res => {
        //console.log('res========>', res);
        if (res?.user_id) {
          dispatch(updateSettingInfo(res));
        }
      })
      .catch(res => {});
  };

  const onPressItem = useCallback(
    async (conversation: IMSDK.Conversation) => {
      const conv_id = conversation.conversation_id;
      if (conversation.at) {
        dispatch(chearConversationAtInfo(conversation));
      }
      if (currentConversation?.conversation_id === conv_id) {
        return;
      }

      dispatch(checkoutConversation(conv_id));
      dispatch(updateCurrentMessageList([]));
      dispatch(updateSettingInfo(null));

      const conv = JSON.parse(JSON.stringify(conversation));

      conv.unread_count = 0;
      const recv_id =
        conv.type === 1 ? conv.user?.user_id : conv.group?.group_id;
      if (conv.type === 2) {
        getGroupInfo(recv_id);
      } else {
        getFriendInfo(recv_id);
      }
      delete conv.at;
      await dispatch(updateConversationItem({data: conv}));

      await imsdk.comlink.updateConversationById({
        conversation_id: conv.conversation_id,
        unread_count: 0,
      });
      navigate('Chat');
    },
    [currentConversation, source],
  );

  return (
    <>
      {source.length > 0 ? (
        <VirtualizedList
          initialNumToRender={10}
          data={source}
          renderItem={({item}) => (
            <MessageItem conv={item} onPressItem={item => onPressItem(item)} />
          )}
          keyExtractor={(item: any) => item.conversation_id}
          getItemCount={() => source.length}
          getItem={(data: unknown, index: number) => source[index]}
        />
      ) : null}
    </>
  );
}
