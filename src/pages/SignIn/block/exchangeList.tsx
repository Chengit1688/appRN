import {StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {View, Text, ListItem} from 'react-native-ui-lib';
import {getPrizeList} from '@/api/sign';
import {pt} from '@/utils/dimension';
import _ from 'lodash';
import {Toast} from '@ant-design/react-native';

export default function ExchangeList({
  detail,
  handleRefresh,
  setIsVisible,
  setType,
  setAwardDetails,
}: any) {
  const [prizeList, setPrizeList] = React.useState<any>([]);
  //获取奖品列表
  const getPrize = () => {
    getPrizeList({
      operation_id: new Date().getTime().toString(),
    }).then((res: any) => {
      setPrizeList(res?.list || []);
    });
  };
  const handleExchange = (item: any) => {
    const balance = isNaN(detail.balance / 100) ? 0 : detail.balance / 100;
    const cost = isNaN(item.cost / 100) ? 0 : item.cost / 100;
    if (cost > balance) {
      Toast.info({
        content: '金币不足',
      });
      return;
    }
    setAwardDetails(item);
    setType(item.is_fictitious);
    setIsVisible(true);
  };
  //获取当前签到数据
  useEffect(() => {
    getPrize();
  }, []);
  return (
    <View
      style={{marginLeft: pt(20), marginRight: pt(20), paddingBottom: pt(40)}}>
      <Text style={styles.title}>金币兑换</Text>
      {_.map(prizeList, (item: any, index: number) => {
        // const imgUrl =
        //   item.is_fictitious == 1
        //     ? require('@/assets/icons/signIn/coupon.png')
        //     : {uri: item.icon};

        return (
          <View style={styles.listItem} key={index}>
            <ImageBackground
              style={{
                width: pt(70),
                height: pt(47),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              source={{uri: item.icon}}>
              {/* <Text style={{color: '#FF911C'}}>￥</Text>
              <Text
                style={{
                  color: '#FF911C',
                  fontSize: pt(27),
                  fontWeight: '500',
                }}>
                30
              </Text> */}
            </ImageBackground>

            <View style={{flex: 1, marginLeft: pt(10)}}>
              <Text style={{color: '#333', fontWeight: '500'}}>
                {item.name}
              </Text>
              <Text style={{color: '#FF911C', marginTop: pt(5)}}>
                {item.cost / 100}金币
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                handleExchange(item);
              }}
              style={styles.btn}>
              <Text style={styles.btnTxt}>立刻兑换</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: pt(16),
    fontWeight: 'bold',
  },
  listItem: {
    marginTop: pt(10),
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: '#fff',
    borderRadius: pt(5),
    padding: pt(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: pt(71),
    height: pt(28),
    backgroundColor: '#7581FF',
    borderRadius: pt(4),
  },
  btnTxt: {
    color: '#fff',
    textAlign: 'center',
    height: pt(28),
    lineHeight: pt(28),
  },
});
