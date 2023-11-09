import {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  Colors,
  Icon,
  Hint,
  Image,
  Slider,
} from 'react-native-ui-lib';
import Video from 'react-native-video';
import {pt} from '@/utils/dimension';
import {formatUrl, getMsgContent} from '@/utils/common';
import {MessageItem, VIDEO, OWNID} from '../../demo/data';
import {
  ActivityIndicator,
  Modal,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {StyleSheet} from 'react-native';
import GlobalLoading from '@/components/Loading/globalLoading';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {RootState} from '@/store';
import {updateCurrentMessageList} from '@/store/reducers/conversation';
import {useTranslation} from 'react-i18next';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import React from 'react';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {hasAndroidPermission} from '@/utils/permission';
import {Toast} from '@ant-design/react-native';
import RNFetchBlob from 'rn-fetch-blob';
import VideoModal from './videoModal';

const actons: any = [
  {
    key: 'forward',
    label: '转发',
  },
  {
    key: 'save',
    label: '保存',
  },
  // {
  //   key: 'quote',
  //   label: '引用',
  // },
  // {
  //   key: 'select',
  //   label: '多选',
  // },
  //   {
  //     key: 'del',
  //     label: '删除',
  //   },
  //   {
  //     key: 'revoke',
  //     label: '撤回',
  //   },
  //   {
  //     key: 'copy',
  //     label: '复制',
  //   },
];

function ChatVideo({
  row,
  isOwn,
  setForwardContent,
}: {
  row: any;
  isOwn: boolean;
  setForwardContent: (flag: boolean) => void;
}) {
  const ref = useRef(null);
  const uri = getMsgContent(row);
  const cont = JSON.parse(row.content);
  const file_name = cont.video_info.file_name;
  const thumb_url = formatUrl(cont.video_info.thumb_url);

  const [videoObj, changeVideoObj] = useState({
    videView: false,
    videoSrc: '',
    videoPasue: false,
  });
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const selfInfo = useSelector(
    (state: any) => state.user.selfInfo,
    shallowEqual,
  );

  const id = row.msg_id;
  const currentMessageList = useSelector<RootState, IMSDK.Message[]>(
    state => state.conversation.currentMessageList,
    shallowEqual,
  );
  const currentConversation = useSelector<RootState, any>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );
  const [showHint, setShowHint] = useState<{[key: string]: boolean}>({});
  const getAction = useCallback((row: any) => {
    const _actons = _.clone(actons);
    if (row.send_id == selfInfo.user_id) {
      _actons.push({
        key: 'revoke',
        label: '撤回',
      });
    }

    if (row.is_collect) {
      // _actons.push({
      // 	key: 'uncollect',
      // 	label: '取消收藏',
      // })
    } else {
      _actons.push({
        key: 'collect',
        label: '收藏',
      });
    }
    return _actons;
  }, []);
  const onPress = (id: string, key: string) => {
    switch (key) {
      case 'forward':
        setForwardContent(true);
        break;
      case 'save':
        //保存到相册
        saveVideoToCameraRoll();
        break;
      case 'revoke':
        imsdk.revokeMessage([row], currentConversation).then(() => {
          // reverMsgCallBack(row.client_msg_id);
        });
        break;

      case 'collect':
        collect(id);
        break;
      case 'uncollect':
        collect(id, false);
        break;
    }
  };
  const collect = useCallback(
    async (msg_id: string, flag?: boolean) => {
      const index = currentMessageList.findIndex(i => i.msg_id === msg_id);
      if (index === -1) {
        throw new Error('未找到消息');
      }
      const deepCloneMsg = JSON.parse(JSON.stringify(currentMessageList));
      deepCloneMsg[index].is_collect = 1;
      dispatch(
        updateCurrentMessageList({
          data: deepCloneMsg,
        }),
      );

      const info = await imsdk.comlink
        .getMessageByMsgId(msg_id)
        .catch(e => console.log(e, 'e--'));
      const data = info.data[0];
      const res = await imsdk.comlink
        .collectMessage(data, flag)
        .catch(e => console.log(e, 'e--'));
      setShowHint({
        [id]: false,
      });
      Toast.info('收藏成功');
    },
    [currentMessageList],
  );

  const reverMsgCallBack = useCallback(
    (client_msg_id: any) => {
      const index = currentMessageList.findIndex(
        i => i.client_msg_id === client_msg_id,
      );
      const deepCloneMsg = JSON.parse(JSON.stringify(currentMessageList));
      deepCloneMsg.splice(index, 1);
      dispatch(
        updateCurrentMessageList({
          data: deepCloneMsg,
        }),
      );
    },
    [currentMessageList],
  );
  const toggleCurrentHint = (id: string) => {
    let data = {...showHint};
    if (data[id]) {
      delete data[id];
    } else {
      data[id] = true;
    }
    setShowHint(data);
  };
  const [isLoading, setIsLoading] = useState(true);

  const viewDiffStyle = isOwn
    ? {
        borderTopEndRadius: 0,
        //backgroundColor: '#7581FF',
      }
    : {
        //backgroundColor: '#F6F7FB',
        borderTopStartRadius: 0,
      };
  const textDiffStyle = isOwn
    ? {
        color: Colors.white,
      }
    : {};

  const destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + file_name; // 根据路径和文件名
  const saveVideoToCameraRoll = async () => {
    try {
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        Toast.info('请先开启读取权限');
        return;
      }
      GlobalLoading.startLoading({text: '下载中'});
      try {
        RNFetchBlob.config({
          path: destinationPath,
        })
          .fetch('GET', uri)
          .progress((received, total) => {
            GlobalLoading.startLoading({
              text: `${Number((received / total) * 100).toFixed(0)}%`,
            });
          })
          .then(async (res: any) => {
            const saved = await CameraRoll?.save(res.path(), {type: 'video'});
            GlobalLoading.endLoading();
            toggleCurrentHint(row.msg_id);
            if (saved) {
              Toast.info('保存成功');
            } else {
              Toast.info('保存失败');
            }
          });
      } catch (error) {
        console.error('Download error:', error);
      }

      // const saved = await CameraRoll?.save(uri, {type: 'video'});
      // if (saved) {
      //   Toast.info('保存视频到相册成功');
      // } else {
      //   Toast.info('保存视频到相册失败');
      // }
    } catch (error) {
      Toast.info('保存视频出错,请开启文件权限');
    }
  };

  const [showViewVideo, setShowViewVideo] = useState({
    videView: false,
    videoSrc: uri,
    videoPasue: true,
  });

  return (
    <View
      style={{
        padding: pt(0),
        borderRadius: pt(7),
        ...viewDiffStyle,
      }}>
      <View>
        <Hint
          visible={showHint[id]}
          color={'#4C4C4C'}
          removePaddings={true}
          borderRadius={pt(5)}
          onBackgroundPress={() => toggleCurrentHint(id)}
          customContent={(() => {
            return (
              <View
                row
                style={{
                  flexWrap: 'wrap',
                  width: pt(218),
                  paddingTop: pt(10),
                  paddingBottom: pt(10),
                }}>
                {getAction(row).map(item => {
                  return (
                    <TouchableOpacity
                      key={item.key}
                      activeOpacity={1}
                      onPress={() => {
                        onPress(id, item.key);
                      }}>
                      <View
                        center
                        style={{
                          width: pt(54),
                          height: pt(54),
                        }}>
                        <Icon
                          assetName={item.key}
                          assetGroup="page.chat"
                          style={{
                            width: pt(16),
                            height: pt(16),
                            marginBottom: pt(6),
                          }}
                        />
                        <Text
                          style={{
                            fontSize: pt(12),
                            color: '#FFFFFF',
                          }}>
                          {t(item.label)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })()}>
          <TouchableOpacity
            onPress={() => {
              setShowViewVideo({
                ...showViewVideo,
                videView: true,
                videoPasue: false,
              });
            }}
            onLongPress={() => {
              setShowHint({
                [row.msg_id]: true,
              });
            }}
            activeOpacity={1}
            style={styles.videoMain}>
            {/* <Video
              paused={true}
              source={{uri}}
              resizeMode="cover"
              ref={ref}
              onBuffer={() => {}}
              onError={() => {
                console.log(`视频加载出错:${uri}`);
              }}
              onLoad={() => {
                console.log(`视频加载成功:${uri}`);
              }}
              cache={true} // 启用视频缓存
              style={styles.videoStyle}
            /> */}
            <Image source={{uri: thumb_url}} style={styles.videoStyle} />
            <Icon
              style={styles.play}
              assetName="play"
              assetGroup="page.news"
              size={pt(30)}></Icon>
          </TouchableOpacity>
        </Hint>
      </View>
      <VideoModal
        setShowViewVideo={setShowViewVideo}
        showViewVideo={showViewVideo}></VideoModal>
    </View>
  );
}

export default ChatVideo;

const styles = StyleSheet.create({
  videoStyle: {
    flex: 1,
    width: pt(100),
    height: pt(150),
    borderRadius: pt(7),
    backgroundColor: '#000',
  },
  videoMain: {
    position: 'relative',
    flex: 1,
    width: pt(100),
    height: pt(150),
  },
  play: {
    position: 'absolute',
    left: pt(40),
    top: pt(65),
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalVideo: {
    position: 'absolute',

    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  slider: {
    width: pt(300),
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor: '#7581FF',
    borderWidth: 1,
    shadowColor: Colors.white,
  },
  track: {
    height: 2,
  },
  activeThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: '#7581FF',
    borderWidth: 2,
  },
});
