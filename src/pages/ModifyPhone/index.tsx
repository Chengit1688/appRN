import React, {Fragment} from 'react';
import {View, Text, Button} from 'react-native-ui-lib';
import {StyleSheet, TextInput} from 'react-native';
import {Navbar} from '@/components';
import {pt} from '@/utils/dimension';
import {useTranslation} from 'react-i18next';

export default function LoginPage() {
  const {t} = useTranslation();

  return (
    <Fragment>
      <Navbar />
      <View flex bg-white style={styles.pageContainer}>
        <Text style={styles.title}>{t('输入新的手机号')}</Text>
        <Text style={styles.tip}>{t('请输入您新的要绑定的手机号码')}</Text>
        <View style={styles.formItem} row center>
          <View row center>
            <Text style={styles.selectCode}>+86</Text>
          </View>
          <View style={styles.formItemLine} />
          <TextInput
            placeholderTextColor="#C0C0C0"
            style={styles.inputText}
            placeholder={t('请输入手机号码')}
            textAlign="left"
            textContentType="telephoneNumber"
          />
        </View>
        <View style={styles.formItem} row center>
          <TextInput
            placeholderTextColor="#C0C0C0"
            style={styles.inputText}
            placeholder={t('请输入验证码')}
            textAlign="left"
            maxLength={16}
            textContentType="password"
          />
          <View style={styles.line} />
          <Text style={styles.getCode}>{t('获取验证码')}</Text>
        </View>
        <Button style={styles.loginBtn}>
          <Text style={styles.loginBtnText}>{t('登录')}</Text>
        </Button>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: pt(47),
  },
  formItem: {
    borderBottomColor: 'rgba(102, 102, 102, 0.1)',
    borderBottomWidth: pt(1),
    paddingTop: pt(20),
    paddingBottom: pt(15),
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
  selectCode: {
    fontSize: pt(18),
    fontWeight: '500',
    color: '#333',
    paddingRight: pt(16),
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
