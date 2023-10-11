import {
  Animated,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Colors,
  Icon,
  Image,
  LoaderScreen,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import FastImage from 'react-native-fast-image';
import Cover from './block/cover';
import dayjs from 'dayjs';
import _ from 'lodash';
import {pt} from '@/utils/dimension';
import {getMomentsMessage} from '@/api/circleFriends';
import {useDispatch, useSelector} from 'react-redux';
import {setImageText} from '@/store/actions/circle';
import {checkIsVideoType} from '@/utils/common';
import {useTranslation} from 'react-i18next';
import Video from 'react-native-video';
import LoadFooter from '@/components/loadFooter';
import {SvgIcon} from '@/components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {shallowEqual} from 'react-redux';

const renderVideo = (video: any, navigation: any, id: number) => {
  return (
    <TouchableOpacity
      style={styles.videoMain}
      activeOpacity={1}
      onPress={() => {
        navigation.navigate({name: 'pictureDetails', params: {id}});
      }}>
      {/* <Video
      paused={true}
      resizeMode={'cover'}
      style={{width: pt(80), height: pt(80)}}
      source={{uri: imgs[0]}}></Video> */}

      <Image
        style={{width: pt(80), height: pt(80)}}
        source={{uri: video.thumb}}></Image>
      <Icon
        style={styles.play}
        assetName="play"
        assetGroup="page.news"
        size={pt(20)}></Icon>
    </TouchableOpacity>
  );
};

const renderImg = (imgs: object[], navigation: any, id: number) => {
  // if (imgs.length === 1 && checkIsVideoType(imgs[0])) {
  //   return (
  //     <TouchableOpacity
  //       style={styles.videoMain}
  //       activeOpacity={1}
  //       onPress={() => {
  //         navigation.navigate({name: 'pictureDetails', params: {id}});
  //       }}>
  //       {/* <Video
  //         paused={true}
  //         resizeMode={'cover'}
  //         style={{width: pt(80), height: pt(80)}}
  //         source={{uri: imgs[0]}}></Video> */}

  //       <Image source
  //       <Icon
  //         style={styles.play}
  //         assetName="play"
  //         assetGroup="page.news"
  //         size={pt(20)}></Icon>
  //     </TouchableOpacity>
  //   );
  // }
  return (
    <View>
      {imgs.length === 1 ? (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation.navigate({name: 'pictureDetails', params: {id}});
          }}>
          <Image
            resizeMode={'cover'}
            style={{width: pt(80), height: pt(80)}}
            source={{uri: imgs[0]}}></Image>
        </TouchableOpacity>
      ) : imgs.length === 2 ? (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.flexRow}
          onPress={() => {
            navigation.navigate({name: 'pictureDetails', params: {id}});
          }}>
          <Image
            style={{width: pt(40), height: pt(80), marginRight: pt(2)}}
            source={{uri: imgs[0]}}></Image>
          <Image
            style={{width: pt(40), height: pt(80)}}
            source={{uri: imgs[1]}}></Image>
        </TouchableOpacity>
      ) : imgs.length === 3 ? (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.flexRow}
          onPress={() => {
            navigation.navigate({name: 'pictureDetails', params: {id}});
          }}>
          <Image
            style={{width: pt(40), height: pt(82), marginRight: pt(2)}}
            source={{uri: imgs[0]}}></Image>
          <View>
            <Image
              style={{width: pt(40), height: pt(40), marginBottom: pt(2)}}
              source={{uri: imgs[1]}}></Image>
            <Image
              style={{width: pt(40), height: pt(40)}}
              source={{uri: imgs[2]}}></Image>
          </View>
        </TouchableOpacity>
      ) : imgs.length >= 4 ? (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: pt(82),
          }}
          onPress={() => {
            navigation.navigate({name: 'pictureDetails', params: {id}});
          }}>
          <Image
            style={{width: pt(40), height: pt(40), marginBottom: pt(2)}}
            source={{uri: imgs[0]}}></Image>
          <Image
            style={{width: pt(40), height: pt(40), marginLeft: pt(2)}}
            source={{uri: imgs[1]}}></Image>
          <Image
            style={{width: pt(40), height: pt(40)}}
            source={{uri: imgs[2]}}></Image>
          <Image
            style={{width: pt(40), height: pt(40), marginLeft: pt(2)}}
            source={{uri: imgs[3]}}></Image>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

