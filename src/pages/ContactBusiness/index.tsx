/**
 * 名片选择
 */

import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '@/components/Header';
import SearchInput from '@/components/SearchInput';
import ContactIndexList from '@/components/ContactIndexList';
import {shallowEqual, useSelector} from 'react-redux';
import {Colors} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import {formatUrl} from '@/utils/common';

export default function BusinessCard() {
  const [selecteds, set] = useState({}); //选中的人
  const {navigate} = useNavigation();
  const ContactList = useSelector(
    (state: any) => state.contacts.friendList,
    shallowEqual,
  );

  const changeSelecteds = (val: any) => {
    const selectedsArr = Object.keys(val); //选中的人的id数组
    const selectedsList = ContactList.filter((item: any) =>
      selectedsArr.includes(item.id),
    ); //选中的人的数组
    const cardInfo = selectedsList.map((item: any) => {
      return {
        ...item,
        face_url: formatUrl(item.face_url),
      };
    });
    //选中的人的数组
    navigate('Chat', {source: 'businessCard', cardInfo: cardInfo[0]});
  };
  return (
    <View
      style={{
        height: '100%',
        backgroundColor: Colors.white,
      }}>
      <Header title="" />
      <SearchInput
        placeholder="搜索"
        style={{marginLeft: pt(16), marginRight: pt(16)}}
      />
      <ContactIndexList
        selecteds={selecteds}
        onSelected={val => changeSelecteds(val)}
        source={ContactList}
      />
    </View>
  );
}
