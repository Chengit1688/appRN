import {View, Text, Image, Icon} from 'react-native-ui-lib';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {pt} from '@/utils/dimension';
import LinearGradinet from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute} from '@react-navigation/native';
import {shoppingDetail, getMemeberInfo} from '@/api/operator';
import Navbar from '@/components/Navbar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Popup, SvgIcon} from '@/components';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {FullUserItem} from '@/store/types/user';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import Clipboard from '@react-native-clipboard/clipboard';

export default function FranchiseeDetail(props: any) {
  const userInfo = useSelector<RootState, FullUserItem>(
    state => state.user.selfInfo,
    shallowEqual,
  );
  const {navigation} = props;
  const {t} = useTranslation();
  const {params} = useRoute<any>();
  const insets = useSafeAreaInsets();
  const [isCreator, setCreator] = useState(false);
  const [isMember, setMember] = useState(false);
  const [qrcode, setQRCode] = useState<string>(' ');
  const [visible, setVisible] = useState(false);
  const [detail, setDetail] = useState<any>({});
  useEffect(() => {
    shoppingDetail({
      operation_id: new Date().getTime().toString(),
      shop_id: params.shop_id,
    }).then((res: any) => {
      setCreator(res.creator_id === userInfo.user_id);

      setQRCode(
        `name=operator&source=qrcode&user_id=${userInfo.user_id}&invite_code=${res.invite_code}`,
      );
      setDetail(res);
    });
    getMemeberInfo({
      operation_id: new Date().getTime().toString(),
      shop_id: params.shop_id,
      user_id: userInfo.user_id,
    }).then((res: any) => {
      setMember(res.role === 2);
    });
  }, [params.shop_id]);

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setString(text);
      Alert.alert('文本已复制到剪贴板！');
    } catch (error) {
      Alert.alert('复制失败，请重试！');
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        height: '100%',
      }}>
      <StatusBar barStyle={'light-content'}></StatusBar>

      <ImageBackground
        //    source={{uri:'https://youimg1.c-ctrip.com/target/100d180000013l7dsF269.jpg'}}
        source={{uri: detail?.image && detail?.image[0]}}
        style={{
          height: pt(300),
          width: '100%',
        }}>
        <View
          style={{
            position: 'absolute',
            top: insets.top,
            width: '100%',
            height: insets.top,
            zIndex: 999,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.navBack}
            onPress={() => {
              navigation.goBack();
            }}>
            <SvgIcon
              name="navBack"
              size={22}
              style={{
                width: pt(10),
                height: pt(16),
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addFriend}
            onPress={() => {
              setVisible(true);
            }}>
            <Icon
              size={22}
              assetName="addfriend"
              assetGroup="page.friends"></Icon>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={styles.detailMain}>
        <View row>
          <Image
            style={{width: pt(49), height: pt(49)}}
            source={{uri: detail?.image && detail?.image[0]}}></Image>
          <View
            style={{
              flex: 1,
              marginLeft: pt(15),
            }}>
            <Text style={{color: '#222', fontSize: pt(16), fontWeight: 'bold'}}>
              {detail.name}
            </Text>
            <Text
              style={{color: '#959595', fontSize: pt(13), marginTop: pt(5)}}>
              {detail.description}
            </Text>
          </View>
        </View>
        <View style={styles.list}>
          <View row centerV style={{marginBottom: pt(13)}}>
            <Text style={{color: '#222222', flex: 1, textAlign: 'center'}}>
              店铺装修
            </Text>
            <View style={styles.lines}>
              <View style={styles.linesBg}></View>
              <LinearGradinet
                colors={['#7581FF', '#8767EC']}
                style={[
                  styles.lineLight,
                  Number(detail.decoration_score) >= 0
                    ? {width: pt(160 * (Number(detail.decoration_score) / 5))}
                    : null,
                ]}></LinearGradinet>
            </View>
            <Text style={styles.nums}>{detail.decoration_score}</Text>
            {/* <Text  style={styles.evaluation}>高于同行</Text> */}
          </View>
          <View row centerV style={{marginBottom: pt(13)}}>
            <Text style={{color: '#222222', flex: 1, textAlign: 'center'}}>
              产品品质
            </Text>
            <View style={styles.lines}>
              <View style={styles.linesBg}></View>
              <LinearGradinet
                colors={['#7581FF', '#8767EC']}
                style={[
                  styles.lineLight,
                  Number(detail.quality_score) >= 0
                    ? {width: pt(160 * (Number(detail.quality_score) / 5))}
                    : null,
                ]}></LinearGradinet>
            </View>
            <Text style={styles.nums}>{detail.quality_score}</Text>
            {/* <Text  style={styles.evaluation}>高于同行</Text> */}
          </View>
          <View row centerV>
            <Text style={{color: '#222222', flex: 1, textAlign: 'center'}}>
              服务态度
            </Text>
            <View style={styles.lines}>
              <View style={styles.linesBg}></View>
              <LinearGradinet
                colors={['#7581FF', '#8767EC']}
                style={[
                  styles.lineLight,
                  Number(detail.service_score) >= 0
                    ? {width: pt(160 * (Number(detail.service_score) / 5))}
                    : null,
                ]}></LinearGradinet>
            </View>
            <Text style={styles.nums}>{detail.service_score}</Text>
            {/* <Text  style={styles.evaluation}>高于同行</Text> */}
          </View>
        </View>
        <View style={styles.list}>
          <View row centerV>
            <Icon assetName="location" assetGroup="icons.app"></Icon>
            <Text style={{marginLeft: pt(10)}}>{detail.address}</Text>
          </View>
        </View>
        {/* <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: pt(20),
          }}>
          <Text>{t('查看店铺资质')}</Text>
          <Icon assetName="next_smail" assetGroup="icons.app" size={pt(12)} />
        </TouchableOpacity> */}
      </View>
      <View style={styles.btns}>
        <View row style={{width: '100%', justifyContent: 'space-between'}}>
          {isCreator ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate({
                  name: 'operatoApplyJoin',
                  params: {shop_id: params.shop_id},
                });
              }}>
              <Text style={styles.btnLine}>{t('修改资料')}</Text>
            </TouchableOpacity>
          ) : null}
          {isMember ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate({
                  name: 'operatorTeamMembers',
                  params: {shop_id: params.shop_id},
                });
              }}>
              <Text style={styles.btnquery}>{t('查看团队')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <Popup
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}>
        <View
          style={{
            borderRadius: pt(10),
            backgroundColor: '#fff',
            padding: pt(15),
            width: pt(250),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
              marginTop: pt(10),
              marginBottom: pt(10),
            }}>
            <QRCodeGenerator value={qrcode} size={140}></QRCodeGenerator>
          </View>
          <View row center>
            <Text>
              {t('团队邀请码')}：{detail.invite_code}
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => copyToClipboard(detail.invite_code)}>
              <SvgIcon
                name="copy"
                size={20}
                style={{
                  width: pt(10),
                  height: pt(16),
                  marginLeft: pt(10),
                }}
              />
            </TouchableOpacity>
          </View>
          <Text style={{textAlign: 'center', marginTop: pt(20)}}>
            {t('扫一扫二维码加入')}
          </Text>
        </View>
      </Popup>
    </View>
  );
}

