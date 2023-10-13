import React, {useContext, useEffect, useState} from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import {pt} from '@/utils/dimension';
import {View, Text} from 'react-native-ui-lib';
import {StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import {useRequest} from 'ahooks';
import {settingConfig} from '@/api/login';
import {StorageFactory} from '@/utils/storage';
import uuid from 'react-native-uuid';
import DeviceInfo from 'react-native-device-info';

export default function LoginPage({navigation}: any) {
  const [formType, setFormType] = useState(1); // 表单类型，1 登录，2 注册，3 忘记密码，4 编辑用户昵称
  const [accountType, setAccountType] = useState(1); // 帐号类型，1：手机号，2：帐号
  const [loginConfig, setLoginConfig] = useState<any>([]);
  const [registerConfig, setRegisterConfig] = useState<any>({
    is_sms_code: 1, //默认显示
    is_check_invite_code: 1, //默认显示
  });
  const [systemConfig, setSystemConfig] = useState({});
  const [verification_token] = useState('');
  const [verification_point] = useState('');

  const getSettingConfig = useRequest(settingConfig, {
    manual: true,
    onSuccess: (result: any, params) => {
      if (result.login_config && result.login_config.mobile) {
        setLoginConfig(result.login_config.mobile);
        if (result.login_config.mobile.length === 1) {
          setAccountType(result.login_config.mobile[0]);
        }
      }
      if (result.register_config) {
        setRegisterConfig(result.register_config);
        // setRegisterConfig({
        //   ...result.register_config,
        //   is_verification_code: 1,
        //   is_sms_code: 1,
        // });
      }
      if (result.system_config) {
        setSystemConfig(result.system_config);
      }
    },
  });

  useEffect(() => {
    const fn = async () => {
      const device_id = await StorageFactory.getLocal('IM_DEVICED_ID');
      if (!device_id) {
        StorageFactory.setLocal(
          'IM_DEVICED_ID',
          await DeviceInfo.getUniqueId(),
        );
      }
      getSettingConfig.run({
        operation_id: Date.now().toString(),
      });
    };
    fn();
  }, []);

  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: '#fff',
          height: '100%',
        }}>
          {/* <View style={{backgroundColor:'red',height:100,width:100}}/> */}
        <View style={styles.typeFlex}>
          <Text
            onPress={() => setFormType(1)}
            style={[
              {...styles.typeText},
              formType === 1 ? styles.typeActive : null,
            ]}>
            登录
          </Text>
          <Text style={styles.afterLines} />
          <Text
            onPress={() => setFormType(2)}
            style={[
              {...styles.typeText},
              formType === 2 ? styles.typeActive : null,
            ]}>
            注册
          </Text>
        </View>
        <View style={{margin: pt(20)}}>
          <Text text50>欢迎来到止正 Talk</Text>
          <Text
            style={{
              marginTop: pt(10),
              color: '#666666',
            }}>
            {' '}
            {formType == 1
              ? '请输入账号密码登录'
              : '未注册过的手机号将自动创建账号'}
          </Text>
        </View>
        {formType === 1 ? (
          <LoginForm
            accountType={accountType}
            loginConfig={loginConfig}
            setAccountType={setAccountType}
            navigation={navigation}
          />
        ) : (
          <RegisterForm
            accountType={accountType}
            registerConfig={registerConfig}
            verification_point={verification_point}
            verification_token={verification_token}
            setAccountType={setAccountType}
          />
        )}
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  typeFlex: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: pt(20),
  },
  typeText: {
    fontSize: pt(14),
    color: '#999999',
  },
  typeActive: {
    color: '#7581FF',
    fontWeight: '500',
  },
  afterLines: {
    width: pt(1),
    height: pt(14),
    backgroundColor: '#dcdcdc',
    marginLeft: pt(10),
    marginRight: pt(10),
  },
});
