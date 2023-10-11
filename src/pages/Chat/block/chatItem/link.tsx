import {useState, useCallback, useEffect} from 'react';
import {Linking} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  View,
  Text,
  Colors,
  Hint,
  Icon,
  GridList,
  TouchableOpacity,
} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import _ from 'lodash-es';

import {pt} from '@/utils/dimension';
import {getMsgContent} from '@/utils/common';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {
  updateCurrentMessageList,
  insertCurrentMessageList,
} from '@/store/reducers/conversation';
import {RootState} from '@/store';

import {MessageItem, TEXT, OWNID} from '../../demo/data';
import {Toast} from '@ant-design/react-native';
import Config from 'react-native-config';
import {useNavigation} from '@react-navigation/native';

const actons = [
  {
    key: 'forward',
    label: '转发',
  },
  {
    key: 'quote',
    label: '引用',
  },
  {
    key: 'select',
    label: '多选',
  },
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

export default function ChatLink({
  row,
  isOwn,
  showRadio,
  setForwardContent,
  setQuoteContent,
  setSelectContent,
}: {
  row: any;
  isOwn: boolean;
  showRadio: boolean;
  setForwardContent: (flag: boolean) => void;
  setQuoteContent: (nickname: string, content: string) => void;
  setSelectContent: (flag: boolean) => void;
}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {navigate} = useNavigation();

  const id = row.msg_id;
  const viewDiffStyle = isOwn
    ? {
        borderTopEndRadius: 0,
        backgroundColor: '#7581FF',
      }
    : {
        backgroundColor: '#F6F7FB',
        borderTopStartRadius: 0,
      };
  const textDiffStyle = isOwn
    ? {
        color: Colors.white,
      }
    : {};

  const [showHint, setShowHint] = useState<{[key: string]: boolean}>({});
  const selfInfo = useSelector(
    (state: RootState) => state.user.selfInfo,
    shallowEqual,
  );
  const currentMessageList = useSelector<RootState, IMSDK.Message[]>(
    state => state.conversation.currentMessageList,
    shallowEqual,
  );
  const currentConversation = useSelector<RootState, IMSDK.Conversation>(
    state => state.conversation.currentConversation,
    shallowEqual,
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

  const onPress = (id: string, key: string) => {
    let data = {...showHint};
    delete data[id];
    setShowHint(data);
    switch (key) {
      case 'forward':
        setForwardContent(true);
        break;
      case 'quote':
        setQuoteContent(row.send_nickname, getMsgContent(row));
        break;
      case 'select':
        setSelectContent(true);
        break;
      case 'del':
        imsdk.deleteLocalMessage([row], currentConversation).then(() => {
          deleteMessage([row]);
        });
        break;
      case 'revoke':
        imsdk.revokeMessage([row], currentConversation).then(() => {
          // reverMsgCallBack(row.client_msg_id);
        });
        break;
      case 'copy':
        copyToClipboard(id);
        break;
      case 'collect':
        collect(id);
        break;
      case 'uncollect':
        collect(id, false);
        break;
    }
  };

  const deleteMessage = msg_list => {
    const msg_id = msg_list[0]?.msg_id;
    const cloneMsgList = JSON.parse(JSON.stringify(currentMessageList));
    const index = cloneMsgList.findIndex(msg => msg.msg_id === msg_id);
    if (index) {
      cloneMsgList.splice(index, 1);
      dispatch(
        updateCurrentMessageList({
          data: cloneMsgList,
        }),
      );
    }
  };

  const reverMsgCallBack = useCallback(
    client_msg_id => {
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

  const copyToClipboard = (client_msg_id: string) => {
    let text = '';
    try {
      text = JSON.parse(row.content);
      text = text.text;
    } catch (error) {
      text = row.content;
    }
    Clipboard.setString(text);
  };

  //   const collect = async (id: string, flag?: boolean) => {
  // 	const info = await imsdk.comlink.getMessageById(id);
  // 	const data = info.data[0];
  // 	console.log(data, 'data----');
  // 	const res = await imsdk.comlink.collectMessage(data, flag);
  // 	console.log(res,'res---')
  // 	//row.is_collect = 1;
  //   };
  const collect = useCallback(
    async (msg_id: string, flag?: boolean) => {
      const index = currentMessageList.findIndex(i => i.msg_id === msg_id);
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

  const getAction = useCallback((row: any) => {
    const _actons = _.clone(actons);
    if (row.send_id == selfInfo.user_id) {
      _actons.push({
        key: 'revoke',
        label: '撤回',
      });
    }
    _actons.push({
      key: 'copy',
      label: '复制',
    });
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

  const msg = getMsgContent(row);

  const formatURLParametersToJSON = (paramStr: string) => {
    let newParamStr: string = paramStr;
    if (paramStr.includes('?')) {
      newParamStr = paramStr.split('?')[1];
    }
    const params: any = {};
    const paramPairs = newParamStr.split('&');

    for (const pair of paramPairs) {
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value);
    }
    return params;
  };

  return (
    <>
      <View
        style={{
          padding: pt(12),
          borderRadius: pt(7),
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
          <Text
            underline={true}
            onLongPress={() => {
              if (!showRadio) toggleCurrentHint(id);
            }}
            onPress={() => {
              if (msg.startsWith(`${Config.VITE_APP_GROUPURL}`)) {
                //群邀请
                const params = formatURLParametersToJSON(msg);

                navigate('inviteGroup', {
                  group_id: params.id,
                  name: params.name,
                });
              } else if (/^http/.test(msg)) {
                Linking.openURL(msg);
              } else {
                Linking.openURL('http://' + msg);
              }
            }}
            style={{...textDiffStyle}}>
            {msg}
          </Text>
        </Hint>
      </View>
    </>
  );
}