const styles = StyleSheet.create({
  detailMain: {
    padding: pt(14),
    backgroundColor: '#fff',
    borderTopLeftRadius: pt(6),
    borderTopRightRadius: pt(6),

    marginTop: pt(-30),
  },
  list: {
    marginTop: pt(20),
    elevation: 1.5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: '#fff',
    padding: pt(12),
    borderRadius: pt(10),
  },
  lines: {
    position: 'relative',
    width: pt(160),
    height: pt(8),
    marginLeft: pt(10),
  },
  linesBg: {
    position: 'absolute',
    width: pt(160),
    left: 0,
    top: '50%',
    height: pt(8),
    marginTop: pt(-4),
    backgroundColor: '#F7F8FC',
    borderRadius: pt(3.5),
  },
  lineLight: {
    position: 'absolute',
    width: pt(0),
    left: 0,
    top: '50%',
    height: pt(8),
    marginTop: pt(-4),
    backgroundColor: '#8767EC',
    borderRadius: pt(3.5),
  },
  nums: {
    color: '#7581FF',
    fontSize: pt(15),
    fontWeight: 'bold',
    marginLeft: pt(10),
    flex: 1,
    textAlign: 'center',
  },
  evaluation: {
    marginLeft: pt(10),
    flex: 1,
    color: '#959595',
    fontSize: pt(13),
  },
  btns: {
    position: 'absolute',
    bottom: pt(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: pt(10),
  },
  btnLine: {
    width: pt(165),
    height: pt(40),
    lineHeight: pt(40),
    textAlign: 'center',
    borderColor: '#7581FF',
    color: '#7581FF',
    borderWidth: pt(0.5),
    borderRadius: pt(8),
  },
  btnquery: {
    width: pt(165),
    height: pt(40),
    lineHeight: pt(40),
    textAlign: 'center',
    borderColor: '#7581FF',
    color: '#fff',
    overflow: 'hidden',
    borderRadius: pt(8),
    backgroundColor: '#7581FF',
  },
  navBack: {
    paddingHorizontal: pt(16),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  addFriend: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: pt(16),
  },
});
