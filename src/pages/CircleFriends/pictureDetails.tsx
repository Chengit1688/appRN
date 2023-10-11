import {
  DeviceEventEmitter,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {pt} from '@/utils/dimension';
import {Icon, View, Text, Image, TouchableOpacity} from 'react-native-ui-lib';
import Swiper from 'react-native-swiper';
import _ from 'lodash';
import Video from 'react-native-video';
import {useTranslation} from 'react-i18next';
import {useSelector, shallowEqual} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import {getMomentsMessage} from '@/api/circleFriends';
import dayjs from 'dayjs';
import {checkIsVideoType} from '@/utils/common';
type item = {
  type: string;
  uri: string;
  width?: number;
  height?: number;
  paused?: boolean;
};
// const imageList = [
//     {
//         type: 'image',
//         uri: 'https://img2.baidu.com/it/u=1361506290,4036378790&fm=253&fmt=auto&app=138&f=JPEG'
//     },
//     {
//         type: 'image',
//         uri: 'https://img2.baidu.com/it/u=2010792343,3336876016&fm=253&fmt=auto&app=138&f=JPEG'
//     },
//     {
//         type: 'image',
//         uri: 'https://img1.baidu.com/it/u=4202854243,1154414864&fm=253&fmt=auto&app=138&f=JPEG'
//     },
//     {
//         type: 'video',
//         uri: require('@/assets/ex.mp4'),
//         paused: true
//     }

// ]

// const newImgList =  _.map(imageList,((item:any) =>{
//     if(item.uri  &&  item.type==='image'){
//         Image.getSize(item.uri,(width,height)=>{
//             item.width = Dimensions.get("screen").width;
//             item.height = Dimensions.get("screen").width / width * height;
//         })
//     }
//     return item
// }))

export default function PictureDetails() {
  const {t} = useTranslation();
  const {goBack} = useNavigation();
  const [list, setList] = useState([] as any);
  const {params} = useRoute<any>();

  const imgInfo = useSelector(
    (state: any) => state.circle.imgInfo,
    shallowEqual,
  );
  //   console.log(imgInfo,'imgInfo')
  const [defaultIndex, changeIndex] = useState(0);
  const [detail, setDetailInfo] = useState<any>({});
  const [isInit, setInit] = useState(true);
  const [curId, setCurId] = useState(params.id);
  const [isLoading, setLoading] = useState(false);
  const [isEnd, setEnd] = useState(false);
  const [totalObj, setTotal] = useState({
    total: imgInfo.total,
    curTotal: imgInfo.curTotal,
  });
  const [curIndex, setCurIndex] = useState(-1);

  //初始化获取图片 从上个页面得到
  const getImgList = (arr: any = []) => {
    const newList: any = [];
    const {id} = params;

    _.forEach(arr, (item: any, index: number) => {
      if (item.imgSrc && !checkIsVideoType(item?.imgSrc)) {
        Image.getSize(item.imgSrc, (width, height) => {
          const w = Dimensions.get('screen').width;
          const h = (Dimensions.get('screen').width / width) * height;
          const obj = {
            ...item,
            width: w,
            height: h,
          };
          newList.splice(index, 0, obj);
          const newDat = list.concat(newList);
          setList(newDat);
        });
      } else {
        const obj = {
          ...item,
          paused: item.id === id ? false : true,
        };
        newList.splice(index, 0, obj);
        const newDat = list.concat(newList);
        setList(newDat);
      }
    });
  };

  const getList = (pageNum: number, pageSize: number) => {
    getMomentsMessage({
      operation_id: Date.now().toString(),
      page: pageNum || 1,
      page_size: pageSize || 20,
      is_owner: 1,
    })
      .then((res: any) => {
        let newList: any = [];
        setTotal({
          total: res.count,
          curTotal: res.list.length + totalObj.curTotal,
        });

        res.list.forEach((item: any) => {
          if (item.MomentsInfo?.image != '') {
            const imgs = item.MomentsInfo?.image.split(';');
            imgs.forEach((imgItem: any, imgIndex: number) => {
              const obj = {
                total: imgs.length,
                id: item.moments_id,
                time: dayjs(item.MomentsInfo.CreatedAt * 1000).format(
                  'YYYY年MM月DD日 HH:mm',
                ),
                curIndex: imgIndex,
                imgSrc: imgItem,
                content: item.MomentsInfo.content || '',
                likeNum: item.Likes.length || 0,
                commentNum: item.Comments.length || 0,
              };
              newList.push(obj);
            });
          }
        });
        getImgList(newList);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //改变
  const handleChange = (index: number) => {
    //倒数第几个INDEX 开始加载下一页数据
    if (totalObj.total > totalObj.curTotal) {
      if (list.length - 3 <= index && !isLoading) {
        setLoading(true);
        //开始加载
        getList(imgInfo.page_num + 1, imgInfo.page_size);
      }
    }
    setCurIndex(index);
  };

  //视频播放与暂停
  useEffect(() => {
    if (curIndex > -1) {
      if (curId !== list[curIndex].id) {
        setCurId(list[curIndex].id);
        const newList = _.map(list, (item, _i: number) => {
          if (checkIsVideoType(item?.imgSrc)) {
            if (_i === curIndex) {
              item.paused = false;
            } else {
              item.paused = true;
            }
          }
          return item;
        });
        setList(newList);
      }
      setDetailInfo(list[curIndex]);
    }
  }, [curIndex]);

  useEffect(() => {
    getImgList(imgInfo.list);
  }, []);

  useEffect(() => {
    const {id} = params;
    _.forEach(list, (item, index: number) => {
      if (item.id === id && isInit) {
        setInit(false);
        changeIndex(index);
        setDetailInfo(item);
      }
    });
  }, [list]);
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        height: '100%',
        position: 'relative',
      }}>
      <StatusBar barStyle={'light-content'}></StatusBar>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: pt(44),
          padding: pt(10),
          paddingTop: pt(0),
          paddingBottom: pt(0),
        }}>
        <TouchableOpacity activeOpacity={1} onPress={goBack}>
          <Text style={{color: '#fff'}}>{t('返回')}</Text>
        </TouchableOpacity>
        <Text
          style={{
            color: '#fff',
            flex: 1,
            textAlign: 'center',
            fontSize: pt(18),
            fontWeight: 'bold',
          }}>
          {detail.time}
        </Text>
        <Text style={{color: '#fff', fontSize: pt(15), fontWeight: '500'}}>
          {detail.curIndex + 1}/{detail.total}
        </Text>
      </View>

      {/**图片区域 */}
      <Swiper
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
        }}
        showsPagination={false}
        loop={false}
        index={defaultIndex}
        onIndexChanged={index => {
          handleChange(index);
        }}>
        {_.map(list, (item: any, index: number) => {
          const marginTop = item.height ? -(item.height / 2) : 0;
          if (checkIsVideoType(item?.imgSrc)) {
            return (
              <Video
                paused={item.paused}
                key={index}
                style={styles.backgroundVideo}
                source={{uri: item.imgSrc}}></Video>
            );
          } else {
            return (
              <Image
                resizeMode={'contain'}
                key={index}
                style={{
                  width: item.width,
                  height: item.height,
                  position: 'absolute',
                  top: '50%',
                  marginTop: marginTop,
                }}
                source={{uri: item.imgSrc}}></Image>
            );
          }
        })}
      </Swiper>
      {/* <ImageViewer renderHeader={renderHeader} renderFooter={renderFooter}	 imageUrls={images} /> */}

      <View
        style={{
          position: 'absolute',
          bottom: pt(30),
          margin: pt(15),
          width: '100%',

          left: 0,
        }}>
        <Text
          numberOfLines={2}
          style={{fontSize: pt(14), color: '#fff', lineHeight: pt(18)}}>
          {detail.content}
        </Text>
        <View row style={{marginTop: pt(20), marginRight: pt(20)}}>
          <View row style={{flex: 1}}>
            <View row>
              <Icon assetName="stand" assetGroup="page.friends" size={pt(16)} />
              <Text
                style={{marginLeft: pt(10), color: '#fff', fontWeight: '500'}}>
                {detail.likeNum > 0 ? detail.likeNum : t('点赞')}
              </Text>
            </View>
            <View row style={{marginLeft: pt(20)}}>
              <Icon assetName="msg" assetGroup="page.friends" size={pt(16)} />
              <Text
                style={{marginLeft: pt(10), color: '#fff', fontWeight: '500'}}>
                {detail.commentNum > 0 ? detail.commentNum : t('评论')}
              </Text>
            </View>
          </View>
          <View row center>
            <Text
              style={{marginLeft: pt(10), color: '#fff', fontWeight: '500'}}>
              {t('详情')}
            </Text>
            <Icon
              assetName="link_next"
              assetGroup="page.friends"
              size={pt(11)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
