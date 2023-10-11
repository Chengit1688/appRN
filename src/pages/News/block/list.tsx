import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {pt} from '@/utils/dimension';
import {View, Text, Image, Icon} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {getNewList} from '@/api/news';
import _ from 'lodash';
import Video from 'react-native-video';
import dayjs from 'dayjs';

// const data = [
//   {
//      title:'利物浦名宿为拉莫斯鸣不平: 他不是故意伤萨拉赫的asdadada',
//      source:'环球网',
//      time:'16:28',
//      isTop:true,
//      imgList:[]
//   },
//   {
//     title:'皇马新球衣宣传照C罗意外缺席合集 球衣照被号码 代替了sasdaasd',
//     source:'环球网',
//     time:'13:28',
//     isTop:false,
//     imgList:[
//       "https://n.sinaimg.cn/spider20220529/514/w1301h813/20220529/d958-90383fdafd437411207585b2b155152b.png",
//       "https://p6.itc.cn/images01/20211211/ab8e06a7032144f2a043e7e76e6a3a68.jpeg",
//       "https://img1.dongqiudi.com/fastdfs/M00/09/84/oYYBAFgRxIyAbRWVAAUfkKipPwA54.jpeg"
//     ]
//  },
//  {
//   title:'阿根廷vs巴西前瞻: 梅西缺席内 马尔里程碑aaaaaaa',
//   source:'环球网',
//   time:'05-06',
//   isTop:false,
//   imgList:[
//     "https://n.sinaimg.cn/spider20220529/514/w1301h813/20220529/d958-90383fdafd437411207585b2b155152b.png",
//     ]
//   },
//   {
//     title:'人类幼崽的迷惑行为合集',
//     source:'新浪微博',
//     time:'05-06',
//     isTop:false,
//     type:'video',
//     url: require('@/assets/ex.mp4'),
//   },
// ]

export default function List(props: any) {
  const {navigate} = useNavigation();
  const {t} = useTranslation();

  const {item, i} = props;
  const time = dayjs(item.created_at * 1000).format('MM月DD日');

  const images = useMemo(() => {
    let arr = [];
    if (item.image) {
      arr = item.image.filter((image: string) => image.length > 0);
    }
    return arr;
  }, [item.image]);

  //播放视频
  const playVideo = (index: number) => {};
  //
  const gotoDetail = () => {
    if (item.video && item.video != '') return;
    navigate({
      name: 'newsDetail',
      params: {
        id: item.id,
      },
    } as never);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        gotoDetail();
      }}
      style={{marginBottom: pt(20)}}>
      <View row>
        <View style={{flex: 1}}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          {images.length > 1 && !item.video ? (
            <View
              row
              style={{marginBottom: pt(20), justifyContent: 'space-between'}}>
              {_.map(images, (img, index) => (
                <Image
                  key={index}
                  source={{uri: img}}
                  style={{flex: 1, height: pt(70), marginRight: pt(5)}}></Image>
              ))}
            </View>
          ) : null}

          {item.video && item.video != '' ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => playVideo(i)}
              style={styles.videoMain}>
              <Video
                resizeMode={'cover'}
                paused={true}
                style={styles.backgroundVideo}
                source={{uri: item.video}}></Video>
              <Icon
                style={styles.play}
                assetName="play"
                assetGroup="page.news"
                size={pt(30)}></Icon>
            </TouchableOpacity>
          ) : null}
          <View row>
            {/* <Text style={styles.top}>{t("置顶")}</Text> */}
            {/* <Text style={styles.source}>{t("来自")}{item.source}</Text> */}
            <Text style={styles.source}>{time}</Text>
          </View>
        </View>
        {images.length === 1 && !item.video ? (
          <Image
            source={{uri: images[0]}}
            style={{width: pt(110), height: pt(70)}}></Image>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#5B5B5B',
    fontSize: pt(15),
    fontWeight: '500',
    lineHeight: pt(22),
    marginBottom: pt(10),
  },
  top: {
    borderColor: '#FB473B',
    borderWidth: pt(0.5),
    fontSize: pt(10),
    textAlign: 'center',
    color: '#FB483C',
    width: pt(32),
    height: pt(16),
    lineHeight: pt(16),
    marginRight: pt(10),
  },
  source: {
    color: '#AAAAAA',
    marginRight: pt(10),
    fontSize: pt(12),
  },
  backgroundVideo: {
    height: pt(150),
    flex: 1,
    backgroundColor: '#dfdfdf',
    marginBottom: pt(20),
  },
  videoMain: {
    position: 'relative',
    flex: 1,
  },
  play: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: pt(-14),
    marginTop: pt(-20),
  },
});
