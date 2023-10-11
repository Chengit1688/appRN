import {View, Text, Avatar, TouchableOpacity} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {opacity, pt} from '@/utils/dimension';
import {MessageItem, CARD, OWNID} from '../../demo/data';
import {getMsgContent} from '@/utils/common';
import {useNavigation} from '@react-navigation/native';

export default function ChatCard(row: any, isOwn: boolean) {
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const {card_info} = JSON.parse(row.content);
  const {face_url, nick_name, friend_status, user_id} = card_info;

  const avatar = face_url
    ? {uri: face_url}
    : require('@/assets/imgs/defalut_avatar.png');

  const viewDiffStyle = isOwn
    ? {
        borderTopEndRadius: 0,
      }
    : {
        borderTopStartRadius: 0,
      };
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (friend_status === 1) {
          //是好友，则跳转到详情页
          navigate('ContactInfo', {
            info: {
              user_id,
            },
          });
        } else {
          // 非好友，则跳转到添加好友页
          navigate('ContactAdd', {
            id: user_id,
          });
        }
      }}
      style={{
        width: pt(180),
        borderRadius: pt(7),
        backgroundColor: '#F6F7FB',
        ...viewDiffStyle,
      }}>
      <View
        row
        centerV
        style={{
          margin: pt(10),
          marginBottom: 0,
          paddingBottom: pt(10),
          borderBottomWidth: pt(0.5),
          borderBottomColor: opacity('#383E5C', 0.2),
        }}>
        <Avatar
          {...{
            name: nick_name,
            size: pt(30),
            source: avatar,
            containerStyle: {
              marginRight: pt(10),
            },
          }}
        />
        <Text>{nick_name}</Text>
      </View>
      <Text
        style={{
          margin: pt(10),
          marginTop: pt(5),
          marginBottom: pt(5),
          fontSize: pt(10),
          color: '#383E5C',
        }}>
        {t('个人名片')}
      </Text>
    </TouchableOpacity>
  );
}
