import {RootState} from '@/store';
import {pt} from '@/utils/dimension';
import _, {set} from 'lodash';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Avatar, View, Text, TouchableOpacity, Image} from 'react-native-ui-lib';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {setRemindCiircleRed} from '@/store/reducers/global';

export default function RemindList() {
  const remindCircle = useSelector(
    (state: RootState) => state.global.remindCiircle,
    shallowEqual,
  );
  const {navigate} = useNavigation();
  const dispatch = useDispatch();
  const handlePress = () => {
    // dispatch(setRemindCiircleRed(item));
    //跳转
    navigate('circleMessageList' as never);
  };

  return (
    <>
      {remindCircle.length > 0 ? (
        <View center style={{marginTop: pt(20)}}>
          <TouchableOpacity
            onPress={() => {
              handlePress();
            }}
            activeOpacity={1}
            row
            centerV
            style={styles.main}>
            {_.map(remindCircle, (item, index: number) => {
              if (index > 2) return null;
              const avatar = item.face_url
                ? {uri: item.face_url}
                : require('@/assets/imgs/defalut_avatar.png');
              return (
                <Image
                  source={avatar}
                  key={index}
                  style={{
                    width: pt(30),
                    height: pt(30),
                    marginRight: pt(6),
                    borderRadius: pt(3),
                    overflow: 'hidden',
                  }}
                />
              );
            })}
            {/* <Image
            source={avatar}
            style={{
              width: pt(30),
              height: pt(30),
              borderRadius: pt(3),
              overflow: 'hidden',
            }}
          /> */}
            <Text style={styles.tips}>{remindCircle.length}条新消息</Text>
          </TouchableOpacity>
          {/* {_.map(remindCircle, (item, index) => {
      const avatar = item.face_url
        ? {uri: item.face_url}
        : require('@/assets/imgs/defalut_avatar.png');
      return (
        <TouchableOpacity
          onPress={() => {
            handlePress(item);
          }}
          activeOpacity={1}
          key={index}
          row
          centerV
          style={styles.main}>
          <Image
            source={avatar}
            style={{
              width: pt(30),
              height: pt(30),
              borderRadius: pt(3),
              overflow: 'hidden',
            }}
          />
          <Text style={styles.tips}>1条新消息</Text>
        </TouchableOpacity>
      );
    })} */}
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#000',
    borderRadius: pt(4),
    padding: pt(6),
    marginBottom: pt(6),
  },
  tips: {
    color: '#fff',
    width: pt(100),
    textAlign: 'center',
    fontWeight: '500',
  },
});
