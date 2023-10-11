import {View, Text, Switch, Icon, Image, Button} from 'react-native-ui-lib';
import React from 'react';
import {SwipeAction} from '@ant-design/react-native';
import {pt} from '@/utils/dimension';
import _ from 'lodash';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import FullButton from '@/components/FullButton';
import {signToday} from '@/api/sign';
import SuccessDialog from './successDialog';

export default function Card({detail, handleRefresh}: any) {
  const {t} = useTranslation();
  const [dialogObj, setDialogObj] = React.useState({
    visible: false,
    award: 0,
    isGift: false,
  });
  //点击签到
  const handleSignIn = () => {
    if (detail.today) return;
    signToday({
      operation_id: new Date().getTime().toString(),
    }).then((res: any) => {
      let total = detail.total + 1;
      setDialogObj({
        visible: true,
        award: res?.sign_award / 100 || 0,
        //是否大礼包标志
        isGift: total === 7, //如果当前签到天数已经到第6天，那么就弹出金币大礼包
      });
      handleRefresh && handleRefresh();
    });
  };

  let btnStyle = detail.today ? {...styles.disabledBtn} : {};

  const cancel = () => {
    setDialogObj({
      ...dialogObj,
      visible: false,
    });
  };

  return (
    <View>
      <View style={styles.card}>
        <View row centerH>
          <Text
            style={{
              flex: 1,
              color: '#2D3351',
              fontSize: pt(15),
              fontWeight: '300',
            }}>
            已签到{detail?.total || 0}天
          </Text>
          {/* <View row>
                <Text style={{ color:'rgba(45, 51, 81, 0.6)', marginRight:pt(10), fontSize:pt(12)}}>开启提醒</Text>
                <Switch style={{ width: pt(34), height: pt(16)}} thumbStyle={{ width: pt(13), height:pt(13)}}  height={pt(14)} value={true}  onColor={'#7581FF'}></Switch>
            </View> */}
        </View>
        <View
          row
          style={{
            flexWrap: 'wrap',
            marginTop: pt(10),
            justifyContent: 'space-between',
          }}>
          {_.map(detail.list, (item, index: number) => {
            return (
              <View key={index}>
                {index === 6 ? (
                  <View
                    key={index}
                    style={{
                      width: pt(150),
                      borderWidth: pt(1),
                      borderColor: '#7581FF',
                      marginTop: pt(6),
                      borderRadius: pt(5),
                      ...(item.isSignIn ? styles.awardActive : null),
                    }}>
                    <Text
                      style={[
                        styles.dayNum,
                        item.isSignIn ? styles.dayNumActive : null,
                      ]}>
                      第{index + 1}天
                    </Text>
                    <View style={styles.dayMain}>
                      <Icon
                        assetName="giftBag"
                        assetGroup="page.signIn"
                        size={30}></Icon>
                      <Text
                        style={[
                          styles.species,
                          item.isSignIn ? styles.speciesActive : null,
                        ]}>
                        金币大礼包
                      </Text>
                      <Image
                        style={styles.bg}
                        source={require('@/assets/icons/signIn/moneyBg.png')}></Image>
                    </View>
                  </View>
                ) : (
                  <View
                    key={index}
                    style={[
                      styles.awardItem,
                      item.isSignIn ? styles.awardActive : null,
                    ]}>
                    <Text
                      style={[
                        styles.dayNum,
                        item.isSignIn ? styles.dayNumActive : null,
                      ]}>
                      第{index + 1}天
                    </Text>
                    <View style={styles.dayMain}>
                      <Icon
                        assetName="species"
                        assetGroup="page.signIn"
                        size={30}></Icon>
                      <Text
                        style={[
                          styles.species,
                          item.isSignIn ? styles.speciesActive : null,
                        ]}>
                        金币
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        {/* <View row style={{ marginTop: pt(19)}}>
            <Text style={{ color:"#FF5000"}}>*</Text>
            <Text style={{ color:'#2D3351', fontSize:pt(11), marginLeft: pt(3)}}>{t('连续签到满7天即可获得金币大礼包，断签将会重新计算')}</Text>
        </View> */}
      </View>
      <FullButton
        style={btnStyle as never}
        text={detail.today ? t('已签到') : t('签到')}
        onPress={() => {
          handleSignIn();
        }}></FullButton>

      <SuccessDialog
        cancel={cancel}
        isGift={dialogObj.isGift}
        visible={dialogObj.visible}
        award={dialogObj.award}></SuccessDialog>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: pt(20),
    padding: pt(16),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: '#fff',
    borderRadius: pt(10),
    marginTop: pt(-70),
    marginBottom: pt(0),
  },
  awardItem: {
    width: pt(72),
    borderWidth: pt(1),
    borderColor: '#7581FF',
    marginTop: pt(6),
    borderRadius: pt(5),
  },
  awardActive: {
    borderColor: '#E5E5E5',
  },
  dayNumActive: {
    backgroundColor: '#E5E5E5',
  },
  speciesActive: {
    color: '#B3B3B3',
  },
  dayNum: {
    backgroundColor: '#7581FF',
    color: '#fff',
    height: pt(26),
    lineHeight: pt(26),

    textAlign: 'center',
  },
  dayMain: {
    height: pt(70),
    alignItems: 'center',
    justifyContent: 'center',
  },
  species: {
    color: '#FF911C',
    marginTop: pt(5),
  },
  bg: {
    width: pt(61.5),
    height: pt(90.5),
    position: 'absolute',
    bottom: 0,
    right: pt(2),
  },
  disabledBtn: {
    backgroundColor: '#E5E5E5',
  },
});
