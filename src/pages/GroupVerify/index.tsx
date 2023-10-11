import {
  ScrollView,
  StyleSheet,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Modal, Toast} from '@ant-design/react-native';
import {
  Colors,
  ListItem,
  Avatar,
  TouchableOpacity,
  View,
  Text,
} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import _ from 'lodash';
import {useTranslation} from 'react-i18next';
import Loading from '@/components/Loading';
import {Navbar, Empty} from '@/components';
import {useLoadList} from '@/hooks';
import imsdk from '@/utils/IMSDK';
import {formatUrl} from '@/utils/common';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {setNoticeCount} from '@/store/actions';

// handleFriendApplication
export default function Label(props: any) {
  const {t} = useTranslation();

  const {loading, list, pagination, haveMore} = useLoadList((_params: any) => {
    return imsdk.getJoinGroupApplication({
      ..._params,
    });
  });

  const contentViewScroll = e => {
    var offsetY = e.nativeEvent.contentOffset.y;
    var contentSizeHeight = e.nativeEvent.contentSize.height;
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height;

    if (offsetY + oriageScrollHeight >= contentSizeHeight) {
      if (!haveMore || loading) {
        return;
      }
      pagination.onChange(pagination.current + 1, 10);
    }
  };
  const noticeCount = useSelector(
    (state: any) => state.contacts.noticeCount,
    shallowEqual,
  );

  const dispatch = useDispatch();
  useEffect(() => {
    const newarr = list?.filter((item: any) => item.status === 0) || [];
    dispatch(
      setNoticeCount({
        ...noticeCount,
        groupNotice: newarr.length,
      }),
    );
  }, [list]);

  const goVerify = (item: any) => {
    Modal.alert('验证', '是否同意加入群聊', [
      {
        text: '拒绝',
        onPress: () => {
          imsdk.refuseJoinGroupApplication(item.id).then(res => {
            pagination.onChange(1, 10);
            Toast.info('已拒绝');
            dispatch(
              setNoticeCount({
                ...noticeCount,
                groupNotice: noticeCount.groupNotice - 1,
              }),
            );
          });
        },
        style: {
          color: '#F53C3C',
        },
      },
      {
        text: '同意',
        onPress: () => {
          imsdk.accepetJoinGroupApplication(item.id).then(res => {
            pagination.onChange(1, 10);
            Toast.info('已同意');
            dispatch(
              setNoticeCount({
                ...noticeCount,
                groupNotice: noticeCount.groupNotice - 1,
              }),
            );
          });
        },
        style: {
          color: '#7581FF',
        },
      },
    ]);
  };

  useFocusEffect(
    React.useCallback(() => {
      pagination.onChange(1, 10);
    }, []),
  );

  return (
    <>
      <Navbar title="群认证" />
      <ScrollView
        style={{
          backgroundColor: Colors.white,
        }}
        onMomentumScrollEnd={contentViewScroll}>
        {!loading && !haveMore && !list.length && (
          <View
            style={{
              height: pt(400),
            }}>
            <Empty />
          </View>
        )}
        {loading && !list.length && <Loading />}
        <View
          style={{
            minHeight: Dimensions.get('screen').height,
          }}>
          {_.map(list, (item: any, index) => {
            return (
              <ListItem key={index}>
                <ListItem.Part
                  left
                  containerStyle={{
                    marginLeft: pt(15),
                  }}>
                  <Avatar
                    containerStyle={{}}
                    {...{
                      name: item.nick_name,
                      size: pt(40),
                      source: {
                        uri: formatUrl(item.face_url),
                      },
                    }}
                  />
                </ListItem.Part>
                <ListItem.Part style={{flex: 1}} centerV>
                  <View row centerV spread>
                    <View
                      style={{
                        marginLeft: pt(10),
                        flex: 1,
                      }}>
                      <Text style={styles.labelName}>
                        {item.nick_name}(群聊：{item.group_name})
                      </Text>
                      <Text style={styles.labelNums}>{item.remark}</Text>
                    </View>
                    {+item.status === 0 && (
                      <TouchableOpacity onPress={() => goVerify(item)}>
                        <View style={styles.verifyBtn}>
                          <Text style={styles.verifyText}>验证</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    {+item.status === 1 && (
                      <Text
                        style={{
                          marginRight: pt(21),
                          fontSize: pt(14),
                          color: '#666',
                        }}>
                        已添加
                      </Text>
                    )}
                    {+item.status === 2 && (
                      <Text
                        style={{
                          marginRight: pt(21),
                          fontSize: pt(14),
                          color: '#666',
                        }}>
                        已拒绝
                      </Text>
                    )}
                  </View>
                </ListItem.Part>
              </ListItem>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    width: pt(40),
    height: pt(40),
    borderRadius: pt(20),
    overflow: 'hidden',
    backgroundColor: '#7581FF',
    textAlign: 'center',
    color: '#fff',
    lineHeight: pt(40),
    fontSize: pt(18),
    fontWeight: 'bold',
  },
  labelName: {
    fontSize: pt(14),
    color: '#222',
    fontWeight: '500',
  },
  labelNums: {
    fontSize: pt(13),
    color: '#999',
    fontWeight: '400',
    marginTop: pt(5),
  },
  verifyBtn: {
    paddingHorizontal: pt(12),
    backgroundColor: '#7581FF',
    marginRight: pt(16),
    height: pt(27),
    borderRadius: pt(4),
  },
  verifyText: {
    color: '#fff',
    fontSize: pt(14),
    lineHeight: pt(27),
  },
});
