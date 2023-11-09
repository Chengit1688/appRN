import {
  useRef,
  useState,
  useMemo,
  forwardRef,
  useEffect,
  useCallback,
} from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  RefreshControl,
  ViewStyle,
  VirtualizedList,
} from 'react-native';
import {
  View,
  Text,
  Avatar,
  Icon,
  TouchableOpacity,
  RadioButton,
  Assets,
  Image,
} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import moment, {max} from 'moment';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';

import imsdk, {IMSDK} from '@/utils/IMSDK';
import {getMsgContent, formatUrl} from '@/utils/common';
import {RootState} from '@/store';
import {
  updateCurrentMessageList,
  insertCurrentMessageList,
} from '@/store/reducers/conversation';
import HeaderLeft from '@/components/HeaderLeft';
import HeaderRightButton from '@/components/HeaderRight/button';

import HistoryItem from './historyItem';
import ChatText from './chatItem/text';
import ChatImage from './chatItem/image';
import ChatVoice from './chatItem/voice';
import ChatVideo from './chatItem/video';
import ChatFile from './chatItem/file';
import ChatCard from './chatItem/card';
import ChatRedPacket from './chatItem/redPacket';
import ChatTransfer from './chatItem/transfer';
import ChatVoiceCall from './chatItem/voiceCall';
import ChatVideoCall from './chatItem/videoCall';
import ChatQuote from './chatItem/quote';
import ChatCall from './chatItem/chatCall';
import ChatLink from './chatItem/link';

import {DATA, MessageItem, OWNID, TEXT} from '../demo/data';
import {use} from 'i18next';
import FastImage from 'react-native-fast-image';
import React from 'react';
import {Popup, SvgIcon} from '@/components';
import Notification from './notification';
import {Dimensions} from 'react-native';
import {Popover} from '@ant-design/react-native';
// import Operation from './chatItem/operation';

const reDATA = DATA.reverse();

const MSGINTERVAL = 60 * 1; //时间最少间隔多久显示