// 指定到定位哪个位置开始渐变
let v = 0;
export default function UserIndex(props: any) {
  const {navigation, route} = props;
  const {params} = route;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation();
  const {height} = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const mergeObj: any = {};
  const [list, setList] = useState([{type: 'cover'}]);
  const [opacity, changeOpacity] = useState(0);
  const [curTotal, setCurTotal] = useState(0);
  const selfInfo = useSelector(
    (state: any) => state.user.selfInfo,
    shallowEqual,
  );

  const [imgTextList, setTextList] = useState<any>();

  const [isEnd, changeEndStatus] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (params?.refresh && params?.id) {
      let filteredArray: any = [];
      list.forEach((subArray: any) => {
        if (subArray.type === 'cover') {
          filteredArray.push(subArray);
          return;
        }
        if (subArray.list) {
          const newlist = subArray.list.filter(
            (obj: any) => obj.moments_id !== params?.id,
          );

          subArray.list = newlist;
        }
        if (subArray.list.length > 0) {
          filteredArray.push(subArray);
        }
      });
      setList(filteredArray);
    }
  }, [params?.refresh]);

  const getList = () => {
    if (loading) return;
    setLoading(true);
    getMomentsMessage({
      operation_id: Date.now().toString(),
      page: pagination?.current || 1,
      page_size: pagination?.pageSize || 10,
      is_owner: selfInfo.user_id === params?.userInfo?.user_id ? 3 : 1,
      user_id: params?.userInfo?.user_id || '',
    })
      .then((res: any) => {
        setLoading(false);

        let formatList: any = _.map(res.list, item => {
          const {MomentsInfo, Likes} = item;
          item.images =
            (MomentsInfo.image && MomentsInfo.image.split(';')) || [];
          const date = dayjs(parseInt(MomentsInfo.CreatedAt) * 1000).format(
            'YYYY-MM-DD',
          );
          if (MomentsInfo.video_img) {
            item.video = {
              url: MomentsInfo.image,
              thumb: MomentsInfo.video_img,
            };
          }
          if (!mergeObj[`key_${date}`]) {
            mergeObj[`key_${date}`] = [{...item}];
          } else {
            mergeObj[`key_${date}`].push(item);
          }
          return item;
        });
        let newArr: any = Object.keys(mergeObj).map(date => ({
          time: date.split('_')[1],
          address: mergeObj[date][0]?.MomentsInfo?.location || '',
          list: mergeObj[date],
        }));
        if (pagination.current === 1) {
          formatList = [{type: 'cover'}].concat(newArr);
        } else {
          formatList = list.concat(newArr);
        }

        const curTotalNum = curTotal + (res.list?.length || 0);
        setCurTotal(curTotalNum);
        if (res.count <= curTotalNum) {
          changeEndStatus(true);
        }

        // setPagination({
        //     total: res.count || 0,
        //     pageSize: pagination.pageSize,
        //     current: pagination.current + 1,
        // })
        // console.log(formatList,'formatList')
        // dispatch(setImageText())
        setList(formatList);
      })
      .catch(err => {
        console.log(err, 'erer');
        changeEndStatus(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getList();
  }, [pagination.current]);

  // 图文详情数据格式化
  useEffect(() => {
    dispatch(setImageText({}));
    let pictureList: any = [];
    list.forEach((item: any, index: number) => {
      if (item.list && item.list.length > 0) {
        item.list.forEach((imgs: any, imgIndex: number) => {
          if (imgs.images?.length > 0) {
            imgs.images.forEach((imgItem: any, imgI: number) => {
              const obj = {
                total: imgs.images.length,
                id: imgs.moments_id,
                time: dayjs(imgs.MomentsInfo.CreatedAt * 1000).format(
                  'YYYY年MM月DD日 HH:mm',
                ),
                curIndex: imgI,
                imgSrc: imgItem,
                content: imgs.MomentsInfo.content || '',
                likeNum: imgs.Likes.length || 0,
                commentNum: imgs.Comments.length || 0,
              };
              pictureList.push(obj);
            });
          }
        });
      }
    });
    const imgInfo = {
      total: pagination.total,
      curTotal: curTotal,
      page_num: pagination.current,
      page_size: pagination.pageSize,
      list: pictureList,
    };
    // setTextList(imgInfo)
    // DeviceEventEmitter.emit('changeImgText', imgInfo)
    dispatch(setImageText(imgInfo));
  }, [list]);

  const RenderItem = (props: any) => {
    const {data} = props;
    const cur = dayjs(new Date()).isSame(dayjs(data?.time));
    const m = dayjs(data?.time).get('month') + 1;
    const d = dayjs(data?.time).get('date');
    return (
      <View style={[styles.flexRow, styles.main]}>
        <View style={styles.date}>
          {cur ? (
            <Text text60>今天</Text>
          ) : (
            <View style={[styles.flexRow]}>
              <Text text60>{d}</Text>
              <Text text100>{m}月</Text>
            </View>
          )}
          <Text style={styles.address} numberOfLines={2}>
            {data?.address}
          </Text>
        </View>

        <View style={{flex: 1}}>
          {_.map(data?.list, (item: any, index) => (
            <View style={{marginBottom: pt(10)}} key={index}>
              <View style={[styles.flexRow]}>
                {item.images.length > 0 ? (
                  <View style={styles.images}>
                    {item.video
                      ? renderVideo(item.video, navigation, item.moments_id)
                      : renderImg(item.images, navigation, item.moments_id)}
                    {item.icon ? (
                      <Icon
                        style={styles.icon}
                        assetName="see"
                        assetGroup="page.friends"
                        size={pt(10)}
                      />
                    ) : null}
                  </View>
                ) : null}

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    navigation.navigate({
                      name: 'circleDetail',
                      params: {id: item.moments_id, userInfo: params.userInfo},
                    });
                  }}
                  style={styles.textContent}>
                  <Text style={styles.txt} numberOfLines={3}>
                    {item.MomentsInfo.content}
                  </Text>
                  {item.images.length > 1 ? (
                    <Text style={styles.totalNums}>
                      共{item.images.length}张
                    </Text>
                  ) : null}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const handleLoadMore = () => {
    if (!loading && !isEnd) {
      setPagination({
        ...pagination,
        current: pagination.current + 1,
      });
    }
  };
  //滚动事件监听
  const scrollChange = (event: any) => {
    event.persist();
    const {y} = event.nativeEvent.contentOffset;
    const top = insets.top;
    if (y > 200 - top) {
      v = v >= 1 ? 1 : v + 0.2;
    } else if (y <= 200 - top) {
      v = v <= 0 ? 0 : v - 0.2;
    }
    changeOpacity(v);
  };
  return (
    <View>
      <FlatList
        removeClippedSubviews={false}
        style={{
          backgroundColor: '#fff',
          minHeight: '100%',
        }}
        data={list}
        onScroll={scrollChange}
        onEndReached={handleLoadMore}
        keyExtractor={(item, index) => String(index)}
        ListFooterComponent={
          <LoadFooter loading={loading} isEnd={isEnd}></LoadFooter>
        }
        renderItem={items => {
          if (items.item?.type && items.item?.type === 'cover') {
            return <Cover type="friend" user={params?.userInfo}></Cover>;
          }
          return <RenderItem data={items.item}></RenderItem>;
        }}></FlatList>
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          paddingTop: height * 0.05,
          height: pt(44),
        }}>
        <Animated.View
          style={{
            ...styles.navBarBg,
            paddingTop: height * 0.05,
            opacity: opacity,
          }}></Animated.View>
        <View style={{...styles.navWarp, top: pt(height * 0.05)}}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.navBack}
            onPress={() => {
              navigation.goBack();
            }}>
            <SvgIcon
              name="navBack"
              size={22}
              style={{
                width: pt(10),
                height: pt(16),
              }}
            />
          </TouchableOpacity>
          <Animated.Text style={{...styles.title, opacity: opacity}}>
            {t('相册')}
          </Animated.Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    margin: pt(16),
  },
  flexRow: {
    flexDirection: 'row',
  },
  date: {
    flexDirection: 'column',
    width: pt(60),
    marginRight: pt(10),
  },
  textContent: {
    flex: 1,

    position: 'relative',
  },
  txt: {
    lineHeight: pt(22),
    color: '#5B5B5B',
    fontSize: pt(12),
  },
  address: {
    marginTop: pt(5),
    fontSize: pt(11),
    lineHeight: pt(18),
    color: '#333',
  },
  totalNums: {
    fontSize: pt(11),
    color: '#999999',
    position: 'absolute',
    bottom: 0,
  },
  images: {
    position: 'relative',
    width: pt(80),
    height: pt(80),
    marginRight: pt(10),
  },
  icon: {
    position: 'absolute',
    right: pt(5),
    bottom: pt(5),
  },
  tips: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: pt(60),
    height: pt(0.5),
    backgroundColor: '#d9d9d9',
  },
  tipsTxt: {
    color: '#999999',
    fontSize: pt(11),
    marginLeft: pt(10),
    marginRight: pt(10),
  },
  videoMain: {
    position: 'relative',
    flex: 1,
    width: pt(150),
    height: pt(100),
  },
  play: {
    position: 'absolute',
    left: pt(30),
    top: pt(35),
  },
  title: {
    // position:'absolute',
    // width:'100%',
    // left:0,
    flex: 3,
    textAlign: 'center',
    color: '#000',
    fontSize: pt(18),
  },
  navBack: {
    paddingHorizontal: pt(16),
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  navBarBg: {
    position: 'absolute',
    top: 0,
    width: '100%',

    height: pt(88),
    backgroundColor: '#fff',
  },
  navWarp: {
    position: 'absolute',

    left: 0,
    width: '100%',
    height: pt(44),
    flexDirection: 'row',
    alignItems: 'center',
  },
});
