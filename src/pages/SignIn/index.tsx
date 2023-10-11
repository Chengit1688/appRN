import {View, Text, Icon, TouchableOpacity} from 'react-native-ui-lib';
import React, {useEffect, useMemo} from 'react';
import LinearGradinet from 'react-native-linear-gradient';
import {ScrollView, StatusBar, StyleSheet} from 'react-native';
import {pt} from '@/utils/dimension';
import {useTranslation} from 'react-i18next';
import Card from './block/card';
import ExchangeList from './block/exchangeList';
import InKindDialog from './block/inKindDialog';
import SuccessDialog from './block/successDialog';
import {getUserSignInfo, getPrizeList} from '@/api/sign';
import GiftBoxOpen from './block/giftBox';
import dayjs, {weekdays} from 'dayjs';
import _ from 'lodash';

export default function SignInIndex(props: any) {
  const {navigation} = props;
  const {t} = useTranslation();
  const [signInfo, setSignInfo] = React.useState<any>({});
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [type, setType] = React.useState<any>();
  const [awardDetails, setAwardDetails] = React.useState<any>({});

  const balance = useMemo(() => {
    if (isNaN(signInfo.balance / 100)) {
      return 0;
    }
    return signInfo.balance / 100;
  }, [signInfo]);

  //生成当前周7天的数据
  const getCurrentWeekDates = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 获取当前星期几

    const weekStart = new Date(currentDate);
    weekStart.setDate(
      currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1),
    ); // 设置为当前周的第一天 (星期一)

    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }

    return weekDates;
  };

  const getData = () => {
    getUserSignInfo({
      operation_id: new Date().getTime().toString(),
    }).then((res: any) => {
      //格式化数据，根据当前日期，生成7个天数
      const currentWeeks = getCurrentWeekDates();
      const _res = _.map(currentWeeks, (item, index) => {
        return {
          isSignIn: res.days?.includes(item),
          gold: res?.sign_award / 100 || 0,
          date: item,
        };
      });

      setSignInfo({
        ...res,
        list: _res,
      });
    });
  };

  //获取当前签到数据
  useEffect(() => {
    getData();
  }, []);

  return (
    <View>
      <ScrollView
        style={{
          backgroundColor: '#fff',
        }}>
        <LinearGradinet
          style={styles.linearGradient}
          colors={['#7581FF', '#8767EC']}>
          <View style={{...styles.header, marginTop: 44}}>
            <TouchableOpacity
              style={styles.back}
              activeOpacity={1}
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon
                assetName="link_next"
                assetGroup="page.friends"
                size={pt(15)}
              />
            </TouchableOpacity>
            <Text style={styles.title}>{t('签到')}</Text>
          </View>
          <View row style={styles.mySpecies}>
            <View style={{flex: 1}}>
              <Text style={styles.specName}>{t('我的金币')}</Text>
              <Text style={styles.specNum}>{balance}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate({name: 'exchangeRecord'});
              }}>
              <Text style={styles.specInfo}>{t('兑换记录')}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradinet>
        <Card detail={signInfo} handleRefresh={getData}></Card>
        <ExchangeList
          setIsVisible={setIsVisible}
          detail={signInfo}
          handleRefresh={getData}
          setType={setType}
          setAwardDetails={setAwardDetails}></ExchangeList>
      </ScrollView>
      {/**弹窗 */}
      <InKindDialog
        setIsVisible={setIsVisible}
        handleRefresh={getData}
        details={awardDetails}
        isVisible={isVisible}
        type={type}></InKindDialog>
    </View>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    height: pt(250),
  },
  header: {
    position: 'relative',
    height: pt(44),
    zIndex: 999,
  },
  back: {
    position: 'absolute',
    left: pt(20),
    top: pt(16),
    transform: [{rotate: '180deg'}],
    zIndex: 999,
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: pt(18),
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: pt(44),
  },
  mySpecies: {
    marginLeft: pt(20),
    marginTop: pt(20),
  },
  specName: {
    fontSize: pt(16),
    fontWeight: '500',
    color: '#fff',
  },
  specNum: {
    fontFamily: 'DIN-Medium',
    fontSize: pt(30),
    color: '#fff',
    fontWeight: '500',
    marginTop: pt(8),
  },
  specInfo: {
    backgroundColor: '#FFFFFF',
    height: pt(31),
    width: pt(120),
    color: '#7E74F5',
    fontSize: pt(14),
    lineHeight: pt(31),
    textAlign: 'center',
    overflow: 'hidden',
    borderRadius: pt(15),
    marginRight: pt(-15),
    marginTop: pt(10),
  },
});
