import {useEffect, useState, useCallback} from 'react';
import {View, Text, Icon, Switch, ListItem} from 'react-native-ui-lib';
import {DeviceEventEmitter} from 'react-native';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {Toast} from '@ant-design/react-native';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {useNavigation} from '@react-navigation/native';

export default function Menu(props) {
  const {userInfo, reload, setUserInfo, selfInfo} = props;
  const {navigate} = useNavigation();
  const {t} = useTranslation();

  return (
    <>
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(65)}
        onPress={() => {}}
        containerStyle={{}}
        style={{
          borderTopWidth: pt(1),
          borderTopColor: '#F7F7F7',
        }}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(17),
          }}>
          <Text
            style={{
              color: '#222222',
              fontSize: pt(15),
              fontWeight: 'bold',
            }}>
            {t('加入黑名单')}
          </Text>
        </ListItem.Part>

        <ListItem.Part middle row>
          <ListItem.Part
            middle
            column
            containerStyle={{
              marginLeft: pt(14),
              marginRight: pt(14),
            }}
          />
          <ListItem.Part
            containerStyle={{
              marginRight: pt(16),
            }}>
            <Switch
              value={userInfo?.black_status === 1}
              onValueChange={e => {
                if (e) {
                  imsdk.addToBlackList(userInfo.user_id).then(res => {
                    Toast.info(t('已加入黑名单'));
                    setUserInfo({
                      ...userInfo,
                      black_status: 1,
                    });
                    // // 删除会话记录
                    // const user_id_1 =
                    //   Number(userInfo.user_id) > Number(selfInfo.user_id)
                    //     ? selfInfo.user_id
                    //     : userInfo.user_id;
                    // const user_id_2 =
                    //   Number(userInfo.user_id) > Number(selfInfo.user_id)
                    //     ? userInfo.user_id
                    //     : selfInfo.user_id;
                    // imsdk.deleteConversation(`${user_id_1}_${user_id_2}`);
                    // imsdk.comlink.updateFriendById({});
                    imsdk.emit(IMSDK.Event.FRIEND_LIST_UPDATED, {
                      friendList: [
                        {
                          user_id: userInfo.user_id,
                          conversation_id: userInfo.user_id,
                          remark: userInfo.remark,
                          create_time: userInfo.create_time,
                          friend_status: userInfo.status || 1,
                          online_status: userInfo.online_status || 2,
                          black_status: 1,
                        },
                      ],
                      type: 3,
                    });

                    navigate('Contacts' as never);
                  });
                } else {
                  imsdk.removeFromBlackList(userInfo.user_id).then(res => {
                    Toast.info(t('移出黑名单'));
                    setUserInfo({
                      ...userInfo,
                      black_status: 2,
                    });
                    reload();
                  });
                }
              }}
            />
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    </>
  );
}
