import {
  ScrollView,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
  Easing,
  Keyboard,
  Platform,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Colors,
  Icon,
  Image,
  LoaderScreen,
  Text,
  TextField,
  TextFieldRef,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Cover from './block/cover';
import InfoList from './block/infoList';
import {pt} from '@/utils/dimension';
import {ImagePickerUpload} from '@/components/ImagePickUpload';
import {getMomentsMessage, addComments} from '@/api/circleFriends';
import _ from 'lodash';
import {useSelector, shallowEqual} from 'react-redux';
import {RootState} from '@/store';
import {FullUserItem} from '@/store/types/user';
import Emoji from './block/emoji';
import Publish from './publish';
import {useTranslation} from 'react-i18next';
import LoadFooter from '@/components/loadFooter';
import {SvgIcon} from '@/components';
import {useDispatch} from 'react-redux';
import {setPushImgList} from '@/store/actions/circle';
import Comment from './block/comment';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RemindList from './block/remindList';

// 指定到定位哪个位置开始渐变
let v = 0;

export default function Index(props: any) {
  const {navigation, route} = props;
  // const dispatch = useDispatch()
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {height} = Dimensions.get('window');
  const userInfo = useSelector<RootState, FullUserItem>(
    state => state.user.selfInfo,
    shallowEqual,
  );
  const [loading, setLoading] = useState(false);
  const [opacity, changeOpacity] = useState(0);
  const [isShow, changeShow] = useState(false);
  const [list, setList] = useState([{type: 'cover'}, {type: 'remind'}]);
  const [refreshing, setRefreshing] = useState(false);
  // const inputEl = useRef<TextFieldRef | null>(null)
  // const infoRef = useRef<any>(null)
  // const [isRefresh, changeisRefresh] = useState(false)

  const [isEnd, changeEndStatus] = useState(false);

  const [showComment, changeComment] = useState({
    falg: false,
    moments_id: '',
    reply_to_id: '',
    reply_to_name: '',
  });

  // const [isShowEmoji, changeShowEmoji] = useState(false)
  const [showPublish, changeShowPublish] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const h = Dimensions.get('screen').height;
  //动画
  const [publishTop] = useState(new Animated.Value(h));
  useEffect(() => {
    Animated.timing(publishTop, {
      duration: 500,
      toValue: showPublish ? 0 : new Animated.Value(h),
      useNativeDriver: false,
    }).start();
  }, [showPublish]);

  //

  const getList = () => {
    if (loading) return;
    setLoading(true);
    getMomentsMessage({
      operation_id: Date.now().toString(),
      page: pagination?.current || 1,
      page_size: pagination?.pageSize || 10,
    })
      .then((res: any) => {
        setLoading(false);
        let newList: any =
          _.map(res.list, item => {
            const {MomentsInfo, Likes} = item;
            if (MomentsInfo.video_img) {
              item.video = {
                url: MomentsInfo.image,
                thumb: MomentsInfo.video_img,
              };
            } else {
              item.images =
                (MomentsInfo.image && MomentsInfo.image.split(';')) || [];
            }
            item.liked = _.some(
              Likes,
              likeItem => likeItem.User.user_id === userInfo.user_id,
            );
            return item;
          }) || [];

        if (pagination.current === 1) {
          newList = [{type: 'cover'}, {type: 'remind'}].concat(newList);
        } else {
          newList = list.concat(newList);
        }

        if (res.count + 1 <= newList.length) {
          changeEndStatus(true);
        }

        setList(newList);
      })
      .catch(err => {
        console.log(err, 'erer');
        changeEndStatus(true);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };
  useEffect(() => {
    getList();
  }, [pagination.current, refreshing]);

  const onRefresh = () => {
    setRefreshing(true);
    setList([{type: 'cover'}]);
    changeEndStatus(false);
    resetPage(1);
  };

  useEffect(() => {
    if (route.params?.refresh) {
      onRefresh();
    }
  }, [route.params]);

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

  //上传图片显示发布页面
  const uploadImg = (imgs: any) => {
    // getImgLists(imgs);
    if (imgs.length <= 0) {
      Alert.alert('图片上传失败，请重试');
      return;
    }

    navigation.navigate({name: 'publishFriends', params: {imgList: imgs}});
  };

  //点击评论
  const clickComment = (falg: boolean, itemData: any, replyData: any) => {
    changeComment({
      falg,
      moments_id: itemData.moments_id,
      reply_to_id: replyData?.User?.user_id || void 0,
      reply_to_name: replyData?.User?.nick_name || void 0,
    });
  };
  //取消评论
  const resetComment = () => {
    changeComment({
      falg: false,
      moments_id: '',
      reply_to_id: '',
      reply_to_name: '',
    });
  };

  //提交评论
  const commitComment = (res: any) => {
    //重置评论数据
    changeComment({
      falg: false,
      moments_id: '',
      reply_to_id: '',
      reply_to_name: '',
    });

    const newList = list.map((item: any) => {
      if (item.moments_id === showComment.moments_id) {
        const obj = {
          content: res.content,
          moments_id: res.MomentsID,
          reply_user: {
            nick_name: showComment.reply_to_name || '',
            user_id: res.reply_to_id || '',
          },
          User: {
            nick_name: userInfo.nick_name || '',
            user_id: res.user_id || '',
          },
        };
        item.Comments.push(obj);
      }
      return item;
    });
    setList(newList);
  };
  const resetPage = (num: number) => {
    setPagination({
      current: num,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
  };

  const handleLoadMore = () => {
    if (!loading && !isEnd) {
      // 避免在上一个请求完成前重复请求
      resetPage(pagination.current + 1);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
      }}>
      <View flex>
        <View
          flex
          style={{
            height: '100%',
          }}>
          <FlatList
            style={{
              backgroundColor: '#fff',
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onScroll={scrollChange}
            data={list}
            onEndReached={handleLoadMore}
            keyExtractor={(item, index) => String(index)}
            ListFooterComponent={
              <LoadFooter loading={loading} isEnd={isEnd}></LoadFooter>
            }
            renderItem={items => {
              if (items.item.type && items.item.type === 'cover') {
                return <Cover type="own"></Cover>;
              }
              if (items.item.type && items.item.type === 'remind') {
                return <RemindList></RemindList>;
              }
              return (
                <InfoList
                  hanleChangeComment={clickComment}
                  data={items.item}
                  userInfo={userInfo}></InfoList>
              );
            }}></FlatList>
        </View>
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
              position: 'absolute',
              top: 0,
              width: '100%',
              paddingTop: height * 0.05,
              height: pt(88),
              backgroundColor: '#fff',
              opacity: opacity,
            }}></Animated.View>

          <View
            style={{
              position: 'absolute',
              top: pt(height * 0.05),
              left: 0,
              width: '100%',
              height: pt(44),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
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
              朋友圈
            </Animated.Text>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.rightBtn}
              onLongPress={() => {
                navigation.navigate({name: 'publishFriends'});
              }}
              onPress={() => changeShow(true)}>
              <Icon
                style={{
                  ...styles.photo,
                  opacity: Math.abs(1 - opacity),
                }}
                assetName="photograph"
                assetGroup="page.friends"
                size={pt(22)}></Icon>
              <Icon
                style={{
                  ...styles.photo,
                  opacity: opacity,
                }}
                assetName="photo_active"
                assetGroup="page.friends"
                size={pt(24)}></Icon>
            </TouchableOpacity>
          </View>
        </View>
        <ImagePickerUpload
          limit={9}
          type="photo"
          isShow={isShow}
          onCancel={() => changeShow(false)}
          onSelect={uploadImg}></ImagePickerUpload>
        {/* {
             showPublish ?
                <Animated.View style={{...styles.publishMain, top:publishTop}}>
                  <Publish imgList={imgLists} handleBack={handleBack}></Publish>
                </Animated.View>
              :null
            } */}

        {showComment.falg ? (
          <Comment
            autoFocus={showComment.falg}
            cancel={resetComment}
            id={showComment.moments_id}
            handleCallback={commitComment}
            reply_to_id={showComment.reply_to_id}
            reply_to_name={showComment.reply_to_name}></Comment>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: pt(0),
    width: '100%',
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
  rightBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // position:'absolute',
  },
  navBack: {
    paddingHorizontal: pt(16),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  photo: {
    position: 'absolute',
    top: -10,
  },
  commentMain: {
    ...StyleSheet.absoluteFillObject,
  },

  commentMark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,.02)',
  },
  publishMain: {
    backgroundColor: 'red',
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
  },

  inputMain: {
    position: 'absolute',
    bottom: pt(0),
    width: '100%',
    padding: pt(15),
    backgroundColor: Colors.white,
    elevation: 1.5,
    shadowColor: Colors.color999,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputWithKeyboard: {
    bottom: pt(300),
  },
  emoji: {
    height: pt(0),
  },
  emojiActive: {
    bottom: pt(0),
  },
});
