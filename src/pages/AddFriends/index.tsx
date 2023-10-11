import {useEffect, useState} from 'react';
import {View, Text} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import {BoxShadow} from 'react-native-shadow';
import {shallowEqual, useSelector} from 'react-redux';
import SearchInput from '@/components/SearchInput';
import QRCode from 'react-native-qrcode-svg';
import Menu from './block/menu';
import {RootState} from '../../store';
import {Navbar} from '@/components';
import {Toast} from '@ant-design/react-native';
import imsdk from '@/utils/IMSDK';

export default function Start() {
  const {t} = useTranslation();
  const {setOptions, navigate} = useNavigation();
  const [userInfo, setUserInfo] = useState<any>({});

  const selfInfo = useSelector(
    (state: RootState) => state.user.selfInfo,
    shallowEqual,
  );

  useEffect(() => {
    setUserInfo(selfInfo || {});
  }, [selfInfo]);

  const shadowOpt = {
    width: pt(200),
    height: pt(200),
    color: '#6C7C95',
    border: pt(5),
    radius: pt(30),
    opacity: 0.03,
    x: 0,
    y: 0,
  };

  return (
    <>
      <Navbar title="添加朋友" />
      <View flex>
        <SearchInput
          placeholder={t('搜索')}
          style={{
            margin: pt(16),
            marginBottom: 0,
          }}
          onSearch={async e => {
            if (e) {
              try {
                imsdk.searchUser(e).then(res => {
                  console.log(res);
                  navigate({
                    name: 'ContactAdd',
                    params: {id: res?.list?.[0]?.user_id},
                  });
                });
              } catch (error) {
                Toast.info({content: '用户不存在'});
              }
            }
          }}
        />
        <View>
          <View
            centerH
            style={{
              marginTop: pt(33),
            }}>
            <BoxShadow setting={shadowOpt}>
              <View
                centerH
                style={{
                  width: pt(200),
                  height: pt(200),
                  backgroundColor: '#ffffff',
                  borderRadius: pt(30),
                  paddingTop: pt(29),
                }}>
                <QRCode
                  size={pt(123)}
                  value={`userId=${userInfo?.user_id}&type=user`}
                  logoBackgroundColor="#ffffff"
                />
                <Text
                  center
                  style={{
                    color: '#222',
                    fontWidth: '500',
                    fontSize: pt(14),
                    marginTop: pt(16),
                  }}>
                  {t('我的ID：')}
                  {userInfo?.user_id}
                </Text>
              </View>
            </BoxShadow>
          </View>
          <Text
            center
            style={{
              color: '#222',
              fontWidth: '500',
              fontSize: pt(14),
              marginTop: pt(29),
              marginBottom: pt(30),
            }}>
            {t('扫一扫二维码，加我为好友')}
          </Text>
        </View>
        <Menu />
      </View>
    </>
  );
}
