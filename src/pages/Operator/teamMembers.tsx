import {View, Text, StatusBar, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import ContactIndexList from '@/components/ContactIndexList';
import SearchInput from '@/components/SearchInput';
import {teamMembersList} from '@/api/operator';
import {useRoute} from '@react-navigation/native';
import {pt} from '@/utils/dimension';
import {shallowEqual, useSelector} from 'react-redux';
import {formatUrl} from '@/utils/common';
import FastImage from 'react-native-fast-image';
import {Assets, Colors, TouchableOpacity} from 'react-native-ui-lib';
import LoadFooter from '@/components/loadFooter';

// const data = [
//   {
//       "id":"111",
//       "user_id": "3909878003",
//       "account": "Gb5kueinzw",
//       "remark":'11',
//       "phone_number": "",
//       "signatures":"111",

//       "black_status":1,
//       "create_time":123123,
//       "friend_status":2,
//       "face_url": "",
//       "gender": 1,
//       "nick_name": "Gb5kueinzw",
//       "age": 18
//   },

// ]

export default function TeamMembers({navigation}: any) {
  const [list, setList] = useState<any>([]);
  const {params} = useRoute<any>();
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState<any>(false);
  const [isEnd, setEndStatus] = useState<any>(false);
  const ContactList = useSelector(
    (state: any) => state.contacts.friendList,
    shallowEqual,
  );

  const [pagination, setPagination] = useState<any>({
    page: 1,
    pageSize: 30,
    total: 0,
  }); //分页

  useEffect(() => {
    getMemberList();
  }, [pagination, key]);

  const getMemberList = () => {
    setLoading(true);
    teamMembersList({
      operation_id: new Date().getTime().toString(),
      key,
      shop_id: params.shop_id,
      page: 1,
      pageSize: 50,
    })
      .then((res: any) => {
        const newList = res.list.map((item: any) => {
          item.nick_name = item.account || '';
          return item;
        });
        const newArr = [...list, ...newList];
        if (newArr.length >= res.count) {
          setEndStatus(true);
        }

        setList(newArr);
      })
      .finally(() => {
        setLoading(false);
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
  const handleSearchTextChange = (val: any) => {
    setList([]);
    setEndStatus(false);
    setKey(val);
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  const renderItem = (item: any) => {
    const avatar = item.face_url
      ? {uri: formatUrl(item.face_url), cache: FastImage.cacheControl.web}
      : Assets.imgs.avatar.defalut;

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          navigation.navigate({
            name: 'ContactInfo',
            params: {
              info: {
                user_id: item.user_id,
              },
            },
          });
        }}
        row
        style={{
          alignItems: 'center',
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
        <Text>{item.nick_name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        margin: pt(16),
        marginTop: pt(8),
        height: '100%',
      }}>
      <StatusBar barStyle={'dark-content'}></StatusBar>
      <SearchInput
        onChange={handleSearchTextChange}
        placeholder="搜索"></SearchInput>
      <FlatList
        data={list}
        style={{
          marginTop: pt(10),
        }}
        onEndReached={onLoadMore}
        ListFooterComponent={
          <LoadFooter loading={loading} isEnd={isEnd}></LoadFooter>
        }
        renderItem={({item}) => {
          return renderItem(item);
        }}
        keyExtractor={(item: any) => item.user_id}
      />

      {/* <ContactIndexList
        onPress={id => {
          navigation.navigate({
            name: 'ContactInfo',
            params: {
              info: {
                user_id: id,
              },
            },
          });
        }}
        source={list}></ContactIndexList> */}
    </View>
  );
}
