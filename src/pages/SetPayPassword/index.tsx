import {View, Text, TextField} from 'react-native-ui-lib';
import React, {useEffect, useRef, useState} from 'react';
import {pt} from '@/utils/dimension';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {TextInput} from 'react-native';
import {BoxShadow} from 'react-native-shadow';
import {Navbar} from '@/components';
import {Toast} from '@ant-design/react-native';
import {setPayPassword} from '@/api/wallet';
import {useNavigation} from '@react-navigation/native';
import {set} from 'lodash-es';

export default function SetPayPassword() {
  const [step, setStep] = useState(1);
  const [firstPassword, setFirstPassword] = useState('');
  const [confimPassword, setConfimPassword] = useState('');
  const [verifyCodeArr, setVerifyNumCode] = useState<any>([]);
  const {goBack} = useNavigation();
  const handleSetPayPassword = (confimPwd: string) => {
    setPayPassword({
      pay_passwd: firstPassword,
      confirm_password: confimPwd,
      operation_id: new Date().getTime().toString(),
    })
      .then(res => {
        Toast.info('设置支付密码成功');
        goBack();
      })
      .catch(err => {
        Toast.info('服务器错误，请重试');
        setStep(1);
        setVerifyNumCode([]);
        setConfimPassword('');
        setFirstPassword('');
      });
  };

  const renderPassword = () => {
    const inputRef = useRef<TextInput>(null);
    // const [verifyCode, setVerifyCode] = useState('');

    const len = step === 1 ? firstPassword.length : confimPassword.length || 0;
    return (
      <View row center>
        {Array.from({length: 6}).map((_, index) => {
          return (
            <TouchableHighlight
              key={index}
              style={{
                marginHorizontal: pt(5),
              }}
              onPress={() => {
                inputRef.current?.focus();
              }}>
              <BoxShadow
                key={index}
                setting={{
                  width: pt(42), // 与子元素高一致
                  height: pt(42), // 与子元素宽一致
                  color: index === len ? '#ffffff' : '#ffffff', // 阴影颜色
                  border: pt(12), // 阴影宽度
                  radius: pt(8), // 与子元素圆角一致
                  opacity: index === len ? 0.04 : 0, // 透明
                  x: 0, // 偏移量
                }}>
                <View
                  center
                  style={{
                    width: pt(42),
                    height: pt(42),
                    borderRadius: pt(8),
                    borderWidth: pt(1),
                    borderColor: '#dfdfdf',
                    //   ...boxStyle,
                  }}>
                  <TextField
                    value={verifyCodeArr[index]}
                    maxLength={1}
                    readonly
                    textAlign="center"
                    cursorColor="#ffffff"
                    inputMode="numeric"
                    keyboardType="numeric"
                    style={{
                      fontSize: pt(14),
                      fontWeight: '400',
                      color: '#000',
                    }}
                  />
                </View>
              </BoxShadow>
            </TouchableHighlight>
          );
        })}
        <TextInput
          keyboardType="number-pad"
          autoComplete="sms-otp"
          onChangeText={text => {
            if (step === 1) {
              setFirstPassword(text.trim());
            } else {
              setConfimPassword(text.trim());
            }

            setVerifyNumCode(Array.from({length: text.length}).map(() => '●'));

            if (text.trim().length >= 6) {
              if (step === 1) {
                setVerifyNumCode([]);
                setStep(2);
                return;
              } else {
                if (firstPassword === text.trim()) {
                  handleSetPayPassword(text.trim());
                } else {
                  Toast.info('两次密码不一致,请重新设置');
                  setVerifyNumCode([]);
                  setConfimPassword('');
                  setFirstPassword('');
                  setStep(1);
                }
              }
            }
          }}
          ref={inputRef}
          value={step === 1 ? firstPassword : confimPassword}
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
          }}
        />
      </View>
    );
  };

  return (
    <>
      <Navbar title="支付密码"></Navbar>
      <View
        style={{
          marginTop: pt(30),
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: pt(15),
            color: '#333333',
          }}>
          {step === 1 ? '请设置支付密码' : ' 请再次设置支付密码'}
        </Text>
        <View
          style={{
            marginTop: pt(30),
          }}>
          {renderPassword()}
        </View>
      </View>
    </>
  );
}
