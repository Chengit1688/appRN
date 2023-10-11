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
          充值
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
            <Text
              style={{
                fontWeight: '500',
                fontSize: pt(15),
                color: '#999',
                marginBottom: pt(19),
              }}>
              充值金额
            </Text>
            <TextInput
              defaultValue="0"
              placeholder="0"
              style={{
                fontWeight: '500',
                fontSize: pt(40),
                color: '#000',
                fontFamily: 'DIN',
                height: pt(61),
                borderBottomColor: 'rgba(102, 102, 102, 0.1)',
                borderBottomWidth: pt(1),
              }}
            />
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
                支付方式
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
              text="立刻充值"
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
