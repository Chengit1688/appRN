import {View, Text, TouchableOpacity, Icon} from 'react-native-ui-lib';
import React, {useCallback} from 'react';
import {pt} from '@/utils/dimension';
import _ from 'lodash';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {useTranslation} from 'react-i18next';
import {updateCurrentMessageList} from '@/store/reducers/conversation';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Style from '@/components/Agora/src/Style';

const actonList = [
  {
    key: 'save',
    label: '保存',
  },
];

export default function Operation(row: any, actons: any) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const selfInfo = useSelector(
    (state: any) => state.user.selfInfo,
    shallowEqual,
  );
  const id = row.msg_id;
  const currentMessageList = useSelector<RootState, IMSDK.Message[]>(
    state => state.conversation.currentMessageList,
    shallowEqual,
  );
  const currentConversation = useSelector<RootState, any>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );
  const getAction = useCallback((row: any) => {
    const _actons = _.clone(actonList);
    if (row.send_id == selfInfo.user_id) {
      _actons.push({
        key: 'revoke',
        label: '撤回',
      });
    }

    if (row.is_collect) {
      // _actons.push({
      // 	key: 'uncollect',
      // 	label: '取消收藏',
      // })
    } else {
      _actons.push({
        key: 'collect',
        label: '收藏',
      });
    }
    return _actons;
  }, []);
  const onPress = (id: string, key: string) => {
    switch (key) {
      case 'save':
        //保存到相册
        break;
      case 'revoke':
        imsdk.revokeMessage([row], currentConversation).then(() => {
          reverMsgCallBack(row.client_msg_id);
        });
        break;

      case 'collect':
        collect(id);
        break;
      case 'uncollect':
        collect(id, false);
        break;
    }
  };
  const collect = useCallback(
    async (msg_id: string, flag?: boolean) => {
      const index = currentMessageList.findIndex(i => i.msg_id === msg_id);
      const deepCloneMsg = JSON.parse(JSON.stringify(currentMessageList));

      deepCloneMsg[index].is_collect = 1;
      dispatch(
        updateCurrentMessageList({
          data: deepCloneMsg,
        }),
      );

      const info = await imsdk.comlink
        .getMessageByMsgId(msg_id)
        .catch((e: any) => console.log(e, 'e--'));
      const data = info.data[0];
      const res = await imsdk.comlink
        .collectMessage(data, flag)
        .catch((e: any) => console.log(e, 'e--'));
    },
    [currentMessageList],
  );

  const reverMsgCallBack = useCallback(
    (client_msg_id: any) => {
      const index = currentMessageList.findIndex(
        i => i.client_msg_id === client_msg_id,
      );
      const deepCloneMsg = JSON.parse(JSON.stringify(currentMessageList));
      deepCloneMsg.splice(index, 1);
      dispatch(
        updateCurrentMessageList({
          data: deepCloneMsg,
        }),
      );
    },
    [currentMessageList],
  );
  return (
    <View
      style={{
        position: 'absolute',
        flexDirection: 'row',
        zIndex: 999,
        top: pt(10),
        right: pt(10),
        width: pt(170),
        height: pt(70),
        paddingTop: pt(10),
        borderRadius: pt(6),
        paddingBottom: pt(10),
        backgroundColor: '#333',
      }}>
      {getAction(row).map((item: any) => {
        return (
          <TouchableOpacity
            key={item.key}
            activeOpacity={1}
            onPress={() => {
              onPress(id, item.key);
            }}>
            <View
              center
              style={{
                width: pt(54),
                height: pt(54),
              }}>
              <Icon
                assetName={item.key}
                assetGroup="page.chat"
                style={{
                  width: pt(16),
                  height: pt(16),
                  marginBottom: pt(6),
                }}
              />
              <Text
                style={{
                  fontSize: pt(12),
                  color: '#FFFFFF',
                }}>
                {t(item.label)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
