import {FlatList} from 'react-native';
import React from 'react';
import {Empty, Navbar} from '@/components';
import FastImage from 'react-native-fast-image';
import {pt} from '@/utils/dimension';
import {formatUrl, formatTime} from '@/utils/common';

import {
  Assets,
  Colors,
  View,
  Text,
  TouchableOpacity,
} from 'react-native-ui-lib';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useNavigation} from '@react-navigation/native';
import {setRemindCiircleRed} from '@/store/reducers/global';

const data = [
  {
    type: '701', //  701 提醒 702 点赞  703 评论
    moments_id: '123',
    nickName: '小明',
    face_url:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F03%2F20200403222956_yLyXU.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1697021556&t=443e8ff21d17bce2ebe71e42b84f4074',
  },
  {
    type: '702', //  701 提醒 702 点赞  703 评论
    moments_id: '1231',
    nickName: '小明2',
    face_url:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F03%2F20200403222956_yLyXU.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1697021556&t=443e8ff21d17bce2ebe71e42b84f4074',
  },
  {
    type: '703', //  701 提醒 702 点赞  703 评论
    moments_id: '1231',
    nickName: '小明3',
    face_url:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F03%2F20200403222956_yLyXU.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1697021556&t=443e8ff21d17bce2ebe71e42b84f4074',
  },
];

const infoType: any = {
  701: '提到了你',
  702: '给你点赞',
  703: '给你评论',
};

export default function MessageList() {
  const remindCircle = useSelector(
    (state: RootState) => state.global.remindCiircle,
    shallowEqual,
  );
  const {navigate} = useNavigation();
  const dispatch = useDispatch();
  const renderItem = (data: any) => {
    const {item} = data;

    const avatar = item.face_url
      ? {uri: formatUrl(item.face_url), cache: FastImage.cacheControl.web}
      : Assets.imgs.avatar.defalut;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          dispatch(setRemindCiircleRed(item));
          //跳转
          navigate('circleDetail', {
            id: item.moments_id,
          });
        }}
        row
        style={{
          borderBottomWidth: pt(1),
          borderBottomColor: Colors.grey60,
          padding: pt(10),
        }}>
        <FastImage
          style={{
            width: pt(52),
            height: pt(52),
            borderRadius: pt(4),
            backgroundColor: Colors.grey60,
            marginLeft: pt(10),
            marginRight: pt(10),
          }}
          resizeMode="cover"
          source={avatar}
        />
        <View>
          <Text
            style={{
              color: '#7581FF',
              fontWeight: '500',
            }}>
            {item.publisher_nickname}
          </Text>
          <Text
            style={{
              fontSize: pt(12),
              marginTop: pt(4),
            }}>
            {infoType[item.type]}
          </Text>
          <Text
            style={{
              fontSize: pt(12),
              marginTop: pt(4),
              color: '#666',
            }}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Navbar title={'消息'} />
      {remindCircle.length === 0 ? (
        <View flex center>
          <Empty />
        </View>
      ) : (
        <FlatList
          data={remindCircle}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </>
  );
}
