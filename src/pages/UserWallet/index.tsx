import React, {useEffect, useState} from 'react';
import {View, Colors, Text, Icon} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import {pt} from '@/utils/dimension';
import {BoxShadow} from 'react-native-shadow';
import {useNavigation} from '@react-navigation/native';
import FullButton from '@/components/FullButton';
import {getWallet} from '@/api/wallet';
import {Navbar, SvgIcon} from '@/components';
import Header from '@/components/Header';
import {TouchableOpacity} from 'react-native-gesture-handler';

const UserProfile = () => {
  const {t} = useTranslation();
  const {navigate, goBack} = useNavigation();

  const [detail, setDetail] = useState<any>({}); //钱包详情

  useEffect(() => {
    getWallet({
      operation_id: new Date().getTime().toString(),
    }).then(res => {
      setDetail(res);
    });
  }, []);

  const shadowOpt = {
    width: pt(342),
    height: pt(330),
    color: '#000',
    border: pt(5),
    radius: pt(10),
    opacity: 0.03,
    x: 0,
    y: 0,
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
        }}>
        <LinearGradient
          colors={['#7581FF', '#8767EC']}
          style={{height: pt(250), paddingTop: pt(60)}}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <TouchableOpacity
            onPress={() => {
              goBack();
            }}
            style={{
              marginLeft: pt(16),
            }}>
            <SvgIcon name="backWhite" size={pt(20)}></SvgIcon>
          </TouchableOpacity>
          <Text
            center
            style={{
              fontWeight: 'bold',
              fontSize: pt(20),
              color: Colors.white,
              marginBottom: pt(18),
              marginTop: pt(20),
            }}>
            {t('您的专属安全账户')}
          </Text>
          <View row center>
            <Text
              center
              style={{
                fontWeight: 'bold',
                fontSize: pt(13),
                color: Colors.white,
              }}>
              {t('安全加密')}
            </Text>
            <View
              style={{
                height: pt(10),
                width: pt(1),
                marginHorizontal: pt(10),
                backgroundColor: Colors.white,
              }}
            />
            <Text
              center
              style={{
                fontWeight: 'bold',
                fontSize: pt(13),
                color: Colors.white,
              }}>
              {t('人工审核')}
            </Text>
            <View
              style={{
                height: pt(10),
                width: pt(1),
                marginHorizontal: pt(10),
                backgroundColor: Colors.white,
              }}
            />
            <Text
              center
              style={{
                fontWeight: 'bold',
                fontSize: pt(13),
                color: Colors.white,
              }}>
              {t('更优体验')}
            </Text>
          </View>
        </LinearGradient>
        <View
          style={{
            paddingHorizontal: pt(16),
            marginTop: -pt(63),
          }}>
          <BoxShadow setting={shadowOpt}>
            <View
              style={{
                borderRadius: pt(10),
                backgroundColor: Colors.white,
                paddingTop: pt(20),
                paddingBottom: pt(10),
                height: pt(330),
              }}>
              <Text
                center
                style={{
                  fontWeight: 'bold',
                  fontSize: pt(15),
                  color: '#8170F2',
                  marginBottom: pt(15),
                }}>
                HI,您好！
              </Text>
              <Text
                center
                style={{
                  fontSize: pt(15),
                  color: '#999999',
                  marginBottom: pt(20),
                  shadowColor: 'rgba(0,0,0,0.04)',
                }}>
                {t(' 您的账户余额(元)')}
              </Text>
              <View row center>
                <Text
                  center
                  style={{
                    fontWeight: 'bold',
                    fontSize: pt(30),
                    color: '#000',
                    fontFamily: 'PingFang SC',
                    lineHeight: pt(40),
                  }}>
                  ￥
                </Text>
                <Text
                  center
                  style={{
                    fontSize: pt(40),
                    color: '#000',
                    fontWeight: 'bold',
                    fontFamily: 'PingFang SC',
                    lineHeight: pt(48),
                  }}>
                  {Number(detail.balance / 100).toFixed(2)}
                </Text>
              </View>
              <Text
                style={{
                  marginTop: pt(80),
                  textAlign: 'center',
                  fontSize: pt(12),
                  color: '#999999',
                }}>
                充值和提现将会直接联系客服
              </Text>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: pt(10),
                  marginTop: pt(20),
                }}>
                <FullButton
                  text={t('充值')}
                  style={{
                    width: pt(156),
                    height: pt(49),
                    marginLeft: 0,
                    marginRight: 0,
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                  onPress={() => {
                    navigate('ContactInfo', {
                      info: {
                        user_id: detail.service_user_id,
                      },
                    });
                  }}
                />
                <FullButton
                  style={{
                    width: pt(156),
                    height: pt(49),
                    marginLeft: 0,
                    marginRight: 0,
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                  text={t('提现')}
                  onPress={() => {
                    navigate('Cash' as never);
                  }}
                />
              </View>
            </View>
          </BoxShadow>

          {/* <BoxShadow
            setting={{
              ...shadowOpt,
              height: pt(50),
              style: {marginTop: pt(15)},
            }}>
            <View
              row
              center
              style={{
                paddingHorizontal: pt(16),
                height: pt(50),
                backgroundColor: '#fff',
              }}>
              <View flex-1 row>
                <Icon assetName="lszd" assetGroup="icons.app" size={pt(18)} />
                <Text
                  style={{
                    marginLeft: pt(12),
                    color: '#333',
                    fontSize: pt(15),
                    borderRadius: pt(10),
                  }}>
                  {t('历史账单')}
                </Text>
              </View>
              <Icon
                assetName="more"
                assetGroup="icons.app"
                style={{
                  width: pt(6),
                  height: pt(10),
                }}
              />
            </View>
          </BoxShadow>
          <BoxShadow
            setting={{
              ...shadowOpt,
              height: pt(50),
              style: {marginTop: pt(15)},
            }}>
            <View
              row
              center
              style={{
                paddingHorizontal: pt(16),
                height: pt(50),
                backgroundColor: '#fff',
              }}>
              <View flex-1 row>
                <Icon assetName="hbjl" assetGroup="icons.app" size={pt(18)} />
                <Text
                  style={{
                    marginLeft: pt(12),
                    color: '#333',
                    fontSize: pt(15),
                    borderRadius: pt(10),
                  }}>
                  {t('红包记录')}
                </Text>
              </View>
              <Icon
                assetName="more"
                assetGroup="icons.app"
                style={{
                  width: pt(6),
                  height: pt(10),
                }}
              />
            </View>
          </BoxShadow> */}
        </View>
      </View>
    </>
  );
};

export default UserProfile;
