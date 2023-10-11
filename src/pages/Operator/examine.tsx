import {View, Text, Image} from 'react-native-ui-lib';
import React from 'react';
import {StyleSheet} from 'react-native';
import {pt} from '@/utils/dimension';
import {useTranslation} from 'react-i18next';
import FullButton from '@/components/FullButton';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';

export default function Examine(props: any) {
  const {params} = useRoute<any>();
  const {t} = useTranslation();
  const {goBack} = useNavigation();
  return (
    <View style={{backgroundColor: '#fff', height: '100%'}}>
      <Image
        resizeMode={'cover'}
        style={{
          width: '100%',
        }}
        source={require('@/assets/imgs/examine_bg.png')}></Image>
      <View row center>
        <Text style={styles.successConext}>
          {params?.realName
            ? t(`你的实名认证申请已经提交，等待审核`)
            : t(`你的{运营商申请已经提交，等待审核}`)}
        </Text>
      </View>
      {!params?.realName ? (
        <Text style={styles.textTips}>
          {t('我们将会在1-2个工作日内给您回复')}
        </Text>
      ) : null}

      <FullButton
        style={{marginTop: pt(50)}}
        text="我知道了"
        onPress={() => {
          goBack();
        }}></FullButton>
    </View>
  );
}

const styles = StyleSheet.create({
  successConext: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: pt(44),
    width: pt(300),
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: pt(16),
    lineHeight: pt(30),
  },
  textTips: {
    color: '#666',
    fontSize: pt(13),
    textAlign: 'center',
    marginTop: pt(20),
  },
  name: {
    color: '#7581FF',
    fontWeight: 'bold',
    fontSize: pt(18),
  },
  successTxt: {},
});
