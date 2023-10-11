import {
  View,
  Text,
  Avatar,
  Icon,
  TouchableOpacity,
  Assets,
  Colors,
} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {pt} from '@/utils/dimension';
import {formatUrl} from '@/utils/common';
import Clipboard from '@react-native-clipboard/clipboard';
import {Toast} from '@ant-design/react-native';
import FastImage from 'react-native-fast-image';

export default function Profile(props: any) {
  const {userInfo} = props;
  const {t} = useTranslation();

  const {navigate} = useNavigation();

  const avatar = userInfo?.face_url
    ? {uri: formatUrl(userInfo.face_url), cache: FastImage.cacheControl.web}
    : Assets.imgs.avatar.defalut;

  return (
    <View
      row
      style={{
        marginLeft: pt(16),
        marginRight: pt(16),
      }}>
      {/* <Avatar
        containerStyle={{}}
        {...{
          name: userInfo.nick_name,
          size: pt(70),
          source: {
            uri: formatUrl(userInfo.face_url),
          },
        }}
      /> */}
      <FastImage
        style={{
          width: pt(70),
          height: pt(70),
          borderRadius: pt(35),
          backgroundColor: Colors.grey60,
        }}
        resizeMode="cover"
        source={avatar}
      />

      <TouchableOpacity activeOpacity={1}>
        <View
          style={{
            marginTop: pt(5),
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
              {userInfo.nick_name}
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
          <View
            row
            centerV
            style={{
              marginBottom: pt(5),
            }}>
            <Text
              style={{
                color: '#666666',
                fontSize: pt(13),
              }}>
              {t('备注：')}
              {userInfo.remark}
            </Text>
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
                  color: '#666666',
                  fontSize: pt(13),
                }}>
                {t('ID：')}
                {userInfo.user_id}
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
          <View
            row
            centerV
            style={{
              marginBottom: pt(5),
            }}>
            <Text
              style={{
                color: '#666666',
                fontSize: pt(13),
              }}>
              {t('个性签名：')}
              {userInfo.signatures || '暂无'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
