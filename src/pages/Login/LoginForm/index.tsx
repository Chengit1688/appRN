import {View, Picker, Colors, Button} from 'react-native-ui-lib';

import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, TextInput, Text, TouchableOpacity} from 'react-native';
import {Toast} from '@ant-design/react-native';
import {pt} from '@/utils/dimension';
import _ from 'lodash';
import CountryCode from '../countryCode';
import {StorageFactory} from '@/utils/storage';
import {userLogin} from '@/api/login';
import {getDomainList, getUserInfo} from '@/api/user';
import {useRequest} from 'ahooks';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '@/store';
import {setSelfInfo, setUserToken} from '@/store/actions/user';
import {setDomains, setServerData} from '@/store/reducers/global';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {formatUrl} from '@/utils/common';
import {setNoticeCount} from '@/store/actions';
import imsdk from '@/utils/IMSDK';
import {EnvContext} from '@/utils/env';
import GlobalLoading from '@/components/Loading/globalLoading';
import {SvgIcon} from '@/components';

type validateProps = {
  phone_number?: string;
  password?: string;
  account?: string;
  checked?: boolean;
  nick_name?: string;
  invite_code?: number;
  sms_code?: string;
  new_password?: string;
  confirm_password?: string;
};

export default function LoginForm(props: any) {
  const dispatch: AppDispatch = useDispatch();
  const {accountType, navigation, setAccountType} = props;
  const [password, setPassword] = useState('');
  const [account, setAccount] = useState('');
  const [country_code, setCountryCode] = useState('+86');
  const [phone_number, setPhoneNumber] = useState('');
  const {domains} = useContext(EnvContext);

  const handleLogin = useRequest(userLogin, {
    manual: true,
    onSuccess: async (result: any) => {
      if (result) {
        // console.log('result===>>>',result)
        dispatch(setSelfInfo({user_id: result.user_id}));
        await StorageFactory.setSession('USER_LOGIN_INFO', {
          user_id: result.user_id,
          token: result.token,
        });
        StorageFactory.setLocal('USER_LOGIN_ACCOUNT', {
          account,
          phone_number,
          password,
        })

        getUserInfo(
          {
            operation_id: Date.now(),
          },
          {
            token: result.token,
          },
        )
          .then((res: any) => {
            dispatch(setUserToken(result.token));
            dispatch(
              setSelfInfo({
                user_id: res.user_id,
                nick_name: res.nick_name,
                face_url: res.face_url,
                phone_number: res.phone_number,
                self_invite_code: res.self_invite_code,
              }),
            );
            res.face_url && FastImage.preload([{uri: formatUrl(res.face_url)}]);
          })
          .finally(() => {
            GlobalLoading.endLoading();
          });

        // navigation.replace("RootTab")
      }
    },
    onError: (error: any) => {
      // console.log('userLogin===>>>>',error)
      Toast.fail(error.message)
      GlobalLoading.endLoading();
    },
  });

  useEffect(() => {
    const fn = async () => {
      const userLoginAccount = await StorageFactory.getLocal(
        'USER_LOGIN_ACCOUNT',
      );
      if (userLoginAccount) {
        setAccount(userLoginAccount.account);
        setPassword(userLoginAccount.password);
        setPhoneNumber(userLoginAccount.phone_number);
      }
    };
    fn();
  }, []);

  // 验证表单
  const confirmEnter = async () => {
    if (accountType === 2) {
      if (!account) {
        Toast.info('账号不能为空');
        return;
      }
    } else {
      if (!country_code) {
        Toast.info('请选择手机区号');
        return;
      }
      if (!phone_number) {
        Toast.info('请填写手机号');
        return;
      }
      if (country_code === '+86' && phone_number.length !== 11) {
        Toast.info('请填写正确的手机号');
        return;
      }
    }
    if (!password) {
      Toast.info('密码不能为空');
      return;
    }

    GlobalLoading.startLoading();
    try {
      if (!domains?.list?.length) {
        // 如果没有domains，则重新获取接口
        const res: any = await getDomainList({});

        const data = res.list.reduce((pre, cur) => {
          pre[cur.site] = cur.domain;
          return pre;
        }, {});
        dispatch(setDomains(res));
        dispatch(setServerData(data));
        global.minio = data.minio;

        // setDomains(res);
        // setServers(data);
      }

      let params: any = {
        password,
      };
      params =
        accountType === 1
          ? {
              country_code,
              phone_number,
              ...params,
            }
          : {
              account,
              ...params,
            };
      const requestParams = Object.assign({}, params, {
        platform: 5,
        operation_id: Date.now().toString(),
        login_type: accountType,
        device_id: await DeviceInfo.getUniqueId(),
      });
      handleLogin.run(requestParams);
    } catch (error) {
      GlobalLoading.endLoading();
    }
  };

  const handlePhoneCode = (value: any) => {
    setCountryCode(value);
  };
  const hanleGetPhoneNumber = (value: any) => {
    setPhoneNumber(value);
  };

  return (
    <View
      style={{
        marginTop: pt(30),
      }}>
      {accountType === 1 ? (
        <CountryCode
          setPhoneNumber={setPhoneNumber}
          phone_number={phone_number}
          country_code={country_code}
          setCountryCode={setCountryCode}
        />
      ) : (
        <View style={styles.formItemFlex}>
          <TextInput
            onChangeText={(value: string) => setAccount(value)}
            placeholder="请输入账号"
            placeholderTextColor={'#999'}
            value={account}
            style={{
              flex: 1,
              color: '#333',
              fontSize: pt(15),
            }}
          />
        </View>
      )}
      <View style={styles.formItemFlex}>
        <TextInput
          onChangeText={(value: string) => setPassword(value)}
          secureTextEntry={true}
          value={password}
          placeholder="请输入密码"
          placeholderTextColor={'#999'}
          style={{
            color: '#333',
            flex: 1,
            fontSize: pt(15),
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginRight: pt(20),
          marginTop: pt(20),
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('forgotPassword');
          }}>
          <Text
            style={{
              color: '#7581FF',
              fontWeight: 'bold',
            }}>
            忘记密码
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          ...styles.flexRowCenter,
          marginTop: pt(30),
        }}>
        <Button
          onPress={confirmEnter}
          style={styles.loginButton}
          label={'登录'}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          margin: pt(20),
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: '#666',
          }}>
          登录即代表同意
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('userAgreement');
          }}>
          <Text
            style={{
              color: '#7581FF',
              fontWeight: 'bold',
            }}>
            《用户服务协议》
          </Text>
        </TouchableOpacity>
        <Text style={{color:'#666'}}>和</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('privacyPolicy');
          }}>
          <Text
            style={{
              color: '#7581FF',
              fontWeight: 'bold',
            }}>
            《隐私条款》
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={{color:'red',textAlign:'center'}}>热更新测试</Text>

      <View style={styles.loginType}>
        <View style={styles.loginWayItem}>
          <Text style={styles.line} />
          <Text style={styles.loginTips}>其它登录方式</Text>
          <Text style={styles.line} />
        </View>
        <TouchableOpacity
          onPress={() => {
            setAccountType(accountType == 1 ? 2 : 1);
          }}
          activeOpacity={0.8}
          style={styles.loginTypes}>
          <SvgIcon
            name={accountType == 1 ? 'account' : 'mobile'}
            size={25}
            style={{
              marginBottom: pt(10),
            }}
          />

          <Text style={styles.loginWayName}>
            {accountType == 1 ? '账号登录' : '手机登录'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formItemFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: pt(0.5),
    marginLeft: pt(20),
    marginRight: pt(20),
    marginTop: pt(5),
    borderColor: '#dcdcdc',
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
  toast: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: 'auto',
    marginLeft: pt(20),
    marginRight: pt(20),
  },
  toastTxt: {
    color: '#fff',
    textAlign: 'center',
    padding: pt(20),
    width: 'auto',
  },
  loginType: {
    marginTop: pt(30),
  },
  loginWayItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: pt(30),
  },
  loginTypes: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: pt(30),
  },
  loginWayName: {
    color: '#666',
  },
  loginTips: {
    color: '#666',
  },
  line: {
    width: pt(94),
    height: pt(0.5),
    backgroundColor: '#d9d9d9',
  },
});
