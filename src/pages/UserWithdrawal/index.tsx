import React from 'react';
import {View, Colors, Text, Icon} from 'react-native-ui-lib';
import {TextInput} from 'react-native';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import {pt} from '@/utils/dimension';
import {BoxShadow} from 'react-native-shadow';
import FullButton from '@/components/FullButton';

const UserProfile = () => {
  const {t} = useTranslation();

  const shadowOpt = {
    width: pt(342),
    height: pt(262),
    color: '#000',
    border: pt(5),
    radius: pt(10),
    opacity: 0.03,
    x: 0,
    y: 0,
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}>
      <LinearGradient
        colors={['#7581FF', '#8767EC']}
        style={{height: pt(250), paddingTop: pt(105)}}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: pt(23),
            color: Colors.white,
            marginBottom: pt(41),
            paddingLeft: pt(17),
          }}>
          提现
        </Text>
      </LinearGradient>
      <View
        style={{
          paddingHorizontal: pt(16),
          marginTop: -pt(83),
        }}>
        <BoxShadow setting={shadowOpt}>
          <View
            style={{
              borderRadius: pt(10),
              backgroundColor: Colors.white,
              padding: pt(20),
              height: pt(262),
            }}>
            <View row centerV>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: pt(15),
                  color: '#999',
                  marginBottom: pt(19),
                }}>
                提现金额
              </Text>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: pt(12),
                  color: '#999',
                  marginLeft: pt(11),
                  marginBottom: pt(19),
                }}>
                (可提现金额0.00)
              </Text>
            </View>
            <View
              row
              centerV
              style={{
                borderBottomColor: 'rgba(102, 102, 102, 0.1)',
                borderBottomWidth: pt(1),
              }}>
              <TextInput
                defaultValue="0"
                placeholder="0"
                style={{
                  fontWeight: '500',
                  fontSize: pt(40),
                  color: '#000',
                  fontFamily: 'DIN',
                  height: pt(61),
                  flex: 1,
                }}
              />
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: pt(13),
                  color: '#7581FF',
                  height: pt(28),
                  lineHeight: pt(28),
                  borderRadius: pt(8),
                  borderWidth: pt(1),
                  borderColor: '#7581FF',
                  paddingHorizontal: pt(10),
                  // paddingVertical: pt(8),
                }}>
                全部提现
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: pt(1),
                paddingVertical: pt(20),
              }}>
              <Text
                style={{
                  fontSize: pt(15),
                  color: '#333',
                }}>
                提现至
              </Text>
              <View row center>
                <Icon assetName="zfb" assetGroup="icons.app" size={pt(20)} />
                <Text
                  style={{
                    fontSize: pt(14),
                    color: '#333',
                    marginLeft: pt(13),
                  }}>
                  支付宝
                </Text>
              </View>
            </View>
            <FullButton
              text="立刻提现"
              style={{
                width: pt(303),
                height: pt(49),
                marginLeft: 0,
                marginRight: 0,
                marginTop: pt(18),
                marginBottom: 0,
              }}
            />
          </View>
        </BoxShadow>
      </View>
    </View>
  );
};

export default UserProfile;
