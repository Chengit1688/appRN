import {useCallback, useMemo, useState} from 'react';
import {View, Image, Text, Colors, Hint, Icon} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import {formatUrl, getMsgContent} from '@/utils/common';
import {MessageItem, IMAGE, OWNID} from '../../demo/data';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import _ from 'lodash';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {updateCurrentMessageList} from '@/store/reducers/conversation';
import {useTranslation} from 'react-i18next';

import FastImage from 'react-native-fast-image';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {hasAndroidPermission} from '@/utils/permission';
import {Toast} from '@ant-design/react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Global from '@/store/reducers/global';
import GlobalLoading from '@/components/Loading/globalLoading';

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

export default function ChatImage({
  row,
  isOwn,
  setForwardContent,
}: {
  row: any;
  isOwn: boolean;
  setForwardContent: (flag: boolean) => void;
}) {
  const [imgSize, setImgSize] = useState({
    width: pt(150),
    height: pt(150),
  });

  const [imgViewSize, setViewImgSize] = useState({
    width: Dimensions.get('window').width,
    height: pt(150),
  });

  const [imgObj, changeImgObj] = useState({
    imgView: false,
    imgSrc: '',
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
  const uri = getMsgContent(row);
  const cont = JSON.parse(row.content);
  const file_name = cont.image_info.file_name;
  const thumb_url = formatUrl(cont.image_info.thumb_url);

  const isRemote = useMemo(() => {
    return !uri;
  }, [uri]);
  const destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + file_name; // 根据路径和文件名

  const saveImageToCameraRoll = async () => {
    try {
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        Toast.info('请先开启相册读取权限');
        return;
      }
      GlobalLoading.startLoading({text: '下载中...'});

      try {
        RNFetchBlob.config({
          path: destinationPath,
        })
          .fetch('GET', formatUrl(uri))
          .progress((received, total) => {
            GlobalLoading.startLoading({
              text: `${Number((received / total) * 100).toFixed(0)}%`,
            });
          })
          .then(async (res: any) => {
            const saved = await CameraRoll?.save(res.path(), {type: 'photo'});
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
      // } else {
      //   const saved = await CameraRoll?.save(uri, {type: 'photo'});
      //   GlobalLoading.endLoading();
      //   if (saved) {
      //     Toast.info('保存图片到相册成功');
      //   } else {
      //     Toast.info('保存图片到相册失败');
      //   }
      // }
    } catch (error) {
      console.log(error, uri, '保存图片到相册出错');
      Toast.info('保存视频出错,请开启文件权限');
    }
  };

  const onPress = (id: string, key: string) => {
    switch (key) {
      case 'forward':
        setForwardContent(true);
        break;
      case 'save':
        //保存到相册
        saveImageToCameraRoll();
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
      console.log(data, 'data----');
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
  // 跟微信一样，图片的宽度固定，高度固定, 不然发送图片会闪烁
  const ImgDiffStyle = {
    width: pt(100),
    height: pt(150),
  };

  //显示图片预览
  const showViewImg = (falg: boolean, item?: any) => {
    if (falg) {
      Image.getSize(uri, (width, height) => {
        const w = Dimensions.get('screen').width;
        const h = (w / width) * height;
        setViewImgSize({
          width: w,
          height: h,
        });
      });
    }
    changeImgObj({
      imgSrc: uri || '',
      imgView: falg,
    });
  };
  // 预览图片
  const ImgView = () => {
    return (
      <Modal
        style={styles.viewModal}
        visible={imgObj.imgView}
        transparent={true}>
        <ImageViewer
          saveToLocalByLongPress={false}
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
          onClick={() => {
            changeImgObj({
              ...imgObj,
              imgView: false,
            });
          }}
          onShowModal={() => {
            console.log('show');
          }}
          imageUrls={[
            {
              url: imgObj.imgSrc,
            },
          ]}
        />
        {/* <Image
          source={{uri: imgObj.imgSrc}}
          style={{width: imgViewSize.width, height: imgViewSize.height}}
        /> */}
      </Modal>
    );
  };
  const toggleCurrentHint = (id: string) => {
    let data = {...showHint};
    if (data[id]) {
      delete data[id];
    } else {
      data[id] = true;
    }
    setShowHint(data);
  };

  //const uri = 'https://randomuser.me/api/portraits/women/24.jpg';

  return (
    <View
      style={{
        borderRadius: pt(7),
        overflow: 'hidden',
        position: 'relative',
        ...viewDiffStyle,
      }}>
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
            console.log('点击图片===>');
            showViewImg(true);
          }}
          onLongPress={() => {
            setShowHint({
              [row.msg_id]: true,
            });
          }}>
          <Image
            style={{
              width: pt(100),
              height: pt(150),
            }}
            resizeMode="cover"
            source={{uri: thumb_url}}
          />
          {/**图片上传进度显示 */}
          {row.progress >= 0 && row.progress < 100 ? (
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.3)',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: pt(16)}}>
                {row.progress}%
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </Hint>

      <ImgView />
    </View>
  );
}

const styles = StyleSheet.create({
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
    top: '55.3%',
  },
});
