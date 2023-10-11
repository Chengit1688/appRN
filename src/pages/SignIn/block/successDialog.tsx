import {ImageBackground, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  View,
  Text,
  Dialog,
  PanningProvider,
  TextField,
  Icon,
  Image,
} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import {useTranslation} from 'react-i18next';
import * as Animatable from 'react-native-animatable';

export default function SuccessDialog({
  visible,
  award,
  isGift,
  cancel,
}: {
  visible: boolean;
  award: number;
  isGift: boolean;
  cancel: () => void;
}) {
  const {t} = useTranslation();
  return (
    <Dialog
      visible={visible}
      onDismiss={() => cancel()}
      panDirection={PanningProvider.Directions.UP}>
      <View row center>
        <ImageBackground
          source={require('@/assets/icons/signIn/siginBg.png')}
          style={{
            width: pt(238),
            height: pt(269),
          }}>
          <Text
            style={{
              marginTop: pt(130),
              textAlign: 'center',
              color: '#fff',
              fontSize: pt(16),
              fontWeight: 'bold',
              textShadowColor: 'rgba(255,255,255,.8)', // 发光效果颜色
            }}>
            {t(`签到成功！${isGift ? '大礼包' : '金币'}已到账`)}
          </Text>
          {/* <Animatable.Text
                           animation={isGift ? 'bounceIn' : ''}
                           duration={1000}
                           iterationCount="infinite"
                            style={{
                                marginTop:pt(10),
                                textAlign:'center',
                                color:"#FED523",
                                fontSize: pt(17),
                                fontWeight: 'bold',
                            
                            }}
                    >+{award} 金币</Animatable.Text> */}
          <TouchableOpacity activeOpacity={1} onPress={cancel}>
            <Text style={styles.dialogBtn}>{t('确定')}</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <TouchableOpacity style={styles.close} onPress={cancel}>
        <Icon
          style={styles.closeIcon}
          size={32}
          assetName="add_btn"
          assetGroup="icons.app"></Icon>
      </TouchableOpacity>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialogTitle: {
    fontSize: pt(15),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: pt(10),
  },
  dialogTips: {
    fontSize: pt(13),
    fontWeight: '500',
    color: '#999',
    marginBottom: pt(10),
  },
  dialogInput: {
    borderBottomColor: 'rgba(102, 102, 102, .1)',
    borderBottomWidth: pt(1),
    paddingBottom: pt(10),
    marginTop: pt(10),
  },
  inputTxt: {
    flex: 1,
  },
  dialogBtn: {
    height: pt(44),
    marginTop: pt(20),
    marginLeft: pt(20),
    marginRight: pt(20),
    backgroundColor: '#fff',
    textAlign: 'center',
    lineHeight: pt(44),
    color: '#7581FF',
    borderRadius: pt(20),
    overflow: 'hidden',
    fontSize: pt(15),
    fontWeight: 'bold',
  },
  close: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: pt(20),
  },
  closeIcon: {
    transform: [{rotate: '45deg'}],
  },
  imgMain: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: pt(13),
    elevation: 3,
    shadowColor: 'rgb(108,124,149)',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: '#fff',
    marginTop: pt(10),
    borderRadius: pt(5),
  },
});
