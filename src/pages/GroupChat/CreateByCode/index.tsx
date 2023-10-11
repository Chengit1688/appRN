import React, {useState, useRef, useEffect} from 'react';
import {Shadows, Text, TextField, View} from 'react-native-ui-lib';
import {TextInput, TouchableHighlight} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {opacity, pt} from '@/utils/dimension';
import {Navbar} from '@/components';
import {BoxShadow} from 'react-native-shadow';
import Avatar from '@/components/Avatar';

export default function CreateByCode() {
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const [verifyCode, setVerifyCode] = useState('');
  const inputRef = useRef<TextInput>(null);
  const len = verifyCode.length || 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <Navbar title="面对面发起群" />
      <View center style={{marginTop: pt(22)}}>
        <Avatar
          size={pt(47)}
          iconSize={pt(25)}
          assetName="groupcreate"
          assetGroup="page.groupchat"
        />
        <Text
          center
          style={{
            marginTop: pt(15),
            marginBottom: pt(66),
            width: pt(253),
            fontSize: pt(16),
            fontWeight: 'bold',
            color: '#12203B',
          }}>
          {t('和身边的朋友输入同样的六个数字, 进入同一个群聊')}
        </Text>
      </View>
      <View row center>
        {Array.from({length: 6}).map((_, index) => {
          let boxStyle: any = {};
          if (index < len) {
            boxStyle = {
              backgroundColor: '#7581FF',
            };
          }
          if (index === len) {
            boxStyle = {
              backgroundColor: '#ffffff',
            };
          }
          if (index > len) {
            boxStyle = {
              backgroundColor: '#F5F6FA',
            };
          }
          return (
            <TouchableHighlight
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
                  color: index === len ? '#F5F6FA' : '#ffffff', // 阴影颜色
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
                    borderColor: '#F5F6FA',
                    ...boxStyle,
                  }}>
                  <TextField
                    value={verifyCode[index]}
                    maxLength={1}
                    readonly
                    textAlign="center"
                    cursorColor="#ffffff"
                    inputMode="numeric"
                    keyboardType="numeric"
                    style={{
                      fontSize: pt(29),
                      fontWeight: 'bold',
                      color: '#ffffff',
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
            }
            if (text.trim().length === 6) {
              navigate('GroupChatJoin', {
                verifyCode: text.trim(),
              });
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
    </>
  );
}
