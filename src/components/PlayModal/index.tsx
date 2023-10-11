import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableHighlight,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {pt} from '@/utils/dimension';
import SvgIcon from '../SvgIcon';
import {Modal as AntModal} from '@ant-design/react-native';
import {Colors, TextField, View} from 'react-native-ui-lib';
import {BoxShadow} from 'react-native-shadow';
import {getPayPassword, sendGroupRedpack, sendRedpack} from '@/api/wallet';
import {useNavigation} from '@react-navigation/native';
import FullButton from '../FullButton';
import {useTranslation} from 'react-i18next';
import * as toast from '@/utils/toast';
import GlobalLoading from '../Loading/globalLoading';

export default function PlayModal({
  isPlayModal,
  setPlayModal,
  redMoney,
  recv_id,
  remark,
  isGroup,
  redNums,
  redType,
  mine_number,
  group_id,
  receive_user_id,
}: {
  isPlayModal: boolean;
  setPlayModal: any;
  redMoney: any;
  recv_id?: any;
  remark?: any;
  isGroup?: any;
  redNums?: any;
  redType?: any;
  group_id?: any;
  mine_number?: any;
  receive_user_id?: any;
}) {
  const onCancel = () => {
    setPlayModal(false);
  };
  const [verifyCode, setVerifyCode] = useState('');
  const {t} = useTranslation();
  const [verifyCodeArr, setVerifyNumCode] = useState<any>([]);
  const {goBack, navigate} = useNavigation();

  //是否有设置密码
  const [isSetPassword, setIsSetPassword] = useState<any>(0);

  const inputRef = useRef<TextInput>(null);
  const len = verifyCode.length || 0;

  // 获取是否有设置支付密码
  const getPayPasswordStatus = () => {
    getPayPassword({
      operation_id: new Date().getTime().toString(),
    }).then(res => {
      setIsSetPassword(res.is_pay_password);
      inputRef.current?.focus();
    });
  };

  //余额不足提示
  const showBalance = () => {
    AntModal.alert(t('提示'), t('当前余额不足，请充值后再试'), [
      {
        text: '取消',
        onPress: () => {
          setPlayModal(false);
        },
      },
      {
        text: '前往充值',
        onPress: () => {
          setPlayModal(false);
          navigate({name: 'UserWallet'} as never);
        },
        style: {
          color: Colors.red30,
        },
      },
    ]);
  };

  // 提交红包
  const handleplay = (payPwd: string) => {
    if (!isGroup) {
      GlobalLoading.startLoading();
      sendRedpack({
        operation_id: new Date().getTime().toString(),
        amount: parseFloat(redMoney) * 100,
        remark: remark || '',
        recv_id: recv_id || '',
        pay_passwd: payPwd,
      })
        .then(res => {
          if (res.code === 0) {
            setPlayModal(false);
            goBack();
          } else {
            setPlayModal(false);
            if (res.code === 10145) {
              showBalance();
              return;
            }
            toast.error(res.message);
          }
        })
        .catch(err => {
          console.log(err, 'err');
        })
        .finally(() => {
          GlobalLoading.endLoading();
        });
    } else {
      GlobalLoading.startLoading();
      sendGroupRedpack({
        operation_id: new Date().getTime().toString(),
        amount: parseFloat(redMoney) * 100,
        remark: remark || '',
        type: redType,
        mine_number,
        receive_user_id,
        group_id: group_id,
        count: Number(redNums),
        pay_passwd: payPwd,
      })
        .then(res => {
          if (res.code === 0) {
            setPlayModal(false);
            goBack();
          } else {
            setPlayModal(false);
            if (res.code === 10145) {
              showBalance();
              return;
            }
            toast.error(res.message);
          }
        })
        .catch(err => {
          toast.error('服务有误，请稍后重试');
        })
        .finally(() => {
          GlobalLoading.endLoading();
        });
    }
  };

  useEffect(() => {
    getPayPasswordStatus();
  }, []);
  return (
    <View
      style={{
        ...styles.showMain,
      }}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.outSideView}
        onPress={onCancel}
      />

      <Modal
        animationType={'slide'}
        transparent={true}
        statusBarTranslucent={true}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
          }}>
          <View
            flex
            style={{
              height: '100%',
              opacity: 0,
            }}></View>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={onCancel}
                style={{
                  position: 'absolute',
                  zIndex: 999,
                  left: 20,
                }}>
                <SvgIcon
                  name="closeBack"
                  size={22}
                  style={{
                    width: pt(10),
                    height: pt(16),
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.title}>请输入支付密码</Text>
            </View>
            <View style={styles.redMoney}>
              <Text style={styles.moneyTag}>￥</Text>
              <Text style={styles.moneyText}>{redMoney}</Text>
            </View>
            <View
              style={{
                marginTop: pt(30),
              }}>
              {isSetPassword == 2 ? (
                <View row center>
                  <FullButton
                    text="请先设置支付密码"
                    style={{
                      width: pt(180),
                    }}
                    onPress={() => {
                      setPlayModal(false);
                      navigate('setPayPassword' as never);
                    }}></FullButton>
                </View>
              ) : (
                <View row center>
                  {Array.from({length: 6}).map((_, index) => {
                    return (
                      <TouchableHighlight
                        style={{
                          marginHorizontal: pt(5),
                        }}
                        key={index}
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
                              backgroundColor: '#ffffff',
                              overflow: 'hidden',

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
                      if (text.length <= 6) {
                        setVerifyCode(text.trim());
                        setVerifyNumCode(
                          Array.from({length: text.length}).map(() => '●'),
                        );
                      }
                      if (text.trim().length === 6) {
                        handleplay(text.trim());
                        // navigate('GroupChatJoin', {
                        //   verifyCode: text.trim(),
                        // });
                      }
                    }}
                    ref={inputRef}
                    value={verifyCode}
                    style={{
                      position: 'absolute',
                      width: 0,
                      height: 0,
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  showMain: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  outSideView: {
    backgroundColor: 'rgba(0,0,0,.4)',
    flex: 1,
    height: '100%',
  },
  header: {
    marginTop: pt(20),
    width: '100%',
  },
  title: {
    fontSize: pt(13),
    textAlign: 'center',
  },

  container: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#fff',
    // marginTop: pt(-20),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 30,
    overflow: 'hidden',
    height: pt(240),
  },
  redMoney: {
    flexDirection: 'row',
    marginTop: pt(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: pt(20),
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: pt(1),
    marginLeft: pt(16),
    marginRight: pt(16),
  },
  moneyTag: {
    fontSize: pt(15),
  },
  moneyText: {
    fontSize: pt(28),
    fontWeight: 'bold',
  },
});
