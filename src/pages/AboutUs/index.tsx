import React, {Fragment} from 'react';
import {View, Text, Button} from 'react-native-ui-lib';
import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Navbar} from '@/components';
import {pt} from '@/utils/dimension';
import {useTranslation} from 'react-i18next';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default function LoginPage({navigation}: any) {
  const {t} = useTranslation();

  return (
    <Fragment>
      <Navbar title="关于我们" />
      <View flexG flex-1 bg-white spread style={styles.pageContainer}>
        <View flexG centerH>
          <Text center text14 text>
            当前版本:1.0.0
          </Text>
        </View>
        <View row centerV centerH>
          <Text text13 text>
            登陆即代表同意
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('userAgreement');
            }}>
            <Text text13 primary>
              《用户服务协议》
            </Text>
          </TouchableOpacity>

          <Text text13 text>
            和
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('privacyPolicy');
            }}>
            <Text text13 primary>
              《隐私条款》
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    paddingTop: pt(48),
    paddingBottom: pt(37),
  },
});
