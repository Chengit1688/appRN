import {View, Text, Avatar, Icon, TouchableOpacity} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {pt} from '@/utils/dimension';
import {formatUrl} from '@/utils/common';

export default function Profile(props: any) {
  const {userInfo} = props;
  const {t} = useTranslation();

  const {navigate} = useNavigation();
  console.log('userInfo', userInfo);

  return (
    <View
      row
      style={{
        marginLeft: pt(16),
        marginRight: pt(16),
      }}>
      <Avatar
        containerStyle={{}}
        {...{
          name: userInfo?.account,
          size: pt(70),
          source: {
            uri: formatUrl(userInfo?.face_url),
          },
        }}
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
              {userInfo?.account}
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
              {t('昵称：')}
              {userInfo?.nick_name}
            </Text>
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
              {t('ID：')}
              {userInfo?.user_id}
            </Text>
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
              {t('个性签名：')}
              {userInfo?.signatures || '暂无'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
