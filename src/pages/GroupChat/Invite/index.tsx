import {View, Text, Image, Assets} from 'react-native-ui-lib';
import React from 'react';
import {FullButton, Navbar} from '@/components';
import {pt} from '@/utils/dimension';
import imsdk from '@/utils/IMSDK';

export default function InviteGroup({route, navigation}: any) {
  const {group_id, name} = route.params;

  // 加入群聊
  const joinGroup = (group_id: string, group_name: string) => {
    return imsdk
      .joinGroup({
        group_id,
        remark: '',
      })
      .then(res => {
        // Toast.success('已申请加入');
        // navigation.goBack();
        navigation.replace('examine', {
          groupInfo: {
            id: group_id,
            name: group_name,
          },
        });
      });
  };

  return (
    <View>
      <Navbar title="邀请" />
      <View
        style={{
          height: pt(400),
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          style={{
            width: pt(50),
            height: pt(50),
          }}
          source={Assets.imgs.avatar.group}></Image>
        <Text
          style={{
            marginTop: pt(20),
            fontSize: pt(16),
          }}>{`邀请您加入群聊${name}`}</Text>
        <Text
          style={{
            marginTop: pt(10),
            fontSize: pt(12),
            color: '#999',
          }}>{`如果已加入此群，请勿重复加入`}</Text>
        <FullButton
          style={{
            width: pt(300),
          }}
          text="加入群聊"
          onPress={() => {
            joinGroup(group_id, name);
          }}></FullButton>
      </View>
    </View>
  );
}
