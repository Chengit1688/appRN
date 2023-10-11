import {View, Text} from 'react-native';
import React from 'react';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import {Icon, Image, TouchableOpacity} from 'react-native-ui-lib';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {FullUserItem} from '@/store/types/user';
import FastImage from 'react-native-fast-image';

export default function Cover({
  type,
  user,
}: {
  type: 'friend' | 'own';
  user?: any;
}) {
  const {navigate} = useNavigation();
  const userInfo = useSelector<RootState, FullUserItem>(
    state => state.user.selfInfo,
    shallowEqual,
  );
  const goToUserIndex = () => {
    if (type === 'own') {
      navigate('userFriendIndex', {userInfo} as never);
      // navigate('ContactInfo', {info: {...userInfo}} as never);
    }
  };

  return (
    <View
      style={{
        width: '100%',
        height: pt(200),
        marginBottom: pt(70),
        position: 'relative',
      }}>
      <Image
        style={{width: '100%', height: pt(240)}}
        resizeMode={'cover'}
        source={require('@/assets/ciclefriend-bg.jpeg')}
      />
      <View
        style={{
          position: 'absolute',
          right: pt(20),
          bottom: pt(-80),
          flexDirection: 'row',
          left: pt(20),
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: pt(16),
            color: '#fff',
            flex: 1,
            fontWeight: 'bold',
            marginRight: pt(12),
            marginTop: pt(8),
            textAlign: 'right',
          }}>
          {type === 'friend' ? user?.nick_name : userInfo.nick_name}
        </Text>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            goToUserIndex();
          }}>
          <FastImage
            style={{
              width: pt(80),
              height: pt(80),
              borderWidth: pt(2),
              borderColor: '#fff',
              borderRadius: pt(12),
            }}
            resizeMode={'cover'}
            source={{
              uri: type === 'friend' ? user?.face_url : userInfo.face_url,
              cache: FastImage.cacheControl.web,
            }}></FastImage>
        </TouchableOpacity>
      </View>
    </View>
  );
}
