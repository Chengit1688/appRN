import {View, Text, Colors, Hint, Icon} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import {MessageItem, FILE, OWNID} from '../../demo/data';
import {Svg} from 'react-native-svg';
import {SvgIcon} from '@/components';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {formatSize1, formatUrl, getMsgContent} from '@/utils/common';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import RNFetchBlob from 'rn-fetch-blob';
import {useCallback, useMemo, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Toast} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import {
  updateCurrentMessageList,
  updateMessageItem,
} from '@/store/reducers/conversation';
import {RootState} from '@/store';
import {useTranslation} from 'react-i18next';
import _ from 'lodash';

const actons: any = [
  {
    key: 'forward',
    label: '转发',
  },
];

export default function ChatFile({
  row,
  isOwn,
  setForwardContent,
}: {
  row: any;
  isOwn: boolean;
  setForwardContent: (flag: boolean) => void;
}) {
  // const {message} = msg.content as FILE;
  const {content, type, loacl_url} = row;
  const {navigate} = useNavigation();
  const {t} = useTranslation();
  const [progress, setProgress] = useState<any>(0);
  const [startDown, setSartDwon] = useState(false);

  const dispatch = useDispatch();
  const selfInfo = useSelector(
    (state: any) => state.user.selfInfo,
    shallowEqual,
  );
  const currentMessageList = useSelector<RootState, IMSDK.Message[]>(
    state => state.conversation.currentMessageList,
    shallowEqual,
  );
  const currentConversation = useSelector<RootState, any>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );
  const id = row.msg_id;
  const {file_name, file_url, file_size} = getMsgContent({
    content,
    type,
  });

  const isRemote = useMemo(() => {
    return !loacl_url;
  }, [loacl_url]);
  const destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + file_name; // 根据路径和文件名
  const downloadFile = async (url: string) => {
    if (!isRemote) return;
    try {
      setSartDwon(true);
      RNFetchBlob.config({
        path: destinationPath,
      })
        .fetch('GET', formatUrl(file_url))
        .progress((received, total) => {
          setProgress(Number((received / total) * 100).toFixed(0));
        })
        .then(res => {
          dispatch(
            updateMessageItem({
              data: {
                ...row,
                loacl_url: res.path(),
              },
            }),
          );
        });
    } catch (error) {
      console.error('Download error:', error);
    }
  };
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

  const toggleCurrentHint = (id: string) => {
    let data = {...showHint};
    if (data[id]) {
      delete data[id];
    } else {
      data[id] = true;
    }
    setShowHint(data);
  };

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
  return (
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
              width: pt(175),
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
        activeOpacity={1}
        onPress={() => {
          if (loacl_url) {
            navigate('filePreview' as never, {
              name: file_name,
              url: loacl_url,
            });
            return;
          }
          downloadFile(file_url);
        }}
        onLongPress={() => {
          setShowHint({
            [row.msg_id]: true,
          });
        }}
        style={{
          padding: pt(12),
          borderRadius: pt(7),
          flexDirection: 'row',
          backgroundColor: '#F6F7FB',
          ...viewDiffStyle,
        }}>
        <View
          style={{
            marginRight: pt(8),
          }}>
          <Text numberOfLines={2} style={{width: pt(100)}}>
            {file_name}
          </Text>
          <Text
            style={{
              marginTop: pt(4),
            }}>
            {formatSize1(file_size)}
          </Text>
        </View>

        <View style={styles.icon}>
          <SvgIcon name="file" style={styles.fileIcon} />
          {isRemote ? (
            <View style={styles.down}>
              {!startDown ? (
                <SvgIcon
                  name="down"
                  style={{
                    width: pt(25),
                    height: pt(25),
                  }}
                />
              ) : (
                <Text style={{color: '#fff'}}>{progress}%</Text>
              )}
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </Hint>
  );
}

const styles = StyleSheet.create({
  icon: {
    position: 'relative',
    width: pt(40),
    height: pt(40),
  },
  fileIcon: {
    position: 'absolute',
    width: pt(36),
    height: pt(36),
    left: pt(2),
    top: pt(2),
  },
  down: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.5)',
    width: pt(40),
    height: pt(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
