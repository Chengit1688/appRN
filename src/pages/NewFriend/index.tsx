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
  Assets,
} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import _ from 'lodash';
import {useTranslation} from 'react-i18next';
import Loading from '@/components/Loading';
import {Navbar, Empty} from '@/components';
import {useLoadList} from '@/hooks';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {formatUrl} from '@/utils/common';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  checkoutConversation,
  updateSettingInfo,
} from '@/store/reducers/conversation';
import {useNavigation} from '@react-navigation/native';
import {RootState} from '@/store';
import GlobalLoading from '@/components/Loading/globalLoading';
import {setNoticeCount} from '@/store/actions';
import FastImage from 'react-native-fast-image';

// handleFriendApplication
export default function Label(props: any) {
  const {navigation, route} = props;
  const {params} = route;
  const dispatch = useDispatch();
  const {navigate} = useNavigation();
  const USER = useSelector((state: RootState) => state.user);
  const user_id = useMemo(() => USER.selfInfo.user_id, [USER]);
  const isSingle = params?.isSingle || false;
  const {t} = useTranslation();
  const [selecteds, setSelecteds] = useState<any>({...params?.selecteds}); //选中的标签

  const {loading, list, pagination, haveMore} = useLoadList((_params: any) => {
    return imsdk.getUserFriendaApplyList({
      ..._params,
    });
  });

  useEffect(() => {
    // const nums = list.reduce((prev: any, next: any) => {
    //   const n = +next.status === 0 && +next.is_owner === 0 ? 1 : 0;
    //   return prev + n;
    // }, 0);
    const newarr =
      list?.filter((item: any) => item.status === 0 && item.is_owner === 0) ||
      [];
    dispatch(
      setNoticeCount({
        ...noticeCount,
        friendNotice: newarr.length,
      }),
    );
  }, [list]);

  const noticeCount = useSelector(
    (state: RootState) => state.contacts.noticeCount,
    shallowEqual,
  );

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

  const sendMessage = async (userId: string, name: '') => {
    // // imsdk.getUserProfile(userId).then(async (item: any) => {
    // const {data} = await imsdk.comlink.getConversationCountByUserId(userId);

    // if (data?.[0]?.conversation_id) {
    //   dispatch(checkoutConversation(data[0].conversation_id));
    //   navigate('Chat');
    //   return;
    // }
    // const conv_id = [userId, user_id].sort((a, b) => a - b).join('_');

    // await imsdk.comlink.insertConversationList([
    //   {
    //     conversation_id: conv_id,
    //     type: 1,
    //     friend: userId,
    //     latest_message: '',
    //     name,
    //     status: 1,
    //   },
    // ]);
    // await imsdk.getConversationList();

    // dispatch(checkoutConversation(conv_id));
    // setTimeout(() => {
    //   GlobalLoading.endLoading();
    //   navigate('Chat');
    // });

    // // });
    imsdk.getUserProfile(userId).then(async (item: any) => {
      const {data} = await imsdk.comlink.getConversationCountByUserId(
        item.user_id,
      );
      if (data?.[0]?.conversation_id) {
        dispatch(checkoutConversation(data[0].conversation_id));
        navigate('Chat');
        return;
      }
      const conv_id = [item.user_id, user_id].sort((a, b) => a - b).join('_');
      await imsdk.comlink.insertConversationList([
        {
          conversation_id: conv_id,
          type: 1,
          friend: item.user_id,
          group_id: '',
          latest_message: '',
          status: 1,
        },
      ]);
      await imsdk.getConversationList();
      dispatch(updateSettingInfo(item));
      dispatch(checkoutConversation(conv_id));
      navigate('Chat');
    });
  };

  const goVerify = (item: any) => {
    Modal.alert('验证', '是否同意添加好友', [
      {
        text: '拒绝',
        onPress: () => {
          imsdk
            .handleFriendApplication(
              {
                req_id: item.id,
              },
              2,
            )
            .then(res => {
              pagination.onChange(1, 10);
              Toast.info('已拒绝');
              dispatch(
                setNoticeCount({
                  ...noticeCount,
                  friendNotice: noticeCount.friendNotice - 1,
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
          GlobalLoading.startLoading();
          imsdk
            .handleFriendApplication(
              {
                req_id: item.id,
              },
              1,
            )
            .then(res => {
              pagination.onChange(1, 10);
              Toast.info('已同意');
              dispatch(
                setNoticeCount({
                  ...noticeCount,
                  friendNotice: noticeCount.friendNotice - 1,
                }),
              );
              // imsdk.addFriend({
              //   user_id: item.user_id,
              //   req_msg: item.req_msg,
              //   remark: '',
              // });
              sendMessage(item.user_id, item.nick_name);
            })
            .finally(() => {
              GlobalLoading.endLoading();
            });
        },
        style: {
          color: '#7581FF',
        },
      },
    ]);
  };

  const handlerNavigate = () => {
    if (isSingle) {
      DeviceEventEmitter.emit('selectTag', {selecteds});
      navigation.goBack();
      return;
    }
    navigation.navigate({name: params?.source, params: {tags: selecteds}});
  };

  useFocusEffect(
    React.useCallback(() => {
      pagination.onChange(1, 10);
    }, []),
  );

  return (
    <>
      <Navbar
        title="新朋友"
        right={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddFriends');
            }}>
            <Text
              style={{
                fontSize: pt(14),
                color: '#333',
                fontWeight: '500',
              }}>
              添加朋友
            </Text>
          </TouchableOpacity>
        }
      />
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
            const avatar = item.face_url
              ? {
                  uri: formatUrl(item.face_url),
                  cache: FastImage.cacheControl.web,
                }
              : Assets.imgs.avatar.defalut;
            return (
              <ListItem key={index}>
                <ListItem.Part
                  left
                  containerStyle={{
                    marginLeft: pt(15),
                  }}>
                  <FastImage
                    style={{
                      width: pt(40),
                      height: pt(40),
                      borderRadius: pt(20),
                      backgroundColor: Colors.grey60,
                    }}
                    resizeMode="cover"
                    source={avatar}
                  />
                  {/* <Avatar
                    containerStyle={{}}
                    {...{
                      name: item.nick_name,
                      size: pt(40),
                      source: {
                        uri: formatUrl(item.face_url),
                      },
                    }}
                  /> */}
                </ListItem.Part>
                <ListItem.Part style={{flex: 1}} centerV>
                  <View row centerV spread>
                    <View
                      style={{
                        marginLeft: pt(10),
                        flex: 1,
                      }}>
                      <Text style={styles.labelName}>{item.nick_name}</Text>
                      <Text style={styles.labelNums}>{item.req_msg}</Text>
                    </View>
                    {+item.status === 0 && item.is_owner !== 1 && (
                      <TouchableOpacity onPress={() => goVerify(item)}>
                        <View style={styles.verifyBtn}>
                          <Text style={styles.verifyText}>验证</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    {+item.status === 0 && item.is_owner === 1 && (
                      <View
                        style={{
                          marginRight: pt(21),
                        }}>
                        <Text style={{fontSize: pt(14), color: '#666'}}>
                          等待验证
                        </Text>
                      </View>
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
                        {item.is_owner === 1 ? '对方拒绝' : '已拒绝'}
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
