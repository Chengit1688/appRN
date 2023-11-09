/**
 * 这里用于输入框获取群成员 @的人员
 *
 */

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  VirtualizedList,
  FlatList,
  Modal,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {pt} from '@/utils/dimension';
import {Assets, Avatar, Colors, TouchableOpacity} from 'react-native-ui-lib';
import SearchInput from '@/components/SearchInput';
import {SvgIcon} from '@/components';
import {formatUrl} from '@/utils/common';
import FastImage from 'react-native-fast-image';
import useLoadList from '@/hooks/useLoadList';
import imsdk from '@/utils/IMSDK';
import {shallowEqual, useSelector} from 'react-redux';
import LoadFooter from '@/components/loadFooter';
import {set} from 'lodash-es';

export default function GroupMember({
  groupInfo,
  groupMember,
  setAtUser,
  isAt,
  onCancel,
}: any) {
  const [initVal, setData] = useState<any>([]);
  const [init, setInit] = useState<any>(true);
  const [copyVal, setCopyVal] = useState<any>([]);
  const [userRole, setUserRole] = useState<any>({});
  const [keyword, setKeyword] = useState<any>('');
  const [loading, setLoading] = useState<any>(false);
  const [isEnd, setEndStatus] = useState<any>(false);
  const selfInfo = useSelector(
    (state: any) => state.user.selfInfo,
    shallowEqual,
  );
  // 获取当前用户角色
  const groupMemberInfo = useMemo(async () => {
    const info = await imsdk.comlink.getGroupById(groupInfo.group_id);
    return info?.data[0].role;
  }, [groupInfo]);

  const [pagination, setPagination] = useState<any>({
    page: 1,
    page_size: 50,
    total: 0,
  });
  // useEffect(() => {
  //   imsdk.comlink
  //     .getGroupMemberById(`${groupInfo.group_id}_${selfInfo.user_id}`)
  //     .then((res: any) => {
  //       setUserRole({...res?.data[0]});
  //     });
  // }, [groupInfo]);
  useEffect(() => {
    getMemberList();
  }, [pagination]);

  // const {loading, list, pagination, haveMore, setList} = useLoadList(
  //   (_params: any) => {
  //     return imsdk.comlink.getGroupMember(
  //       500,
  //       _params.page,
  //       groupInfo.group_id,
  //     );
  //   },
  // );

  useEffect(() => {
    getMemberList();
  }, [pagination, keyword]);

  const getMemberList = () => {
    setLoading(true);
    imsdk
      .getGroupMemberList({
        group_id: groupInfo?.group_id,
        page: pagination.page,
        page_size: pagination.page_size,
        search_key: keyword,
      })
      .then(async (res: any) => {
        const list = res?.list || [];
        const role = await groupMemberInfo;
        if ((role == 'admin' || role == 'owner') && init) {
          initVal.push({
            nick_name: '所有人',
            user_id: 'all',
          });
          setInit(false);
        }
        const fromatList = list
          .filter((item: any) => item.status == 1)
          .filter((item: any) => item.user_id != selfInfo.user_id)
          .map((item: any) => {
            return {
              ...item,
              ...item.user,
            };
          });
        const newList = initVal.concat(fromatList);
        const total =
          role == 'admin' || role == 'owner' ? res.count : res.count - 1;

        if (newList.length >= total) {
          setEndStatus(true);
        }
        setData(newList);
        // setCopyVal(newList);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearchTextChange = (val: any) => {
    if (val == '') {
      setInit(true);
    }
    setData([]);
    setEndStatus(false);
    setKeyword(val);
    setPagination({
      ...pagination,
      page: 1,
    });
  };
  const onLoadMore = () => {
    if (!loading && !isEnd) {
      setPagination({
        ...pagination,
        page: pagination.page + 1,
      });
    }
  };

  const renderItem = (data: any) => {
    const {item, index} = data;
    const avatar = item.face_url
      ? {uri: formatUrl(item.face_url), cache: FastImage.cacheControl.web}
      : Assets.imgs.avatar.defalut;
    if (item.user_id === 'all') {
      return <></>;
    }
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setAtUser(item);
        }}
        row
        style={{
          alignItems: 'center',
          borderBottomColor: '#e5e5e5',
          borderBottomWidth: pt(1),
          paddingBottom: pt(8),
          paddingTop: pt(8),
        }}>
        <FastImage
          style={{
            width: pt(38),
            height: pt(38),
            borderRadius: pt(20),
            backgroundColor: Colors.grey60,
            marginLeft: pt(10),
            marginRight: pt(10),
          }}
          resizeMode="cover"
          source={avatar}
        />
        {/* <Avatar
          {...{
            name: item.nick_name,
            size: pt(38),
            source: avatar,
            containerStyle: {
             
            },
          }}
        /> */}
        <Text>{item.group_nick_name || item.nick_name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {isAt ? (
        <View style={styles.showMain}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.outSideView}
            onPress={onCancel}
          />
          <Modal
            animationType={'slide'}
            transparent={true}
            statusBarTranslucent={true}>
            <View style={styles.container}>
              <View style={styles.header}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={onCancel}
                  style={{
                    position: 'absolute',
                    zIndex: 999,
                    left: 20,
                  }}>
                  <SvgIcon
                    name="down1"
                    size={22}
                    style={{
                      width: pt(10),
                      height: pt(16),
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.title}>选择提醒的人</Text>
              </View>
              <SearchInput
                style={{
                  margin: pt(10),
                  marginTop: pt(20),
                  marginBottom: pt(20),
                }}
                value={keyword}
                onChange={handleSearchTextChange}
                // onChange={val => {

                //   // if (val == '') {
                //   //   setData(copyVal);
                //   //   return;
                //   // }
                //   // const arr = copyVal.filter((item: any) => {
                //   //   return item.nick_name.includes(val);
                //   // });
                //   // setData(arr);
                // }}
                placeholder="请搜索"
              />
              {initVal.length > 0 && initVal[0].user_id == 'all' ? (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setAtUser(initVal[0]);
                  }}
                  row
                  style={{
                    alignItems: 'center',
                    borderBottomColor: '#e5e5e5',
                    borderBottomWidth: pt(1),
                    marginBottom: pt(12),
                    paddingBottom: pt(8),
                    paddingTop: pt(8),
                    width: '100%',
                  }}>
                  <Avatar
                    {...{
                      name: initVal[0].nick_name,
                      size: pt(38),
                      source: initVal[0].face_url
                        ? {uri: formatUrl(initVal[0].face_url)}
                        : Assets.imgs.avatar.defalut,
                      containerStyle: {
                        marginLeft: pt(10),
                        marginRight: pt(10),
                      },
                    }}
                  />
                  <Text>{initVal[0].nick_name}</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              <View></View>
              <Text
                style={{
                  textAlign: 'left',
                  width: '100%',
                  fontSize: pt(14),
                  marginLeft: pt(20),
                  marginBottom: pt(10),
                }}>
                全部成员
              </Text>
              {initVal.length > 0 ? (
                <VirtualizedList
                  style={{
                    width: '100%',
                  }}
                  data={initVal}
                  keyExtractor={(item, index) => index.toString()}
                  onEndReached={onLoadMore}
                  ListFooterComponent={
                    <LoadFooter loading={loading} isEnd={isEnd}></LoadFooter>
                  }
                  renderItem={items => {
                    return renderItem(items);
                  }}></VirtualizedList>
              ) : null}
            </View>
          </Modal>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  showMain: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    marginTop: pt(20),
    width: '100%',
  },
  title: {
    fontSize: pt(16),
    textAlign: 'center',
  },
  outSideView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.4)',
    height: Dimensions.get('window').height,
    zIndex: 999,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: pt(-20),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 30,
    overflow: 'hidden',
    height: Dimensions.get('window').height * 0.88,
  },
  openButton: {
    width: '100%',
    height: pt(60),
    lineHeight: pt(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textItem: {
    paddingTop: pt(14),
    paddingBottom: pt(14),
    width: '100%',
  },
  buttonTitle: {
    fontSize: pt(16),
    color: '#000000',

    textAlign: 'center',
  },
  tips: {
    fontSize: pt(12),
    color: '#666666',
    textAlign: 'center',
  },
});
