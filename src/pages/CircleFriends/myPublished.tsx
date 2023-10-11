import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import Cover from './block/cover';
import InfoList from './block/infoList';
import {Colors} from 'react-native-ui-lib';

const item = {
  avatar:
    'https://static.pexels.com/photos/60628/flower-garden-blue-sky-hokkaido-japan-60628.jpeg',
  nickName: 'Alex Xia',
  txt: '最近去了趟老丈人家',
  imgList: [
    'https://img0.baidu.com/it/u=3437335985,2884876169&fm=253&fmt=auto&app=138&f=JPEG',
    'https://www.ssfiction.com/wp-content/uploads/2020/08/20200805_5f2a345b921f3.jpg',
  ],
  time: '2小时前',
  address: '信阳·汇盈大厦16号楼',
  mentioneNames: 'Auneo Marinir Space',
};

export default function MyPublished() {
  return (
    <ScrollView
      style={{
        backgroundColor: Colors.white,
      }}>
      <Cover></Cover>
      <InfoList item={item} isMyPush={true}></InfoList>
    </ScrollView>
  );
}
