import {View, Text, Icon, TouchableOpacity} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import {Toast} from '@ant-design/react-native';

export default function Cards() {
  const {t} = useTranslation();
  const {navigate} = useNavigation();

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: pt(16),
          marginTop: pt(35),
          marginBottom: pt(35),
        }}>
        <TouchableOpacity
          onPress={() => {
            // Toast.info({content: '暂未开放'});
            // return;
            navigate({name: 'UserWallet'} as never);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: pt(164),
            height: pt(75),
            borderRadius: pt(10),
            backgroundColor: '#8767EC',
          }}>
          <View>
            <Text
              style={{
                color: '#ffffff',
                fontSize: pt(16),
                fontWeight: 'bold',
              }}>
              {t('钱包')}
            </Text>
            <Text
              style={{
                color: '#ffffff',
                fontSize: pt(12),
              }}>
              {t('个人账户信息')}
            </Text>
          </View>
          <Icon
            assetName="wallet"
            assetGroup="icons.app"
            size={pt(40)}
            style={{
              marginLeft: pt(20),
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Toast.info({content: '暂未开放'});
            return;
            navigate({name: 'UserPay'} as never);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: pt(164),
            height: pt(75),
            borderRadius: pt(10),
            backgroundColor: '#FF9889',
          }}>
          <View>
            <Text
              style={{
                color: '#ffffff',
                fontSize: pt(16),
                fontWeight: 'bold',
              }}>
              {t('收付款')}
            </Text>
            <Text
              style={{
                color: '#ffffff',
                fontSize: pt(12),
              }}>
              {t('快捷扫码收付')}
            </Text>
          </View>
          <Icon
            assetName="receive_payment"
            assetGroup="icons.app"
            size={pt(40)}
            style={{
              marginLeft: pt(20),
            }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
