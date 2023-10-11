import {View, Text, TextInput, StyleSheet} from 'react-native';
import {Button} from 'react-native-ui-lib';
import React, {useEffect, useState} from 'react';
import {Navbar} from '@/components';
import CountryCode from '../countryCode';
import {useRequest} from 'ahooks';
import {Toast} from '@ant-design/react-native';
import {verificationCode, forgotPassword} from '@/api/login';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';

export default function ForgotPassword() {
  const [country_code, setCountryCode] = useState('+86');
  const [sms_code, setSmsCode] = useState(''); // 验证码
  const [phone_number, setPhoneNumber] = useState('');
  const [new_password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const {goBack} = useNavigation();

  let timer: any = null;

  const confirmEnter = () => {
    if (!phone_number) {
      Toast.info('请输入手机号');
      return;
    }
    if (!sms_code) {
      Toast.info('请输入验证码');
      return;
    }
    if (!new_password) {
      Toast.info('请输入新密码');
      return;
    }
    if (!confirm_password) {
      Toast.info('请输入确认密码');
      return;
    }
    if (new_password !== confirm_password) {
      Toast.info('两次密码不一致');
      return;
    }
    forgotPassword({
      country_code,
      phone_number,
      sms_code,
      new_password,
      confirm_password,
      operation_id: Date.now().toString(),
    }).then(res => {
      Toast.info('修改成功');
      goBack();
    });
  };
  //倒计时按钮
  const VerifyCodeBtn = (props: any) => {
    const [time, setTime] = useState(0);
    const {country_code, phone_number, registerConfig, used_for} = props;
    useEffect(() => {
      timer && clearInterval(timer);
      return () => timer && clearInterval(timer);
    }, []);

    const getVerificationCode = useRequest(verificationCode, {
      manual: true,
      onSuccess: (result: any) => {
        console.log('result========>', result);
        setTime(60);
      },
    });

    useEffect(() => {
      if (time === 60) timer = setInterval(() => setTime(time => --time), 1000);
      else if (time === 0) clearInterval(timer);
    }, [time]);

    const getCode = () => {
      if (!phone_number) {
        Toast.info('请输入手机号');
        return;
      }

      getVerificationCode.run({
        operation_id: Date.now() + '',
        phone_number: phone_number,
        country_code: country_code,
        used_for: used_for,
      });
    };

    return (
      <>
        {time === 0 ? (
          <Text onPress={getCode} style={styles.codeText}>
            获取验证码
          </Text>
        ) : (
          <Text style={styles.codeText}>{time}s</Text>
        )}
      </>
    );
  };

  return (
    <View>
      <Navbar title="忘记密码" />
      {/* <View style={{margin: pt(20)}}>
        <Text
          style={{
            fontSize: pt(20),
            fontWeight: '500',
          }}>
          欢迎来到止正 Talk
        </Text>
      </View> */}
      <View style={{marginTop: pt(10)}}>
        <CountryCode
          setPhoneNumber={setPhoneNumber}
          phone_number={phone_number}
          country_code={country_code}
          setCountryCode={setCountryCode}></CountryCode>

        <View style={styles.formItemFlex}>
          <TextInput
            onChangeText={(value: string) => setSmsCode(value)}
            placeholder="请输入验证码"
            style={{
              flex: 1,
              fontSize: pt(15),
            }}
          />
          <VerifyCodeBtn
            country_code={country_code}
            phone_number={phone_number}
            used_for={1}></VerifyCodeBtn>
        </View>
        <View style={styles.formItemFlex}>
          <TextInput
            onChangeText={(value: string) => {
              setPassword(value);
            }}
            secureTextEntry={true}
            placeholder="请输入新密码,长度6-16位"
            style={{
              flex: 1,
              fontSize: pt(15),
            }}
          />
        </View>
        <View style={styles.formItemFlex}>
          <TextInput
            onChangeText={(value: string) => {
              setConfirmPassword(value);
            }}
            secureTextEntry={true}
            placeholder="请确认新密码,长度6-16位"
            style={{
              flex: 1,
              fontSize: pt(15),
            }}
          />
        </View>
        <View
          style={{
            ...styles.flexRowCenter,
            marginTop: pt(120),
          }}>
          <Button
            onPress={confirmEnter}
            style={styles.loginButton}
            label={'确定'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formItemFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: pt(0.5),
    marginLeft: pt(20),
    marginRight: pt(20),
    marginTop: pt(5),
    borderColor: 'rgba(102,102,102,0.1)',
    backgroundColor: '#fff',
    paddingTop: pt(15),
    paddingBottom: pt(15),
  },
  afterLines: {
    width: pt(1),
    height: pt(18),
    backgroundColor: '#dcdcdc',
    marginLeft: pt(20),
    marginRight: pt(20),
  },
  flexRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButton: {
    height: pt(49),
    width: pt(335),
    borderRadius: pt(7),
    fontSize: pt(20),
  },
  avatar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  codeText: {
    color: '#7581FF',
    fontSize: pt(15),
    width: pt(80),
    textAlign: 'center',
  },
});
