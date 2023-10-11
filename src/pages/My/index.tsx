import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {View, Icon, TouchableOpacity, Text} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import QRCode from 'react-native-qrcode-svg';
import {pt} from '@/utils/dimension';
import {Popup} from '@/components';
import Header from '@/components/Header';
import {RootState} from '../../store';
import Menu from './block/menu';
import Profile from './block/profile';
import Cards from './block/cards';
import {getUserInfo} from '@/store/actions';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

export default function My() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [showQRcode, setShowQRcode] = useState(false);

  const [userInfo, setUserInfo] = useState<any>({});

  const selfInfo = useSelector(
    (state: RootState) => state.user.selfInfo,
    shallowEqual,
  );

  useEffect(() => {
    setUserInfo(selfInfo || {});
  }, [selfInfo]);

  useEffect(() => {
    dispatch(getUserInfo());
  }, []);

  return (
    <>
      <Header hideHeader />
      <ScrollView>
        <TouchableOpacity activeOpacity={1} onPress={() => setShowQRcode(true)}>
          <View
            right
            style={{
              margin: pt(16),
              marginBottom: pt(20),
            }}>
            <Icon
              assetName="qrcode_half"
              assetGroup="icons.app"
              size={pt(20)}
            />
          </View>
        </TouchableOpacity>
        <Profile userInfo={userInfo} />
        <Cards />
        <Menu />
        {/* <Modal
        visible={showQRcode}
        onBackgroundPress={() => setShowQRcode(false)}>
        <Text text60>Content</Text>
      </Modal> */}
        <Popup
          visible={showQRcode}
          onDismiss={() => {
            setShowQRcode(false);
          }}>
          <View
            style={{
              borderRadius: pt(30),
              backgroundColor: '#fff',
              width: pt(240),
              height: pt(275),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: pt(48),
            }}>
            <QRCode
              size={pt(123)}
              value={`userId=${userInfo?.user_id}&type=user`}
              logoBackgroundColor="#ffffff"
            />
            <Text
              style={{
                fontSize: pt(14),
                color: '#222',
                marginTop: pt(14),
              }}>
              {t('我的ID')}：{userInfo?.user_id}
            </Text>
            <Text
              center
              style={{
                fontSize: pt(14),
                color: '#222',
                marginTop: pt(41),
              }}>
              {t('扫一扫二维码，加我为好友')}
            </Text>
          </View>
        </Popup>
      </ScrollView>
    </>
  );
}
