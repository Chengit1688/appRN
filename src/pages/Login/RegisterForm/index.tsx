import {Text, StyleSheet, TextInput, ScrollView} from 'react-native';
import React, {useState, useMemo, useEffect, useContext} from 'react';
import {pt} from '@/utils/dimension';
import {
  View,
  Button,
  Avatar,
  Incubator,
  Colors,
  PanningProvider,
  Assets,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native-ui-lib';
import {Picker} from '@react-native-picker/picker';
import CountryCode from '../countryCode';
import _ from 'lodash';
import {Toast} from '@ant-design/react-native';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '@/store';
import {useRequest} from 'ahooks';
import {userRegister, verificationCode} from '@/api/login';
import {setSelfInfo, setUserToken} from '@/store/actions';
import {StorageFactory} from '@/utils/storage';
import {getDomainList, getUserInfo, updateInfo} from '@/api/user';
// import { ImagePickerUpload } from "@/components/ImagePickUpload"
import {launchImageLibrary} from 'react-native-image-picker';
import DeviceInfo from 'react-native-device-info';
import {handleUpload} from '@/components/ImagePickUpload';
import Popup from '@/components/Popup';
import FullButton from '@/components/FullButton';
import {UserActionTypes} from '@/store/types/user';
import {EnvContext} from '@/utils/env';
import GlobalLoading from '@/components/Loading/globalLoading';
import {setDomains, setServerData} from '@/store/reducers/global';
import {SvgIcon} from '@/components';

type Gender = {
  name: string;
  value: number;
};

const genderList: any = [
  {
    label: '男',
    value: 1,
  },
  {
    label: '女',
    value: 2,
  },
];

export default function RegisterForm(props: any) {
  const {accountType, registerConfig, verification_point, setAccountType} =
    props;

  const dispatch: AppDispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [invite_code, setInviteCode] = useState('');
  const [sms_code, setSmsCode] = useState('');
  const [account, setAccount] = useState('');
  const [country_code, setCountryCode] = useState('+86');
  const [phone_number, setPhoneNumber] = useState('');
  const [token, setToken] = useState();
  const [user_id, setUserId] = useState();
  const [regiserStep, changeStep] = useState(1);
  const title = useMemo(() => {
    if (regiserStep == 1) {
      return '注册';
    } else {
      return '进入';
    }
  }, [regiserStep]);

  const confirmEnter = async () => {
    let reg = null;
    if (accountType === 2) {
      if (!account || !account.trim()) {
        Toast.info('账号不能为空');
        return;
      }

      if (registerConfig.is_all_account == 1) {
        reg = /^[0-9A-Za-z]+$/;
        if (!reg.test(account)) {
          Toast.info('账号必须是数字和字母');
          return false;
        }
      } else {
        if (account.length < 2 || account.length > 16) {
          Toast.info('账号为2-16位');
          return false;
        }
      }
    } else {
      if (!phone_number) {
        Toast.info('请填写手机号');
        return;
      }
      if (country_code === '+86' && phone_number.length !== 11) {
        Toast.info('请填写正确的手机号');
        return;
      }
      if (!sms_code) {
        Toast.info('请填写验证码');
        return;
      }
    }
    if (!password) {
      Toast.info('密码不能为空');
      return;
    }
    if (password.length < 6 || password.length > 16) {
      Toast.info('密码长度6-16位');
      return false;
    }
    if (!invite_code && registerConfig?.check_invite_code === 1) {
      Toast.info('请输入邀请码');
      return;
    }
    let params: any = {
      password,
      invite_code,
    };
    params =
      accountType === 1
        ? {
            country_code,
            phone_number,
            ...params,
            sms_code,
          }
        : {
            account,
            ...params,
          };

    const requestParams: any = Object.assign({}, params, {
      platform: 5,
      operation_id: Date.now().toString(),
      account_type: accountType,
      // device_id:  await StorageFactory.getLocal("IM_DEVICED_ID")
      device_id: await DeviceInfo.getUniqueId(),
    });
    if (Number(registerConfig.is_verification_code) === 1) {
      // if (!verification_point) {
      //   setLoginCaptcha(true);
      //   return;
      // }
      // requestParams.verification_token = verification_token;
      // requestParams.verification_point = verification_point;
      requestParams.captcha_type = 'blockPuzzle';
    }

    handleRegister.run(requestParams);
  };

  const handleRegister = useRequest(userRegister, {
    manual: true,
    onSuccess: (result: any) => {
      console.log('result========>', result);
      if (result) {
        dispatch(setSelfInfo({user_id: result.user_id}));
        setToken(result.token);
        setUserId(result.user_id);
        StorageFactory.setSession('USER_LOGIN_INFO', {
          user_id: result.user_id,
          token: result.token,
        });
        changeStep(4);
        // getUserInfo({
        //     operation_id: Date.now()
        // },{
        //     token: result.token
        // })
        // .then((res:any) => {

        //  });
      }
    },
    onError: error => {
      if (error.message === '2') {
        //setLoginCaptcha(true);
      }
    },
  });

  const hanleGetPhoneNumber = (value: any) => {
    setPhoneNumber(value);
  };

  return (
    <View
      style={{
        marginTop: pt(30),
      }}>
      {regiserStep == 1 ? (
        <View>
          {accountType == 1 ? (
            <CountryCode
              setPhoneNumber={setPhoneNumber}
              phone_number={phone_number}
              country_code={country_code}
              setCountryCode={setCountryCode}></CountryCode>
          ) : (
            <View style={styles.formItemFlex}>
              <TextInput
                 placeholderTextColor={'#999'}
                onChangeText={(value: string) => setAccount(value)}
                placeholder="请输入账号"
                style={{
                  color:'#333',
                  flex: 1,
                  fontSize: pt(15),
                }}
              />
            </View>
          )}

          <View style={styles.formItemFlex}>
            <TextInput
              onChangeText={(value: string) => setPassword(value)}
              secureTextEntry={true}
              placeholderTextColor={'#999'}
              placeholder="请输入密码，长度6-16位"
              style={{
                color:'#333',
                flex: 1,
                fontSize: pt(15),
              }}
            />
          </View>

          {registerConfig?.is_invite_code === 1 ? (
            <View style={styles.formItemFlex}>
              <TextInput
                onChangeText={(value: string) => setInviteCode(value)}
                placeholder="请输入邀请码"
                placeholderTextColor={'#999'}
                style={{
                  color:'#333',
                  flex: 1,
                  fontSize: pt(15),
                }}
              />
            </View>
          ) : null}

          {accountType === 1 && registerConfig?.is_sms_code === 1 ? (
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
                registerConfig={registerConfig}
                used_for={1}
                verification_point={verification_point}></VerifyCodeBtn>
            </View>
          ) : null}
          <View
            style={{
              ...styles.flexRowCenter,
              marginTop: pt(60),
            }}>
            <Button
              onPress={confirmEnter}
              style={styles.loginButton}
              label={title}
            />
          </View>
          {/* <View style={styles.loginType}>
            <View style={styles.loginWayItem}>
              <Text style={styles.line}></Text>
              <Text style={styles.loginTips}>其它注册方式</Text>
              <Text style={styles.line}></Text>
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
                }}></SvgIcon>

              <Text style={styles.loginWayName}>
                {accountType == 1 ? '账号注册' : '手机注册'}
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
      ) : (
        <UpdateUser
          token={token}
          user_id={user_id}
          accountType={accountType}
          nickName={account ? account : phone_number}></UpdateUser>
      )}
    </View>
  );
}

let timer: any = null;
//倒计时按钮
const VerifyCodeBtn = (props: any) => {
  const [time, setTime] = useState(0);
  const {
    country_code,
    phone_number,
    registerConfig,
    used_for,
    verification_point,
  } = props;
  useEffect(() => {
    timer && clearInterval(timer);
    return () => timer && clearInterval(timer);
  }, []);

  const getVerificationCode = useRequest(verificationCode, {
    manual: true,
    onSuccess: result => {
      console.log('result========>', result);
      setTime(60);
    },
  });

  useEffect(() => {
    if (time === 60) timer = setInterval(() => setTime(time => --time), 1000);
    else if (time === 0) clearInterval(timer);
  }, [time]);

  const getCode = () => {
    console.log(country_code, '123');
    if (!phone_number) {
      Toast.info('请输入手机号');
      return;
    }
    // if (
    //   Number(registerConfig.is_verification_code) === 1 &&
    //   !verification_point
    // ) {
    //   // setLoginCaptcha(true);
    //   return;
    // }

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

// 头像/昵称/性别
function UpdateUser({nickName, token, user_id, accountType}: any) {
  const [isShow, changeShow] = useState(false);
  const [gender, setGender] = useState(1) as any;
  const [copyGender, setGopyGender] = useState(1);
  const [genderText, setGenderText] = useState('男');
  const [avatar, setAvatar] = useState();
  const [pickerVisible, setPicker] = useState(false);
  const [nick_name, setNickName] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const {domains} = useContext(EnvContext);

  const hanlePickImg = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
        selectionLimit: 1,
      },
      response => {
        if (response.assets) {
          handleUpload(response.assets, () => {}, true).then((res: any) => {
            setAvatar(res[0].thumbnail);
          });
        }
      },
    );
  };
  const hanlePicker = () => {
    setPicker(false);
    setGender(copyGender);
    setGenderText(copyGender == 1 ? '男' : '女');
  };

  const RenderPicker = () => {
    return (
      <Picker
        style={{
          flex: 1,
          marginTop: pt(-50),
        }}
        selectedValue={copyGender}
        onValueChange={(itemValue, itemIndex) => setGopyGender(itemValue)}>
        <Picker.Item label="男" value="1" />
        <Picker.Item label="女" value="2" />
      </Picker>
    );
  };
  const handleUpdateInfo = async () => {
    if (!nick_name) {
      Toast.info('请输入昵称');
      return;
    }
    const params = {
      operation_id: Date.now().toString(),
      gender: Number(gender),
      face_url: avatar,
      nick_name,
    };
    GlobalLoading.startLoading();
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
    updateInfo(params)
      .then((res: any) => {
        dispatch(setUserToken(token));
        dispatch(
          setSelfInfo({
            user_id: user_id,
            nick_name: nick_name,
            face_url: avatar,
            phone_number: accountType === 1 ? nickName : '',
            self_invite_code: res.self_invite_code,
          }),
        );
      })
      .finally(() => {
        GlobalLoading.endLoading();
      });
  };
  return (
    <View>
      <View style={styles.formItemFlex}>
        <Text>头像</Text>
        <View style={styles.avatar}>
          <Avatar
            source={{uri: avatar}}
            onPress={hanlePickImg}
            containerStyle={{marginVertical: 5, backgroundColor: '#666'}}
          />
        </View>
      </View>
      <View style={styles.formItemFlex}>
        <Text>昵称</Text>
        <TextInput
          value={nick_name}
          onChangeText={value => setNickName(value)}
          placeholder="请输入昵称"
          style={{
            flex: 1,
            fontSize: pt(15),
            textAlign: 'right',
          }}
        />
      </View>
      <View style={styles.formItemFlex}>
        <Text>性别</Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setGopyGender(gender);
              setPicker(true);
            }}
            style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                fontSize: pt(15),
                marginRight: pt(5),
              }}>
              {genderText}
            </Text>
            <Image source={Assets.icons.app.next}></Image>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          ...styles.flexRowCenter,
          marginTop: pt(60),
        }}>
        <Button
          onPress={() => {
            handleUpdateInfo();
          }}
          style={styles.loginButton}
          label={'进入'}
        />
      </View>
      <Popup
        visible={pickerVisible}
        onDismiss={() => {
          setPicker(false);
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            height: pt(260),
            width: pt(320),
            padding: pt(20),
          }}>
          <Text
            style={{
              fontSize: pt(15),
              fontWeight: 'bold',
              color: '#000',
              marginBottom: pt(20),
            }}>
            选择性别
          </Text>

          <RenderPicker></RenderPicker>
          <View
            style={{
              position: 'absolute',
              width: pt(300),
              flexDirection: 'row',
              bottom: 5,
              left: '50%',
              marginLeft: pt(-132),
              justifyContent: 'center',
            }}>
            <FullButton
              style={{
                width: pt(260),
              }}
              onPress={() => {
                hanlePicker();
              }}
              text="确定"></FullButton>
          </View>
        </View>
      </Popup>
      {/* <ImagePickerUpload type='photo' isShow={isShow} onCancel={() => changeShow(false)} onSelect={uploadImg}></ImagePickerUpload>   */}
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
  loginWayName: {},
  loginTips: {},
  line: {
    width: pt(94),
    height: pt(0.5),
    backgroundColor: '#d9d9d9',
  },
});
