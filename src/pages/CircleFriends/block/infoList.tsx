import {pt} from '@/utils/dimension';
import _ from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal as ModalFull,
  ActivityIndicator,
} from 'react-native';
import {Modal} from '@ant-design/react-native';
import {
  Avatar,
  Colors,
  Icon,
  Image,
  ListItem,
  Text,
  View,
} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {formatTime} from '@/utils/common';
import ImageViewer from 'react-native-image-zoom-viewer';
import {likeMoments, delMomentsMessage} from '@/api/circleFriends';
import {useNavigation} from '@react-navigation/native';
import {checkIsVideoType} from '@/utils/common';
import Video from 'react-native-video';
import Swiper from 'react-native-swiper';
import VideoModal from '@/pages/Chat/block/chatItem/videoModal';

type imgItem = {
  url: string;
};

export default function InfoList(props: any) {
  const {t} = useTranslation();
  const {goBack, navigate} = useNavigation();
  const startingWidth = pt(0);
  const {data, isDetail, hanleChangeComment, userInfo} = props;
  const [itemData, changeItemData] = useState<any>({});
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);
  const [fullWidth] = useState(pt(121));
  const [imgViewVisible, changeImgViewVisible] = useState(false);
  const [imgViewList, changeImgViewList] = useState<imgItem[]>([]);
  const [initIndex, changeIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [videoObj, changeVideoObj] = useState({
    videView: false,
    videoSrc: '',
    videoPasue: false,
  });

  useEffect(() => {
    changeItemData(_.clone(data));
  }, [data]);

  useEffect(() => {
    Animated.spring(animatedWidth, {
      friction: 50,
      toValue: expanded ? fullWidth : startingWidth,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  //点击评论
  const commentFn = (data?: any) => {
    // if(data && data?.User?.user_id === userInfo.user_id) return;
    hanleChangeComment(true, itemData, data);
    setExpanded(false);
  };

  //点赞
  const handleLike = _.debounce(() => {
    const params = {
      operation_id: new Date().getTime().toString(),
      moments_id: itemData.moments_id,
    };
    likeMoments(params).then(res => {
      let newLikes = [];
      if (itemData.liked) {
        newLikes = itemData.Likes.filter(
          (item: any) => item.User.user_id !== userInfo.user_id,
        );
      } else {
        newLikes = itemData.Likes.concat([
          {
            User: {...userInfo},
          },
        ]);
      }

      const newData = {
        ...itemData,
        Likes: newLikes,
        liked: !itemData.liked,
      };
      changeItemData(newData);
      setExpanded(false);
    });
  });
  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleSetExpanded = () => {
    const falg = expanded ? false : true;
    setExpanded(falg);
  };
  // 图片列表
  const RenderItem = ({item, index}: any) => {
    const handleViewImg = (index: number) => {
      changeIndex(index);
      changeImgViewVisible(true);

      const images: any = _.map(itemData.images, imgItem => {
        let obj = {
          url: '',
        };
        obj.url = imgItem;
        return obj;
      });
      changeImgViewList(images);
    };
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          handleViewImg(index);
        }}>
        <Image
          style={{width: pt(82), height: pt(82), margin: pt(3)}}
          resizeMode={'cover'}
          source={{uri: item}}></Image>
      </TouchableOpacity>
    );
  };

  // 预览图片
  const ImageView = () => {
    return (
      <ModalFull visible={imgViewVisible} transparent={true}>
        <ImageViewer
          loadingRender={() => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator animating size="large" />
              </View>
            );
          }}
          saveToLocalByLongPress={false}
          index={initIndex}
          onClick={() => changeImgViewVisible(false)}
          imageUrls={imgViewList}
        />
      </ModalFull>
    );
  };
  // 预览视频
  const VideoView = () => {
    return (
      <ModalFull
        style={styles.viewModal}
        visible={videoObj.videView}
        transparent={true}>
        <TouchableOpacity
          onPress={() => {
            showViewVideo(false);
            setIsLoading(true);
          }}
          activeOpacity={1}
          style={styles.videoMask}>
          {isLoading && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                ...StyleSheet.absoluteFillObject,
                backgroundColor: '#000',
                zIndex: 999,
              }}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
          <Video
            resizeMode={'cover'}
            paused={videoObj.videoPasue}
            source={{uri: videoObj.videoSrc}}
            style={styles.modalVideo}
            onLoad={handleLoad}></Video>
        </TouchableOpacity>
      </ModalFull>
    );
  };

  //显示视频预览
  // const showViewVideo = (falg: boolean, item?: any) => {
  //   changeVideoObj({
  //     videoPasue: !falg,
  //     videoSrc: item || '',
  //     videView: falg,
  //   });
  // };

  // 详情的评论和点赞
  const renderDetailComment = (item: any) => {
    console.log('item====>', item);
    return (
      <View>
        {item.Likes?.length > 0 || item.Comments?.length > 0 ? (
          <View style={styles.comment}>
            {item.Likes?.length > 0 ? (
              <View style={styles.like}>
                <Icon
                  style={{marginTop: pt(6), marginRight: pt(3)}}
                  assetName="like"
                  assetGroup="page.friends"
                  size={pt(12)}
                />
                {_.map(item.Likes, (likeItem, index) => {
                  const avatar = likeItem.User.face_url
                    ? {uri: likeItem.User.face_url}
                    : require('@/assets/imgs/defalut_avatar.png');
                  return (
                    <View
                      key={index}
                      style={{marginLeft: pt(2), marginRight: pt(2)}}>
                      <Avatar source={avatar} size={24}></Avatar>
                    </View>
                  );
                })}
              </View>
            ) : null}
            {item.Likes?.length > 0 && item.Comments?.length > 0 ? (
              <Text style={styles.line}></Text>
            ) : null}

            {item.Comments?.length > 0 ? (
              <View row style={styles.commentMain}>
                <Icon
                  style={{marginTop: pt(5), marginRight: pt(8)}}
                  assetName="comment"
                  assetGroup="page.friends"
                  size={pt(12)}
                />
                <View style={{flex: 1}}>
                  {_.map(item.Comments, (commItem, index) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          commentFn(commItem);
                        }}
                        key={index}>
                        {commItem.reply_user.user_id ? (
                          <View style={{...styles.reply, marginBottom: pt(8)}}>
                            <View style={{...styles.flexRow, flex: 1}}>
                              <Avatar
                                source={{uri: commItem.User.face_url}}
                                size={24}
                                backgroundColor={'#ddd'}></Avatar>

                              <View style={{marginLeft: pt(5)}}>
                                <View style={styles.flexRow}>
                                  <Text style={styles.commentText}>
                                    {commItem.User.nick_name}
                                  </Text>
                                  <Text style={styles.colorLight}>
                                    回复{commItem.reply_user.nick_name}
                                  </Text>
                                </View>
                                <Text
                                  style={{
                                    ...styles.commentText,
                                    marginTop: pt(5),
                                  }}>
                                  {commItem.content}
                                </Text>
                              </View>
                            </View>
                            <Text style={styles.timeTxt}>{commItem.time}</Text>
                          </View>
                        ) : (
                          <View
                            style={{
                              ...styles.commentText,
                              ...styles.flexRow,
                              marginBottom: pt(10),
                            }}>
                            <View style={{...styles.flexRow, flex: 1}}>
                              {/* {commItem.firstName}：{commItem.txt} */}
                              <Avatar
                                source={{uri: commItem.User.face_url}}
                                size={24}
                                backgroundColor={'#ddd'}></Avatar>
                              <View style={{marginLeft: pt(5)}}>
                                <Text style={styles.comment11}>
                                  {commItem.User.nick_name}
                                </Text>
                                <Text
                                  style={{
                                    ...styles.commentText,
                                    marginTop: pt(5),
                                  }}>
                                  {commItem.content}
                                </Text>
                              </View>
                            </View>
                            <Text style={styles.timeTxt}>{commItem.time}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  };

  // 默认的评论和点赞
  const renderComment = (item: any) => {
    return (
      <View>
        {item.Likes?.length > 0 || item.Comments?.length > 0 ? (
          <View style={styles.comment}>
            {item.Likes?.length > 0 ? (
              <View style={styles.like}>
                <Icon
                  style={{marginTop: pt(7), marginRight: pt(3)}}
                  assetName="like"
                  assetGroup="page.friends"
                  size={pt(12)}
                />
                {_.map(item.Likes, (likeItem, index) => (
                  <Text key={index} style={styles.likeName}>
                    {likeItem.User.nick_name}
                  </Text>
                ))}
              </View>
            ) : null}

            {item.Likes?.length > 0 && item.Comments?.length > 0 ? (
              <Text style={styles.line}></Text>
            ) : null}

            <View style={styles.commentMain}>
              {_.map(item.Comments, (commItem, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => commentFn(commItem)}
                    key={index}>
                    {commItem.reply_user && commItem.reply_user.user_id ? (
                      <View style={{...styles.reply, marginBottom: pt(5)}}>
                        <Text style={styles.commentText}>
                          {commItem.User.nick_name}
                        </Text>
                        <Text style={styles.colorLight}>
                          回复{commItem.reply_user.nick_name}
                        </Text>
                        <Text style={styles.commentText}>
                          ：{commItem.content}
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={{...styles.commentText, marginBottom: pt(5)}}>
                        {commItem.User.nick_name}：{commItem.content}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  //删除朋友圈
  const handleDel = () => {
    Modal.alert('删除', '确定删除该条朋友圈?', [
      {
        text: '取消',
        onPress: () => {},
        style: {
          color: '#F53C3C',
        },
      },
      {
        text: '确定',
        onPress: () => {
          const params = {
            moments_id: itemData.moments_id,
            operation_id: new Date().getTime().toString(),
          };
          delMomentsMessage(params).then(res => {
            navigate('userFriendIndex', {
              refresh: true,
              id: itemData.moments_id,
              userInfo: params.userInfo,
            }); // 传递刷新标志
            // goBack();
          });
        },
        style: {
          color: '#7581FF',
        },
      },
    ]);
  };
  const renderImgs = (imgs: any) => {
    return _.map(imgs, (imgItem, index) => {
      return <RenderItem key={index} item={imgItem} index={index}></RenderItem>;
    });
  };

  const [showViewVideo, setShowViewVideo] = useState({
    videView: false,
    videoSrc: '',
    videoPasue: true,
  });

  return (
    <View style={styles.content}>
      <View style={[styles.flexRow]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigate('ContactInfo', {info: {...itemData.User}} as never);
            // navigate('ContactInfo', {id: itemData.User?.user_id})
          }}>
          <Avatar source={{uri: itemData.User?.face_url}} size={50}></Avatar>
        </TouchableOpacity>

        <View style={[styles.flexCloum, styles.textContent]}>
          <Text style={styles.nickName}>{itemData.User?.nick_name}</Text>
          <Text numberOfLines={4} style={styles.text}>
            {itemData.MomentsInfo?.content}
          </Text>
          {/* <FlatList
                        data={itemData.images}
                        renderItem={renderItem}
                        numColumns ={itemData.images?.length === 4? 2:3}>
                    </FlatList> */}
          <View
            row
            style={[
              styles.initImg,
              itemData.images?.length === 4 ? styles.img4main : null,
            ]}>
            {itemData.video ? (
              <TouchableOpacity
                onPress={() => {
                  // showViewVideo(true, itemData.video.url);
                  setShowViewVideo({
                    videView: true,
                    videoSrc: itemData.video.url,
                    videoPasue: false,
                  });
                }}
                activeOpacity={1}
                style={styles.videoMain}>
                {/* <Video
                resizeMode={'cover'}
                paused={true}
                source={{uri: imgItem}}
                style={styles.backgroundVideo}></Video> */}
                <Image
                  source={{uri: itemData.video.thumb}}
                  resizeMode={'cover'}
                  style={{
                    width: pt(150),
                    height: pt(100),
                  }}
                />
                <Icon
                  style={styles.play}
                  assetName="play"
                  assetGroup="page.news"
                  size={pt(30)}></Icon>
              </TouchableOpacity>
            ) : (
              renderImgs(itemData.images)
            )}
          </View>

          {itemData.MomentsInfo?.location ? (
            <Text numberOfLines={1} style={styles.address}>
              {itemData.MomentsInfo.location}
            </Text>
          ) : null}

          {
            // isDetail? <>
            //      <Text numberOfLines={1} style={styles.mentioned}>提到了：{itemData.mentioneNames}</Text>
            // </>:null
          }

          <View
            style={{
              ...styles.flexRow,
              alignItems: 'center',
              marginTop: pt(10),
            }}>
            <View style={styles.time}>
              <Text style={styles.timeTxt}>
                {formatTime(itemData.MomentsInfo?.CreatedAt)}
              </Text>
              {isDetail ? (
                <View style={styles.delIcon}>
                  <Icon
                    style={{marginLeft: pt(10)}}
                    assetName="seeAct"
                    assetGroup="page.friends"
                    size={pt(11)}></Icon>
                  <TouchableOpacity activeOpacity={1} onPress={handleDel}>
                    <Icon
                      style={{marginLeft: pt(10)}}
                      assetName="del"
                      assetGroup="page.friends"
                      size={pt(11)}></Icon>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <View style={{position: 'relative'}}>
              <TouchableOpacity onPress={handleSetExpanded}>
                <Icon
                  assetName="more"
                  assetGroup="page.friends"
                  size={pt(20)}
                />
              </TouchableOpacity>

              <Animated.View style={{...styles.options, width: animatedWidth}}>
                <TouchableOpacity onPress={handleLike} style={styles.standItem}>
                  <Icon
                    assetName={itemData.liked ? 'like_select' : 'stand'}
                    assetGroup="page.friends"
                    size={pt(11)}></Icon>
                  <Text style={styles.standText}>{t('点赞')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={commentFn} style={styles.standItem}>
                  <Icon
                    assetName="msg"
                    assetGroup="page.friends"
                    size={pt(11)}></Icon>
                  <Text style={styles.standText}>{t('评论')}</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>

          {isDetail ? renderDetailComment(itemData) : renderComment(itemData)}
        </View>
      </View>
      <ImageView></ImageView>
      {/* <VideoView></VideoView> */}
      <VideoModal
        setShowViewVideo={setShowViewVideo}
        showViewVideo={showViewVideo}></VideoModal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: pt(20),
  },

  mb30: {
    marginBottom: pt(30),
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexCloum: {
    flexDirection: 'column',
  },
  textContent: {
    marginLeft: pt(10),
    flex: 1,
  },
  text: {
    marginTop: pt(5),
    marginBottom: pt(5),
    lineHeight: pt(22),
    color: '#5B5B5B',
  },
  nickName: {
    color: Colors.color333,
    fontSize: pt(14),
  },
  time: {
    flexDirection: 'row',

    flex: 1,
  },
  timeTxt: {
    fontSize: pt(11),
    color: '#999',
  },
  comment: {
    marginTop: pt(10),
    backgroundColor: 'rgba(248, 248, 248,0.8)',
    padding: pt(10),
    paddingTop: pt(0),
    paddingBottom: pt(5),
    borderRadius: pt(5),
  },
  like: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: pt(5),
  },

  likeName: {
    marginLeft: pt(3),
    marginTop: pt(4),
  },
  line: {
    width: '100%',
    height: pt(0.5),
    backgroundColor: '#D9DADB',
    marginTop: pt(5),
    // marginBottom:pt(10)
  },
  commentMain: {
    marginTop: pt(10),
  },
  commentText: {
    color: Colors.color333,
    fontSize: pt(12),
  },
  comment11: {
    color: Colors.color666,
    fontSize: pt(12),
  },
  reply: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: pt(12),
  },
  colorLight: {
    color: '#7B78F9',
    fontSize: pt(12),
    marginLeft: pt(2),
  },
  options: {
    position: 'absolute',
    height: pt(29),
    backgroundColor: '#333',
    right: pt(30),
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pt(2),
    overflow: 'hidden',
  },
  standItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    flex: 1,
    textAlign: 'center',
  },
  standText: {
    color: '#fff',
    fontSize: pt(11),
    marginLeft: pt(5),
    fontWeight: '500',
  },
  address: {
    color: '#7581FF',
    fontSize: pt(11),
    marginTop: pt(10),
  },
  mentioned: {
    fontSize: pt(11),
    color: '#5B5B5B',
    marginTop: pt(10),
  },
  delIcon: {
    flexDirection: 'row',
  },
  initImg: {
    flexWrap: 'wrap',
  },
  img4main: {
    width: pt(180),
  },
  backgroundVideo: {
    width: pt(150),
    height: pt(100),
  },
  videoMain: {
    position: 'relative',
    flex: 1,
    width: pt(150),
    height: pt(100),
  },
  play: {
    position: 'absolute',
    left: pt(70),
    top: pt(40),
  },
  viewModal: {
    position: 'absolute',
    height: pt(200),
    width: pt(1000),
    backgroundColor: 'rgba(0,0,0,.4)',
  },
  videoMask: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#000',
    width: '100%',
  },
  modalVideo: {
    width: '100%',
    height: pt(300),
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: pt(-150),
  },
});
