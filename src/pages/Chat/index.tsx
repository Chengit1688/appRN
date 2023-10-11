import {useRef, useState, useEffect, useCallback, useMemo} from 'react';
import {
  TextInput,
  VirtualizedList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import {
  View,
  Text,
  Assets,
  Modal,
  Dialog,
  PanningProvider,
  Button,
  Icon,
} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {
  useNavigation,
  useRoute,
  useTheme,
  StackActions,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {v4 as uuid} from 'uuid';
import dayjs from 'dayjs';
import Mint from 'mint-filter';
import {useRequest} from 'ahooks';
import _ from 'lodash-es';

import {pt} from '@/utils/dimension';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {StorageFactory} from '@/utils/storage';
import {formatUrl, isUrl} from '@/utils/common';
import {RootState} from '@/store';
import {setCurrentMemberList} from '@/store/actions/contacts';
import {
  checkoutConversation,
  updateConversationItem,
} from '@/store/reducers/conversation';
import HeaderMore from '@/components/HeaderRight/more';
import Header from '@/components/Header';
import Main from './block/main';
import ChatInput from './block/chatInput';
import Toolbar from './block/toolbar';
import HeaderLeft from '@/components/HeaderLeft';
import {getUserOnline} from '@/api/user';
import GroupMember from '../GroupChat/GroupMember';
import VoiceModal from './block/toolbar/voiceModal';
import RedPacketModal from '@/components/RedPacketModal';
import {showRedPacket} from './block/toolbar/redPacket';

const checkIsImgType = file => {
  if (
    !/\.('bmp|jpg|jpeg|png|tif|gif|pcx|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|ai|raw|wmf|webp|avif|apng')$/.test(
      file.name?.toLocaleLowerCase(),
    )
  ) {
    return false;
  } else {
    return true;
  }
};

const checkIsVideoType = file => {
  if (
    !/\.(wmv|asf|asx|rm|rmvb|mp4|3gp|mov|m4v|avi|dat|mkv|flv|vob)$/.test(
      file.name?.toLocaleLowerCase(),
    )
  ) {
    return false;
  } else {
    return true;
  }
};

const loadVideo = async url => {
  return new Promise(resolve => {
    let video = document.createElement('video');
    video.src = url;
    video.addEventListener('loadedmetadata', () => {
      resolve({
        duration: video.duration * 1000,
        width: video.videoWidth,
        height: video.videoHeight,
      });
    });
  });
};

const uploadType = {
  6: '1',
  3: '3',
  5: '4',
};

export default function Chat() {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {navigate, goBack} = useNavigation();
  const navigation = useNavigation();

  const {params} = useRoute<any>();
  const dispatch = useDispatch();
  const {colors} = useTheme();

  const inputRef = useRef<TextInput | null>(null);

  const [toolType, setToolType] = useState('');
  const [isShowKeyboard, setShowKeyboard] = useState(false);
  const [atInfo, setAtInfo] = useState<any>([]);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const [cancelRecording, setCancelRecording] = useState(false);

  const onChangeInputFocus = (flag: boolean) => {
    if (flag) {
      setToolType('');
      setShowKeyboard(true);
    } else {
      setShowKeyboard(false);
    }
  };

  const onSelectionChange = _.debounce(e => {
    setSelection(e.nativeEvent.selection);
  }, 200);

  useEffect(() => {
    switch (params?.source) {
      case 'businessCard':
        //直接发送名片
        sendMessage(
          {
            card_info: params?.cardInfo,
          },
          7,
        );
        break;
    }
  }, [params]);

  const currentConversation = useSelector<RootState, IMSDK.Conversation>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );

  const [inputVal, setInputVal] = useState(currentConversation?.draft || '');
  const settingInfoStore = useSelector<RootState, IMSDK.Conversation>(
    state => state.conversation.settingInfo,
    shallowEqual,
  );

  const [settingInfo, setSettingInfo] = useState<any>(settingInfoStore);

  const userInfo = useSelector<RootState, RootState['user']['selfInfo']>(
    state => state.user.selfInfo,
    shallowEqual,
  );
  const shieldList = useSelector<RootState>(
    state => state.global.shieldList,
    shallowEqual,
  );

  const muteTimer = useRef<any>(null);
  const localTime = useRef<any>(null);
  // const isMute = settingInfo?.muteUserList?.findIndex(i => i.user_id === userInfo.user_id)
  const listRef = useRef<VirtualizedList<any>>(null);
  const [isMute, setIsMute] = useState(false);
  const [headerLeft, setHeaderLeft] = useState<any>(null);
  const [HeaderRight, setHeaderRight] = useState<any>(null);
  const [showInput, setShowInput] = useState(true);
  const [quoteContent, setQuoteContent] = useState<any>();
  const [selection, setSelection] = useState({start: 0, end: 0});

  const setOptions = ({headerLeft, headerRight}: any, showRadio: boolean) => {
    setHeaderLeft(headerLeft());
    setHeaderRight(headerRight());
    setShowInput(!showRadio);
  };

  const conv = currentConversation;
  console.log('conv==>', conv);
  const info =
    conv?.type === 1
      ? conv?.user || {}
      : conv?.type === 2
      ? conv?.group || {}
      : {};

  const name = conv?.type === 1 ? info?.remark || info?.nick_name : info?.name;
  const avatar = info?.face_url
    ? {uri: formatUrl(info.face_url)}
    : conv?.type === 1
    ? Assets.imgs.avatar.defalut
    : Assets.imgs.avatar.group;

  const isGroup = useMemo(() => {
    return conv?.type === 2;
  }, [conv]);

  const [redPacketData, setShowRedPacket] = useState<any>({
    redpack_id: '',
    send_nickname: '',
    remark: '',
    send_face_url: '',
    show: false,
    isGroup,
    group_id: conv?.group_id || '',
    message: {},
  });

  const sendMessage = useCallback(
    (msg: any, type: number) => {
      const content = JSON.stringify(msg);
      const msgText = imsdk.createMessage({
        recv_id:
          currentConversation.type === 1
            ? currentConversation.user.user_id
            : currentConversation.group.group_id,
        conversation_type: currentConversation.type,
        type: type || 1,
        content,
        ...(msg.at_info?.length
          ? {at_list: msg.at_info.map(_ => '' + _.user_id)}
          : {}),
      });
      const max_seq = currentConversation.max_seq + 1;
      const updateConv = {
        ...currentConversation,
        unread_count: IMSDK.MessageStatus.UNREAD,
        max_seq: max_seq,
      };
      imsdk.sendMessage(
        msgText,
        {
          conversation_id: currentConversation.conversation_id,
          content,
          status: IMSDK.MessageStatus.SENDING,
          type,
          send_nickname: userInfo.nick_name,
          send_id: userInfo.user_id,
          ...(type === 6 ? {file_name: msg.file_info.file_name} : {}),
        },
        updateConv,
      );

      setTimeout(() => {
        // listRef.current.scrollTo({
        // 	index: Number.MAX_VALUE,
        // 	align:'bottom'
        // });
      }, 1);
    },
    [currentConversation],
  );

  const onMessage = (msg, type) => {
    const mint = new Mint(shieldList);
    try {
      if (atInfo.length) {
        let textMsg: any = {};
        const info = new Map();
        textMsg = {
          at_info: atInfo.reduce((acc: any, cur: any) => {
            if (!info.has(cur.user_id) && msg.includes(cur.group_nick_name)) {
              info.set(cur.group_nick_name, 1);
              msg = msg.replace(cur.group_nick_name, cur.user_id);
              return acc.concat(cur);
            }
            return acc;
          }, []),
          text: msg,
        };
        sendMessage(textMsg, type);
        setAtInfo([]);
        return;
      }
      if (type === 9) {
        //引用文本
        let textMsg: any = {};
        const info: any = {
          ...quoteContent,
        };
        if (quoteContent.type === 9) {
          info.content = JSON.stringify({
            text: JSON.parse(quoteContent.content)?.text,
          });
        }
        textMsg.quote_info = info;
        if (!textMsg.text) {
          textMsg.text = msg;
        }
        sendMessage(textMsg, type);
        setQuoteContent('');
        return;
      }

      let txt = mint.filter(msg).text;
      type = type === 2 ? 1 : type;
      sendMessage(typeof msg === 'string' ? {text: txt} : msg, type);
    } catch (err) {}
  };
  // console.log('settingInfo=============>', settingInfo?.role);
  const placeholder = useMemo(() => {
    let text = '';
    if (settingInfo?.role === 'user') {
      if (settingInfo?.mute_all_member === 1) {
        text = '全体禁言中';
      }
      if (isMute) {
        text = '禁言中';
      }
    }
    return text;
  }, [settingInfo, isMute]);

  const isDisabled = useMemo(() => {
    const index = settingInfo?.muteUserList?.findIndex(
      i => i.user_id === userInfo.user_id,
    );
    if (index > -1) {
      return true;
    }
    if (
      settingInfo?.role === 'user' &&
      (settingInfo?.mute_all_member === 1 || isMute)
    ) {
      return true;
    }
    return false;
  }, [settingInfo, isMute]);

  useEffect(() => {
    if (muteTimer.current) {
      clearTimeout(muteTimer.current);
    }
    function tick(start, end) {
      localTime.current = Date.now();
      // console.log('start=======>', start, end, localTime.current)
      if (localTime.current < end && localTime.current > start) {
        setIsMute(true);
        muteTimer.current = setTimeout(() => {
          tick(start, end);
        }, 1000);
      } else {
        setIsMute(false);
      }
    }
    let muteStartTime = 0,
      muteEndTime = 0;
    if (settingInfo?.role === 'user' && settingInfo?.mute_all_member === 4) {
      const start = settingInfo.mute_all_period.split('-')[0];
      const end = settingInfo.mute_all_period.split('-')[1];
      const startHour = start.split(':')[0];
      const startMinute = start.split(':')[1];
      const endHour = end.split(':')[0];
      const endMinute = end.split(':')[1];
      muteStartTime =
        dayjs()
          .set('hour', startHour)
          .set('minute', startMinute)
          .set('second', 0)
          .unix() * 1000;
      muteEndTime =
        dayjs()
          .set('hour', endHour)
          .set('minute', endMinute)
          .set('second', 0)
          .unix() * 1000;
    }
    const index = settingInfo?.muteUserList?.findIndex(
      i => i.user_id === userInfo.user_id,
    );
    if (index > -1) {
      const mute_end_time =
        settingInfo?.muteUserList[index].mute_end_time * 1000;
      if (mute_end_time > muteEndTime) {
        muteEndTime = mute_end_time;
        muteStartTime = Date.now() - 1000;
      }
    }
    // console.log('mute_end_time', muteStartTime, muteEndTime, index)
    if (muteStartTime && muteEndTime) {
      tick(muteStartTime, muteEndTime);
    }
    return function () {
      if (muteTimer.current) {
        clearTimeout(muteTimer.current);
      }
      setIsMute(false);
    };
  }, [settingInfo]);

  useEffect(() => {
    return () => {
      dispatch(checkoutConversation(null));
    };
  }, []);

  const [userInfoObj, setUserInfoObj]: any = useState({});
  const getUserOnlineHttp = useRequest(getUserOnline, {
    manual: true,
    pollingInterval: 10000,
    onSuccess: result => {
      setUserInfoObj(result);
    },
  });

  const user_id = useMemo(() => {
    return currentConversation?.user?.user_id;
  }, [currentConversation]);

  const onlineStatus = useMemo(() => {
    if (currentConversation?.type == 2) {
      return {state: 0};
    }
    if (!(userInfo && userInfoObj)) {
      return {state: 0};
    }
    return userInfo.is_privilege === 1
      ? userInfoObj.online
        ? {state: 1, text: t('在线')}
        : {state: 2, text: t('离线') /**userInfoObj.offline_info */}
      : userInfoObj.online
      ? {state: 1, text: t('在线')}
      : {state: 2, text: t('离线') /**userInfoObj.offline_info */};
  }, [userInfo, userInfoObj, currentConversation?.type]);

  useEffect(() => {
    getUserOnlineHttp.cancel();
    setUserInfoObj({});
    if (currentConversation?.type != 2 && user_id) {
      getUserOnlineHttp.run({user_id, operation_id: Date.now().toString()});
    }
  }, [currentConversation?.conversation_id]);

  const [mentionSelection, setMentionSelection] = useState(null);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionPointer, setMentionPointer] = useState<number>();
  const [mentionOpen, setMentionOpen] = useState(false);

  // 如果是群聊，从本地获取群信息
  // const getGroupInfo = async () => {
  //   if (isGroup && !currentConversation?.group.role) {
  //     imsdk.comlink
  //       .getGroupById(currentConversation.group_id)
  //       .then((res: any) => {
  //         console.log(res, '获取群配置等信息');
  //         // dispatch(
  //         //   checkoutConversation(),
  //         // );
  //       });
  //   }
  // };

  const geliMemberList = async () => {
    if (!isGroup) {
      return;
    }
    // const result = await imsdk.initGroupMember({
    //   group_id: currentConversation.group_id,
    // });
    const d = await imsdk.comlink.getGroupMember(
      10000,
      1,
      currentConversation.group_id,
    );

    if (d?.data?.length) {
      const data = d.data;

      // const owner=data.filter((item)=>item.role=='owner' || item.role=='admin');
      // // console.error(owner)
      // setGroupMaster(owner);
      dispatch(setCurrentMemberList(data));
    }
  };
  // const isOwner = useMemo(() => {
  //   return currentConversation?.group?.role === 'owner';
  // }, [currentConversation]);
  // const isAdmin = useMemo(() => {
  //   return currentConversation?.group?.role === 'admin';
  // }, [currentConversation]);
  // const currentMemberList = useSelector(
  //   (state: RootState) => state.contacts.currentMemberList,
  //   shallowEqual,
  // );
  // const [atMemberList, setAtMemberList] = useState<any[]>([]);
  // let atALLMemberList = useMemo(() => {
  //   console.log(isOwner, currentConversation, 'isOwner');
  //   let arr = [];
  //   if (isOwner || isAdmin) {
  //     arr.push({nick_name: '所有人', user_id: 'all'});
  //   }
  //   let newArr: any = [];
  //   currentMemberList.forEach(item => {
  //     newArr.push(item.user);
  //   });

  //   let arr2 = [...arr, ...newArr];
  //   arr2 = arr2.filter((_: any) => userInfo.user_id != _.user_id);
  //   return arr2;
  // }, [currentMemberList]);

  const checkAt = (val: string) => {
    // 当前输入值
    const currnetInput = val;
    const curVal = val.charAt(selection.end);
    if (isGroup && curVal === '@') {
      setMentionOpen(true);
    }
    setInputVal(currnetInput);
  };

  useEffect(() => {
    geliMemberList();
    return () => {
      dispatch(setCurrentMemberList([]));
    };
  }, [currentConversation]);

  // console.log('params========>>>', params);

  return (
    // <View flex {...panResponder.panHandlers}>
    <View flex>
      <Header
        left={
          headerLeft
            ? headerLeft
            : HeaderLeft({
                onPress: () => {
                  // 当前有输入内容但是并没有发送，则作为草稿保存
                  dispatch(
                    updateConversationItem({
                      data: {
                        ...conv,
                        draft: inputVal,
                      },
                    }),
                  );

                  //如果从创建群聊页面过来，则返回首页
                  if (params?.source === 'createGroup') {
                    navigate('Message' as never);
                  } else {
                    goBack();
                  }
                },
              })
        }
        middle={
          <View center>
            <Text
              style={{
                fontSize: pt(18),
                color: colors.text,
              }}>
              {name}
            </Text>
            {onlineStatus.state ? (
              <Text
                style={{
                  marginTop: pt(5),
                  fontSize: pt(12),
                  color: onlineStatus.state == 1 ? colors.text : 'red',
                }}>
                {onlineStatus.text}
              </Text>
            ) : null}
          </View>
        }
        right={
          HeaderRight ?? (
            <HeaderMore
              onPress={() => {
                if (conv?.type === 2) {
                  navigate('GroupChatInfo', {info});
                } else {
                  navigate('ContactInfo', {info});
                }
              }}
            />
          )
        }
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
        }}>
        <View flex style={{paddingBottom: isShowKeyboard ? 0 : insets.bottom}}>
          <Main
            ref={listRef}
            setOptions={setOptions}
            quoteContent={quoteContent}
            setQuoteContent={setQuoteContent}
            setShowRedPacket={setShowRedPacket}
            groupInfo={info}
            showContact={row => {
              if (!row.send_id) {
                return;
              }
              let contactInfo = {
                user_id: row.send_id,
              };
              navigate('ContactInfo', {info: contactInfo});
            }}
            // atMemberList={atMemberList}
            // mentionOpen={mentionOpen}
            // setAtUser={(item: any) => {
            //   const start = inputVal.substring(0, selection.start);
            //   const initVal = start.lastIndexOf('@');
            //   const newText =
            //     inputVal.slice(0, initVal) +
            //     '@' +
            //     item.nick_name +
            //     ' ' +
            //     inputVal.slice(selection.start, inputVal.length);
            //   setInputVal(newText);
            //   setMentionOpen(false);
            //   setMentionPointer(undefined);
            //   setAtMemberList(atALLMemberList);
            // }}
          />
          {quoteContent ? (
            <View
              row
              spread
              style={{
                padding: pt(10),

                borderRadius: pt(7),
                backgroundColor: '#F6F7FB',
              }}>
              <Text flex numberOfLines={2}>
                {quoteContent.msg}
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setQuoteContent('');
                }}>
                <Icon
                  assetName="close"
                  assetGroup="page.chat"
                  style={{
                    width: pt(16),
                    height: pt(16),
                    marginLeft: pt(6),
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          {showInput ? (
            <>
              <View row center ref={inputRef}>
                <View
                  flex
                  style={{
                    height: pt(47),
                    borderWidth: pt(1),
                    borderColor: '#F1F1F1',
                  }}>
                  <TextInput
                    returnKeyType={'done'}
                    value={inputVal}
                    multiline
                    //defaultValue={inputVal}
                    onChangeText={val => {
                      checkAt(val);
                    }}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    editable={isDisabled ? false : true}
                    // onEndEditing={sendMessage}
                    onFocus={() => onChangeInputFocus(true)}
                    onBlur={() => onChangeInputFocus(false)}
                    placeholder={placeholder ? placeholder : t('说点什么...')}
                    onSelectionChange={e => {
                      e.persist();
                      onSelectionChange(e);
                    }}
                    placeholderTextColor="#B1B1B2"
                    style={{
                      flex: 1,
                      paddingHorizontal: pt(16),
                      fontSize: pt(14),
                      lineHeight: pt(18),
                      textAlignVertical: 'top',
                    }}

                    // numberOfLines={3}
                    // multiline={true}
                  />
                </View>

                <View
                  style={{
                    paddingHorizontal: pt(8),
                  }}>
                  <Button
                    activeOpacity={0.8}
                    label={t('发送')}
                    onPress={async () => {
                      if (inputVal !== undefined && inputVal.trim().length) {
                        const val = inputVal.trim();
                        if (val && quoteContent) {
                          onMessage(val, 9);
                          setQuoteContent('');
                        } else if (isUrl(val)) {
                          onMessage(val, 10);
                        } else {
                          onMessage(val, 1);
                        }
                        setInputVal('');
                      }
                    }}
                    avoidInnerPadding={true}
                    avoidMinWidth={true}
                    backgroundColor="#7581FF"
                    style={{
                      height: pt(35),
                      width: pt(60),
                      borderRadius: pt(8),
                    }}
                  />
                </View>
              </View>

              {/* <ChatInput
                ref={inputRef}
                inputVal={inputVal}
                placeholder={placeholder}
                isDisabled={isDisabled}
                setInputVal={_.debounce((val: string) => {
                  checkAt(val);
                }, 200)}
                setSelection={_.debounce(event => {
                  setSelection(event);
                }, 200)}
                onChangeInputFocus={onChangeInputFocus}
                sendMessage={() => {
                  if (inputVal !== undefined && inputVal.trim().length) {
                    const val = inputVal.trim();
                    if (val && quoteContent) {
                      onMessage(val, 9);
                      setQuoteContent('');
                    } else if (isUrl(val)) {
                      onMessage(val, 10);
                    } else {
                      onMessage(val, 1);
                    }
                    setInputVal('');
                  }
                }}
              /> */}
              {!isDisabled ? (
                <Toolbar 
                  hidekeyBoard={()=>{
                    Keyboard.dismiss();
                    // console.log('点击了表情')
                  }}
                  inputVal={inputVal}
                  setInputVal={setInputVal}
                  toolType={toolType}
                  setToolType={setToolType}
                  setShowVoiceModal={setShowVoiceModal}
                  showVoiceModal={showVoiceModal}
                  setCancelRecording={setCancelRecording}
                  cancelRecording={cancelRecording}
                  onViewShow={() => {
                    inputRef.current?.blur();
                  }}
                  isGroup={isGroup}
                  groupInfo={info}
                  userInfo={info}
                  sendMessage={(msg, data, type) =>
                    onMessage(msg, Number(type))
                  }
                />
              ) : null}
            </>
          ) : null}
        </View>
      </KeyboardAvoidingView>
      {isGroup && (
        <GroupMember
          groupInfo={info}
          isAt={mentionOpen}
          setAtUser={(item: any) => {
            setMentionOpen(false);
            if (item.user_id === 'all') {
              setAtInfo((pre: any) =>
                pre.concat({
                  group_nick_name: '所有人',
                  user_id: 'all',
                }),
              );
            } else {
              setAtInfo((pre: any) =>
                pre.concat({
                  group_nick_name: item.group_nick_name || item.nick_name,
                  user_id: item.user_id,
                }),
              );
            }
            const start = inputVal.substring(0, selection.start);
            const initVal = start.lastIndexOf('@');
            const newText =
              inputVal.slice(0, initVal) +
              '@' +
              item.nick_name +
              ' ' +
              inputVal.slice(selection.start, inputVal.length);
            setInputVal(newText);
          }}
          // groupMember={atALLMemberList}
          onCancel={() => {
            setMentionOpen(false);
          }}
        />
      )}

      {/**语音发送全屏 */}
      {showVoiceModal && <VoiceModal setShowVoiceModal={setShowVoiceModal} />}
      {/* {showVoiceModal && (
        <VoiceModal setShowVoiceModal={setShowVoiceModal}></VoiceModal>
      )} */}

      {/**红包弹窗 */}
      {redPacketData?.show && (
        <RedPacketModal
          redPacketData={redPacketData}
          setShowRedPacket={setShowRedPacket}></RedPacketModal>
      )}
    </View>
  );
}