function Main(
  props: {
    setOptions: ({}: any, flag: boolean) => void;
    quoteContent: any;
    setQuoteContent: (val: any) => void;
    showContact: (uid: string) => void;
    setShowRedPacket: (flag: boolean) => void;
    groupInfo: any;
    // atMemberList: any[];
    // setAtUser: (val: any) => void;
    // mentionOpen: boolean;
  },
  ref: any,
) {
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const setOptions = props.setOptions;
  const quoteContent = props.quoteContent;
  const setQuoteContent = props.setQuoteContent;
  const showContact = props.showContact;
  const setShowRedPacket = props.setShowRedPacket;
  const groupInfo = props.groupInfo;

  // const isGoUserInfo = useMemo(() => {
  //   return props.isClickAvatar;
  // }, [props.isClickAvatar]);
  // const atMemberList = props.atMemberList;
  // const mentionOpen = props.mentionOpen;
  // const setAtUser = props.setAtUser;

  const settingInfo = useSelector<RootState, IMSDK.Conversation>(
    state => state.conversation.settingInfo,
    shallowEqual,
  );

  // 隐藏普通成员不允许加好友
  const isGoUserInfo = useMemo(() => {
    if (
      settingInfo?.role === 'user' &&
      settingInfo?.no_show_normal_member === 1
    ) {
      return true;
    }
    return false;
  }, [settingInfo]);

  const [initedHead, setInitedHead] = useState(false);
  const [groupNotification, setGroupNotification] = useState<any>('');

  const [forwardContent, setForwardContent] = useState(false);
  const [selectContent, setSelectContent] = useState(false);

  const [selecteds, setSelecteds] = useState<{[key: string]: boolean}>({});

  const [showHint, setShowHint] = useState<{[key: string]: boolean}>({});

  const [isAt, setIsAt] = useState(false);

  const currentMessageList = useSelector<RootState, IMSDK.Message[]>(
    state => state.conversation.currentMessageList,
    shallowEqual,
  );

  const currentConversation = useSelector<RootState, IMSDK.Conversation>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );
  const selfInfo = useSelector(
    (state: RootState) => state.user.selfInfo,
    shallowEqual,
  );

  useEffect(() => {
    const fn = async () => {
      const info = await imsdk.comlink.getGroupById(
        currentConversation.group.group_id,
      );
      setGroupNotification(info.data[0].notification);
    };
    if (currentConversation?.type === 2) {
      // setGroupNotification(currentConversation.group?.notification);
      fn();
    }
  }, [currentConversation]);

  const selfFaceUrl = selfInfo.face_url
    ? {uri: formatUrl(selfInfo.face_url), cache: FastImage.cacheControl.web}
    : Assets.imgs.avatar.defalut;

  const msgList = useMemo(() => {
    const arr = currentMessageList?.filter(
      item => item.conversation_id === currentConversation.conversation_id,
    );
    let msgList =
      arr?.filter(msg => ![2, 3, -97, -99].includes(msg.status)) || [];
    return _.uniqBy(msgList, 'client_msg_id');
  }, [currentMessageList]);

  const dataList = useMemo(() => {
    const tempDataList: any = [];
    let obj: any = {};
    msgList.map((msg: any, idx: number) => {
      msg = JSON.parse(JSON.stringify(msg));

      if (obj[`key_${msg.seq || 99999}`]) return;
      obj[`key_${msg.seq || 99999}`] = true;
      const {send_time} = msg;
      const nowDay = moment();
      const msgDay = moment(send_time);
      const nowDayStr = nowDay.format('YYYYMMDD');
      const msgDayStr = msgDay.format('YYYYMMDD');

      let flag = false;
      if (idx > 0) {
        const last_msg = msgList[idx - 1];
        const intervalTime = msgDay.diff(moment(last_msg.send_time), 's');
        // 间隔时间小于预设值不显示
        if (!isNaN(intervalTime) && intervalTime < MSGINTERVAL) {
          flag = true;
        }
      }

      if (flag) {
        msg.format_time = '';
      } else {
        if (nowDayStr === msgDayStr) {
          msg.format_time = moment(send_time).format('HH:mm');
        } else {
          msg.format_time = moment(send_time).format('YYYY-MM-DD HH:mm');
        }
      }

      switch (msg.type) {
        case IMSDK.MessageType.REVOKE:
          if (msg.send_id === selfInfo.user_id) {
            tempDataList.push(msg);
            return;
          }
          if (
            currentConversation?.type === 2 &&
            currentConversation?.group?.role === 'user'
          ) {
            msg.content = '***撤回了一条消息';
            return;
          }
          tempDataList.push(msg);
          break;
        case IMSDK.MessageType.GROUP_ADD_MEMBER_NOTIFY:
          if (currentConversation?.group?.role === 'user') {
            // 只针对普通用户过滤
            if (
              msg?.be_operator_list?.some(
                i => i.be_operator_id === selfInfo.user_id,
              )
            ) {
              msg.content = `${selfInfo.nick_name}通过邀请加入群聊`; // 入群文本消息的替换
            } else {
              msg.content = `***通过邀请加入群聊`;
              return;
            }
          }
          tempDataList.push(msg);
          break;
        case IMSDK.MessageType.GROUP_ONE_UNMUTE_NOTIFY:
          if (currentConversation?.group?.role === 'user') {
            // 只针对普通用户过滤
            if (
              !msg?.be_operator_list?.some(
                i => i.be_operator_id === selfInfo.user_id,
              )
            ) {
              msg.content = `***已解除禁言`; // 入本消息的替换
              return;
            }
          }
          tempDataList.push(msg);
          break;
        case IMSDK.MessageType.GROUP_ONE_MUTE_NOTIFY:
          if (currentConversation?.group?.role === 'user') {
            // 只针对普通用户过滤
            let str = '1小时';
            if (Number(msg.time_type) === 2) {
              str = '24小时';
            } else if (Number(msg.time_type) === 3) {
              str = '永久';
            }
            if (
              !msg?.be_operator_list?.some(
                i => i.be_operator_id === selfInfo.user_id,
              )
            ) {
              msg.content = `***被禁言${str}`; // 入群文本消息的替换
              return;
            }
          }
          tempDataList.push(msg);
          break;
        case IMSDK.MessageType.GROUP_DELETE_NOTIFY:
          if (currentConversation?.group?.role === 'user') {
            // 只针对普通用户过滤
            if (
              !msg?.be_operator_list?.some(
                i => i.be_operator_id === selfInfo.user_id,
              )
            ) {
              msg.content = `***已退出群聊`; // 入群文本消息的替换
              return;
            }
          }
          tempDataList.push(msg);
          break;
        default:
          tempDataList.push(msg);
          break;
      }
    });
    // 因为本本地数据库有时候排序有点乱。所以这里再排序一次
    tempDataList.sort((a: any, b: any) => a.seq - b.seq);
    return tempDataList.reverse();
  }, [msgList, selfInfo]);

  const [currentItem, setCurrentItem] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const $scrollEl = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [listHeight, setListHeight] = useState(0);
  const convRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [scrollToBottom, setScrollToBottom] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const conversation_id = currentConversation?.conversation_id || '';
  const [max_seq, setMaxSeq] = useState(currentConversation?.max_seq || 0);
  const [cardId, setCardId] = useState(null);

  const setQuote = (val: string) => {
    setQuoteContent(val);
  };

  const setActionHeader = (custom: boolean, dataList: any[], ids: string[]) => {
    if (custom || (!custom && initedHead)) {
      setInitedHead(true);
      custom
        ? setOptions(
            {
              headerLeft: () => {
                return (
                  <HeaderLeft
                    onPress={() => {
                      setForwardContent(false);
                      setSelectContent(false);
                      setSelecteds({});
                    }}
                  />
                );
              },
              headerRight: () => {
                return (
                  <View style={{marginRight: pt(8)}}>
                    <HeaderRightButton
                      text={t(`转发`)}
                      onPress={() => {
                        if (!ids.length) {
                          return;
                        }
                        const arr = dataList.filter(item => {
                          return ids.includes(item.msg_id);
                        });

                        setForwardContent(false);
                        setSelectContent(false);
                        setSelecteds({});
                        setTimeout(() => {
                          navigate({
                            name: 'ForwardChat',
                            params: {msgs: arr.reverse()},
                          });
                        }, 0);
                      }}
                    />
                  </View>
                );
              },
            },
            custom,
          )
        : setOptions(
            {
              headerLeft: () => <HeaderLeft />,
              headerRight: () => null,
            },
            custom,
          );
    }
  };

  const showRadio = useMemo(() => {
    const flag = forwardContent || selectContent;
    return flag;
  }, [forwardContent, selectContent]);

  const selectedCount = useMemo(() => {
    return Object.keys(selecteds).length;
  }, [selecteds]);

  useEffect(() => {
    if (showRadio) {
      // setQuote('');
      setQuoteContent('');
    }
    setActionHeader(showRadio, dataList, Object.keys(selecteds));
  }, [showRadio, selectedCount]);

  const renderItem = (props: any) => {
    const {row, idx} = props;
    const renderTime = (row: any) => {
      if (!row.format_time) return null;
      return (
        <View
          center
          style={{
            marginTop: idx === dataList.length - 1 ? pt(34) : pt(0),
            marginBottom: pt(6),
          }}>
          <Text
            style={{
              fontSize: pt(11),
              fontWeight: 'bold',
              color: '#CFD4E1',
            }}>
            {row.format_time}
          </Text>
        </View>
      );
    };

    const renderWelcome = (row: any) => {
      if (row.type === 12) {
        //红包领取
        const con = JSON.parse(row.content);
        return (
          <View
            row
            center
            style={{
              marginTop: pt(10),
              marginBottom: pt(15),
            }}>
            <Image
              assetName="red_packet"
              assetGroup="page.chat"
              style={{
                marginRight: pt(10),
                width: pt(10),
                height: pt(15),
              }}
            />
            <Text
              style={{
                color: 'red',
                marginRight: pt(5),
                fontSize: pt(12),
                fontWeight: 'bold',
              }}>
              {con.receiver_nickname}
            </Text>
            <Text
              style={{
                color: '#555',
                marginRight: pt(5),
                fontSize: pt(12),
                fontWeight: 'bold',
              }}>
              领取了
            </Text>
            <Text
              style={{
                color: 'red',
                marginRight: pt(5),
                fontSize: pt(12),
                fontWeight: 'bold',
              }}>
              {con.sender_nickname}
            </Text>
            <Text>的红包</Text>
            {/* <Text
              style={{
                fontSize: pt(11),
                fontWeight: 'bold',
                color: '#CFD4E1',
              }}></Text> */}
          </View>
        );
      } else {
        return (
          <View
            center
            style={{
              marginTop: pt(2),
              marginBottom: pt(15),
            }}>
            <Text
              style={{
                fontSize: pt(11),
                fontWeight: 'bold',
                color: '#CFD4E1',
              }}>
              {/* {t('你们已成为好友，开始聊天吧')} */}
              {/**兼容旧数据 */}
              {row.content.indexOf('${groupName}') > 0
                ? row.content.replace('${groupName}', '')
                : row.content}
            </Text>
          </View>
        );
      }
    };

    const renderContent = (row: any, isOwn: boolean, nickname: string) => {
      const isGroup = row.conversation_type == 2;
      const {type} = row;
      // console.log(row?.role, '11231');
      let content = null;
      switch (type) {
        case 'image':
        case 3:
          content = (
            <ChatImage
              row={row}
              isOwn={isOwn}
              setForwardContent={flag => {
                setForwardContent(flag);
              }}
            />
          );
          break;
        case 'voice':
        case 4:
          content = <ChatVoice {...row} isOwn={isOwn} />;
          break;
        case 'video':
        case 5:
          content = (
            <ChatVideo
              row={row}
              isOwn={isOwn}
              setForwardContent={flag => {
                setForwardContent(flag);
              }}
            />
          );
          break;
        case 'file':
        case 6:
          content = (
            <ChatFile
              row={row}
              isOwn={isOwn}
              setForwardContent={flag => {
                setForwardContent(flag);
              }}
            />
          );
          break;
        case 'card':
        case 7:
          content = <ChatCard {...row} />;
          break;
        // case 'redPacket':
        //   content = <ChatRedPacket {...row} />;
        //   break;
        case 'transfer':
          content = <ChatTransfer {...row} />;
          break;
        case 400:
          content = <ChatCall {...row} user={selfInfo} />;
          break;
        case 'quote':
        case 9:
          content = <ChatQuote row={row} isOwn={isOwn} />;
          break;
        case 10:
          content = (
            <ChatLink
              row={row}
              isOwn={isOwn}
              showRadio={showRadio}
              setForwardContent={flag => {
                setForwardContent(flag);
              }}
              setQuoteContent={(nickname: string, message: string) => {
                let msg = '';
                if (nickname) {
                  msg = nickname + '：';
                }
                msg += message;
                setQuote(msg);
              }}
              setSelectContent={flag => {
                setSelectContent(flag);
              }}
            />
          );
          break;
        case 11: // 红包
          content = (
            <ChatRedPacket
              row={row}
              isOwn={isOwn}
              isGroup={isGroup}
              groupInfo={groupInfo}
              setShowRedPacket={setShowRedPacket}
            />
          );
          break;
        default:
          content = (
            <ChatText
              row={row}
              isOwn={isOwn}
              showRadio={showRadio}
              setForwardContent={flag => {
                setForwardContent(flag);
              }}
              setQuoteContent={(row: any, message: string) => {
                const {send_nickname} = row;
                let msg = '';
                if (send_nickname) {
                  msg = send_nickname + '：';
                }
                msg += message;

                setQuote({...row, msg});
              }}
              setSelectContent={flag => {
                setSelectContent(flag);
              }}
            />
          );
      }
      return content;
    };

    const renderItem = (row: any) => {
      const id = row.msg_id;
      const isGroup = row.conversation_type == 2;

      // 400 RTC
      if (row.type === 400) {
        const content = JSON.parse(row.content);
        row = {
          ...row,
          content: JSON.parse(row.content),
          send_id: content.operator_id,
          send_nickname: content.operator_nickname,
          send_face_url: content.operator_face_url,
        };
      }
      const isOwn = selfInfo.user_id === row.send_id;

      const nickname = row.send_nickname;
      const avatar = isOwn
        ? selfFaceUrl
        : row.send_face_url
        ? {uri: formatUrl(row.send_face_url)}
        : Assets.imgs.avatar.defalut;

      const viewDiffStyle: ViewStyle = isOwn
        ? {flexDirection: 'row-reverse'}
        : {flexDirection: 'row'};

      let maxWidth = 375 - 58 /**头像 */ - 10; /**边留白 */
      maxWidth = showRadio
        ? maxWidth - (16 /**按钮 */ + 24) /**按钮留白 */
        : maxWidth;

      return (
        <View key={id} row>
          <View
            style={{
              margin: pt(10),
              display: showRadio ? 'flex' : 'none',
            }}>
            <RadioButton
              selected={selecteds[id]}
              onPress={() => {
                let data = {...selecteds};
                if (data[id]) {
                  delete data[id];
                } else {
                  data[id] = true;
                }
                setSelecteds(data);
              }}
              label={''}
              color={selecteds[id] ? '#7581FE' : '#BCBCBC'}
            />
          </View>
          <View
            flex
            centerH
            style={{
              marginBottom: pt(10),
              ...viewDiffStyle,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                !isGoUserInfo && showContact(row);
              }}>
              {/* <Avatar
              {...{
                name: nickname,
                size: pt(38),
                source: avatar,
                containerStyle: {
                  marginLeft: pt(10),
                  marginRight: pt(10),
                },
              }}
            /> */}
              <Image
                style={{
                  width: pt(38),
                  height: pt(38),
                  borderRadius: pt(19),
                  marginLeft: pt(10),
                  marginRight: pt(10),
                }}
                resizeMode="cover"
                source={avatar}
              />
            </TouchableOpacity>

            <View
              style={{
                marginTop: isGroup ? pt(5) : pt(5),
                maxWidth: pt(maxWidth),
              }}>
              {isGroup && !isOwn ? (
                <View row centerV>
                  <Text
                    style={{
                      fontSize: pt(11),

                      color: '#777',
                    }}>
                    {row.send_nickname}
                  </Text>
                  {row.role === 'owner' || row.role === 'admin' ? (
                    <SvgIcon
                      name="owner"
                      size={18}
                      style={{marginLeft: pt(3)}}></SvgIcon>
                  ) : null}
                </View>
              ) : null}
              {renderContent(row, isOwn, nickname)}
            </View>
          </View>
        </View>
      );
    };
    return (
      <View key={idx}>
        {/**单聊 201 欢迎类型  群聊301、302欢迎类型，
         * 102撤回一条消息
         * 303 退出群聊 304设置管理员 305 取消管理员
         * 306 禁言 307解除禁言  308 全体禁言 309取消群体禁言
         * 310 群转让  311 群公告
         * 12 红包领取
         *  */}
        {renderTime(row)}
        {[
          201, 302, 102, 301, 303, 304, 305, 306, 307, 308, 309, 310, 311, 12,
        ].includes(row.type)
          ? renderWelcome(row)
          : renderItem(row)}
      </View>
    );
  };

  const MemoizedComponent = React.memo(renderItem, (pre, next) => {
    return true;
  });

  const onClickUser = useCallback(
    id => {
      if (
        currentConversation.type === 2 &&
        (currentConversation.group.role === 'owner' ||
          currentConversation.group.role === 'admin')
      ) {
        setCurrentId(id);
        setOpen(true);
      }
    },
    [currentConversation],
  );
  const initPageSize = 15;
  const [loading, setLoading] = useState(false);
  const [endStatus, setEndStatus] = useState(false);
  const [list, setList] = useState<any>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: initPageSize,
    total: 0,
  });

  const loadNextPage = useCallback(
    (pageSize, seq, callback) => {
      if (currentConversation && seq > 0) {
        const {type, user, group, conversation_id} = currentConversation;
        // console.log('max_seq=========>', currentConversation, seq)
        const recv_id = type === 1 ? user?.user_id : group?.group_id;
        setIsFetching(true);
        setLoading(true);
        imsdk
          .fetchMessage(
            +currentConversation.max_seq,
            type,
            recv_id,
            seq,
            conversation_id,
            pageSize,
          )
          .then(res => {
            if (!res) return;
            if (convRef?.current === res[0]?.conversation_id) {
              // console.log('loadNextPage===========>', res, convRef.current, res[0].conversation_id)

              const newArr = [...res, ...list];
              setList(newArr);
              if (newArr.length >= +currentConversation.max_seq) {
                setEndStatus(true);
              }
              dispatch(
                insertCurrentMessageList({
                  data: newArr,
                  isHistory: true,
                }),
              );
              if (res && res[0]?.seq > 1) {
                setHasNextPage(true);
              } else {
                setHasNextPage(false);
              }
              // setScrollToBottom(false)
              setTimeout(() => {
                setIsFetching(false);
                setLoading(false);
                //   listRef.current.scrollTo({
                //     index: (res && res.length) || null,
                //     align: 'bottom',
                //   });
              }, 1);
            }
            callback && callback(res);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [currentConversation],
  );

  const getMessageList = (max_seq: number) => {
    if (max_seq > 0) {
      loadNextPage(pagination.pageSize, max_seq, res => {
        let friendMaxSeq = 0;
        res.forEach(item => {
          if (
            item.send_id &&
            item.send_id !== selfInfo.user_id &&
            (item.type < 100 || item.type === 311 || item.type === 400)
          ) {
            friendMaxSeq = friendMaxSeq > item.seq ? friendMaxSeq : item.seq;
          }
        });
        if (friendMaxSeq) {
          imsdk.conversation_ack_seq(
            currentConversation.type,
            conversation_id,
            friendMaxSeq,
          );
        }
      });
    }
  };
  const handleLoadMore = () => {
    if (!loading && !endStatus) {
      const maxNums = +max_seq - initPageSize;
      getMessageList(+maxNums);
      setMaxSeq(maxNums);
    }
  };

  useEffect(() => {
    setList([]);
    convRef.current = currentConversation?.conversation_id;
    const maxSeq = currentConversation?.max_seq;
    getMessageList(+maxSeq);
  }, [conversation_id]);

  // console.log('dataList====>>>',dataList)

  return (
    <View
      flex
      style={{
        height: '100%',
      }}>
      {/**因为是倒着的 所以用Footer*/}
      {dataList.length > 0 && (
        <VirtualizedList
          inverted
          initialNumToRender={15}
          data={dataList}
          ListFooterComponent={() => {
            return loading ? <ActivityIndicator animating /> : null;
          }}
          // onScroll={handleLoadMore}
          onEndReached={handleLoadMore}
          renderItem={
            ({item, index}) => {
              return (
                <MemoizedComponent row={item} idx={index}></MemoizedComponent>
              );
            }
            // <HistoryItem
            // 	source={item}
            // 	index={index}
            // 	showRadio={showRadio}
            // 	selecteds={selecteds}
            // 	setSelecteds={(data: {[key: string]: boolean;})=>setSelecteds(data)}
            // 	setForwardContent={(data)=>setForwardContent(data)}
            // 	setQuoteContent={(data)=>setQuoteContent(data)}
            // 	setSelectContent={(data)=>setSelectContent(data)}

            // />
          }
          keyExtractor={(item, idx) => item.seq || idx.toString()}
          getItemCount={() => dataList.length}
          getItem={(data: any, idx: number) => {
            return dataList[idx];
          }}
          ref={ref}
          onViewableItemsChanged={() => {
            //listRef.current?.scrollToEnd({animated: false});
          }}
        />
      )}
      {/**群公告 */}
      {groupNotification ? (
        <Notification groupNotification={groupNotification}></Notification>
      ) : null}
      <Text style={{color: 'red'}}>{quoteContent}</Text>
      {/* {quoteContent ? (
        <View
          row
          spread
          style={{
            position: 'absolute',
            left: pt(16),
            right: pt(16),
            bottom: pt(10),
            padding: pt(10),
            borderRadius: pt(7),
            backgroundColor: '#F6F7FB',
            zIndex: 999,
          }}>
          <Text flex numberOfLines={2}>
            {quoteContent.msg}
          </Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setQuote('');
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
      ) : null} */}
    </View>
  );
}

const MainComponent = React.memo(forwardRef(Main), (pre, next) => {
  return true;
});
export default MainComponent;
