import {
  View,
  Text,
  Avatar,
  Icon,
  TouchableOpacity,
  Assets,
} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Toast} from '@ant-design/react-native';
import FastImage from 'react-native-fast-image';
import {formatUrl} from '@/utils/common';

export default function Profile({userInfo}: any) {
  const {t} = useTranslation();

  const {navigate} = useNavigation();
  const avatar = userInfo?.face_url
    ? {uri: formatUrl(userInfo.face_url), cache: FastImage.cacheControl.web}
    : Assets.imgs.avatar.defalut;
  return (
    <View
      row
      centerV
      style={{
        marginLeft: pt(16),
        marginRight: pt(16),
      }}>
      <FastImage
        style={{
          width: pt(80),
          height: pt(80),
          borderRadius: pt(40),
        }}
        resizeMode="cover"
        source={avatar}
      />

      {/* <Avatar
        containerStyle={{}}
        {...{
          name: userInfo?.nick_name,
          size: pt(80),
          source: {
            uri: userInfo?.face_url,
          },
        }}
      /> */}
      <View
        style={{
          marginLeft: pt(15),
        }}>
        <View
          row
          centerV
          style={{
            marginBottom: pt(5),
          }}>
          <Text
            style={{
              color: '#000000',
              fontSize: pt(16),
              fontWeight: 'bold',
            }}>
            {userInfo?.nick_name}
          </Text>
          <Icon
            assetName="boy"
            assetGroup="icons.app"
            size={pt(12)}
            style={{
              marginLeft: pt(6),
            }}
          />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            Clipboard.setString(userInfo?.user_id);
            Toast.info(t('复制成功'));
          }}>
          <View
            row
            centerV
            style={{
              marginBottom: pt(5),
            }}>
            <Text
              style={{
                color: '#999999',
                fontSize: pt(16),
              }}>
              {userInfo?.user_id}
            </Text>
            <Icon
              assetName="copy"
              assetGroup="icons.app"
              size={pt(12)}
              style={{
                marginLeft: pt(6),
              }}
            />
          </View>
        </TouchableOpacity>
        {/* <View
            row
            centerV
            style={{
              marginBottom: pt(5),
            }}>
            <Icon
              assetName="location"
              assetGroup="icons.app"
              size={pt(12)}
              style={{
                marginRight: pt(6),
              }}
            />
            <Text
              style={{
                color: '#666666',
                fontSize: pt(13),
              }}>
              {t('河南省信阳市')}
            </Text>
          </View> */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigate({name: 'UserProfile'} as never)}>
          <View row centerV>
            <Icon
              assetName="edit"
              assetGroup="icons.app"
              size={pt(12)}
              style={{
                marginRight: pt(6),
              }}
            />
            <Text
              style={{
                color: '#999999',
                fontSize: pt(13),
              }}>
              {userInfo?.signatures}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
