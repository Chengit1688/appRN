import React, {Fragment, useState} from 'react';
import {View, Text, Button} from 'react-native-ui-lib';
import {StyleSheet, TextInput} from 'react-native';
import {Toast} from '@ant-design/react-native';
import {Navbar} from '@/components';
import {pt} from '@/utils/dimension';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {resetPassword} from '@/api/user';

export default function LoginPage() {
  const {t} = useTranslation();
  const selfInfo = useSelector(
    (state: RootState) => state.user.selfInfo,
    shallowEqual,
  );

  const [new_password, setPayPasswd] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');

  const submit = async () => {
    // let reg = /^\d{6}$/;
    // if (!reg.test(pay_passwd)) {
    //   Toast.info({
    //     content: t('密码长度为6位纯数字'),
    //   });
    //   return;
    // }
    // if (!reg.test(confirm_password)) {
    //   Toast.info({
    //     content: t('密码长度为6位纯数字'),
    //   });
    //   return;
    // }
    if (new_password !== confirm_password) {
      Toast.info({
        content: t('两次密码输入不一致'),
      });
      return;
    }
    resetPassword({
      new_password,
      confirm_password,
      password_type: 1,
      operation_id: Date.now().toString(),
    }).then(res => {
      Toast.info(t('修改成功'));
    });
  };

  return (
    <>
      <Navbar />
      <View flex bg-white style={styles.pageContainer}>
        <Text style={styles.title}>{t('修改账户密码')}</Text>
        <Text style={styles.tip}>
          {t('当前账户')}
          {/* 中间四位替换为* */}
          {selfInfo?.phone_number?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
        </Text>
        {/* <Text style={styles.label}>{t('账号原密码')}</Text>
        <View style={styles.formItem} row center>
          <TextInput
            placeholderTextColor="#C0C0C0"
            style={styles.inputText}
            placeholder={t('6-16位登录密码')}
            textAlign="left"
            maxLength={16}
            textContentType="password"
            secureTextEntry={true}
          />
        </View> */}
        <Text style={styles.label}>{t('账号新密码')}</Text>
        <View style={styles.formItem} row center>
          {/* <TextInput
            style={styles.inputText}
            placeholder={t('6-16位登录密码')}
            textAlign="left"
            maxLength={16}
            secureTextEntry={true}
            value={new_password}
            onChangeText={e => {
              setPayPasswd(e);
            }}
          /> */}
          <TextInput
            onChangeText={(value: string) => setPayPasswd(value)}
            secureTextEntry={true}
            value={new_password}
            placeholder={t('6-16位登录密码')}
            style={{
              flex: 1,
              fontSize: pt(15),
            }}></TextInput>
        </View>
        <Text style={styles.label}>{t('再次确认新密码')}</Text>
        <View style={styles.formItem} row center>
          {/* <TextInput
            placeholderTextColor="#C0C0C0"
            style={styles.inputText}
            placeholder={t('6-16位登录密码')}
            textAlign="left"
            maxLength={16}
            textContentType="password"
            secureTextEntry={true}
            value={confirm_password}
            onChangeText={e => {
              setConfirmPassword(e);
            }}
          /> */}
          <TextInput
            onChangeText={(value: string) => setConfirmPassword(value)}
            secureTextEntry={true}
            value={confirm_password}
            placeholder={t('6-16位登录密码')}
            style={{
              flex: 1,
              fontSize: pt(15),
            }}></TextInput>
        </View>
        <Button
          style={styles.loginBtn}
          onPress={() => {
            submit();
          }}>
          <Text style={styles.loginBtnText}>{t('确定')}</Text>
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: pt(14),
    fontWeight: '500',
    fontFamily: 'PingFang SC',
    color: '#333',
    marginTop: pt(25),
  },
  line: {
    width: pt(1),
    height: pt(15),
    backgroundColor: 'rgba(102, 102, 102, 0.1)',
    marginHorizontal: pt(18),
  },
  pageContainer: {
    paddingHorizontal: pt(20),
    paddingVertical: pt(15),
  },
  title: {
    fontSize: pt(22),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: pt(12),
  },
  tip: {
    fontSize: pt(13),
    fontWeight: '500',
    color: '#aaaaaa',
    marginBottom: pt(27),
  },
  formItem: {
    borderBottomColor: 'rgba(102, 102, 102, 0.1)',
    borderBottomWidth: pt(1),
    paddingTop: pt(5),
    paddingBottom: pt(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formItemLine: {
    width: pt(1),
    height: pt(22),
    backgroundColor: 'rgba(102, 102, 102, 0.1)',
    marginRight: pt(16),
  },
  inputText: {
    fontSize: pt(15),
    fontWeight: '500',
    height: pt(22),
    lineHeight: pt(22),
    color: '#333',
    width: pt(250),
    flex: 1,
  },
  loginBtn: {
    borderRadius: pt(7),
    backgroundColor: '#7581FF',
    width: '100%',
    height: pt(49),
    marginTop: pt(50),
  },
  getCode: {
    fontSize: pt(15),
    fontFamily: 'PingFang SC',
    fontWeight: '500',
    color: '#7581FF',
  },
  loginBtnText: {
    fontSize: pt(19),
    fontFamily: 'PingFang SC',
    fontWeight: '500',
    color: '#fff',
  },
});
