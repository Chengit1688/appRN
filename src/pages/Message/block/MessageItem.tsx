import {useMemo, useEffect, useCallback,Component, ReactNode,PureComponent} from 'react';
import {
  Assets,
  ListItem,
  View,
  Text,
  Drawer,
  Colors,
} from 'react-native-ui-lib';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import {Modal} from '@ant-design/react-native';

import {pt} from '@/utils/dimension';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {formatUrl} from '@/utils/common';
import {RootState} from '@/store';
import {updateConversationItem} from '@/store/reducers/conversation';
import MessageAvatar from '@/components/MessageAvatar';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {SvgIcon} from '@/components';
export default function MessageItem({
  conv,
  onPressItem,
}: {
  conv: any;
  onPressItem: (conv: IMSDK.Conversation) => void;
}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const systemConfig: any = useSelector<RootState>(
    state => state.global.systemConfig,
    shallowEqual,
  );
  const USER = useSelector((state: RootState) => state.user);
  const selfInfo = useMemo(() => USER.selfInfo, [USER]);
  const todayStart = dayjs().startOf('date').unix() * 1000;
  const yesterday = dayjs().subtract(1, 'days');
  const yesterdayStart = yesterday.startOf('date').unix() * 1000;
  const firstDayOfYear = dayjs().startOf('year').unix() * 1000;
  const group = conv?.group;
  let time = '';
  if (conv.msg?.send_time) {
    if (conv.msg.send_time >= todayStart) {
      time = dayjs(conv.msg.send_time).format('HH:mm');
    } else if (
      conv.msg.send_time >= yesterdayStart &&
      conv.msg.send_time < todayStart
    ) {
      time = '昨天';
    } else if (
      conv.msg.send_time >= firstDayOfYear &&
      conv.msg.send_time < yesterdayStart
    ) {
      time = dayjs(conv.msg.send_time).format('MM/DD');
    } else {
      time = dayjs(conv.msg.send_time).format('YYYY/MM/DD');
    }
  }

  useEffect(() => {
    if (conv.type === 2 && !conv.group) {
      imsdk.getGroupProfile(conv.conversation_id).then(res => {
        dispatch(
          updateConversationItem({
            data: {
              conversation_id: conv.conversation_id,
              group: res,
            },
          }),
        );
      });
    } else if (conv.type === 1 && !conv.user) {
      const friend_id = conv.conversation_id
        .replace(`${selfInfo.user_id}`, '')
        .replace('_', '');
      imsdk.getFriendProfile(friend_id).then(res => {
        dispatch(
          updateConversationItem({
            data: {
              conversation_id: conv.conversation_id,
              user: res,
            },
          }),
        );
      });
    }
  }, [conv]);

  const getConvMsgContent = msg => {
    try {
      if (!msg) return;
      const content = JSON.parse(msg.content);

      // console.log(content, msg.content, 'content=====>');
      switch (msg.type) {
        case 1:
        case 2:
        case 9:
        case 10:
          if (typeof content.text !== 'string') {
            // todo移除脏数据
            return '';
          }
          if (content.at_info?.length) {
            content.at_info?.forEach(i => {
              content.text = content.text?.replace(
                `@${i.user_id}`,
                `@${i.group_nick_name}`,
              );
            });
          }
          return content.text;
        case 3:
          return '[图片]';
        case 4:
          return '[语音]';
        case 5:
          return '[视频]';
        case 6:
          return '[文件]';
        case 7:
          return '[名片]';
        case 11:
            return '[红包]';
        case 12:
            return '[红包领取]';
        default:
          return JSON.stringify(content);
      }
    } catch (e) {
      return JSON.stringify(e);
    }
  };

  const getSysMsgContent = msg => {
    let content = msg?.content,
      be_operator_list = msg?.be_operator_list;
    if (msg) {
      switch (msg.type) {
        case IMSDK.MessageType.GROUP_CREATE_NOTIFY:
          content = content.replace('${groupName}', group.name);
          break;
        case IMSDK.MessageType.REVOKE:
        case 102:
          // content = '';

          // if (systemConfig.is_show_revoke == 1) {
          //   if (conv.type === 2 && group?.role === 'user') {
          //     // content = '***撤回了一条消息'
          //     content = '';
          //   }
          //   if (conv.msg?.send_id === selfInfo.user_id) {
          //     content = '你撤回了一条消息';
          //   }
          // }
          break;
        case 400:
          let msg1 = isJSON(content) ? JSON.parse(content) : content;
          if (JSON.parse(msg1.content).rtc_type == 1) {
            content = '[语音通话]';
          }
          if (JSON.parse(msg1.content).rtc_type == 2) {
            content = '[视频通话]';
          }
          break;
        case IMSDK.MessageType.GROUP_ADD_MEMBER_NOTIFY:
          if (group?.role === 'user') {
            // 只针对普通用户过滤
            if (
              be_operator_list?.some(
                item => item.be_operator_id === selfInfo.user_id,
              )
            ) {
              content = `${selfInfo.nick_name}通过邀请加入群聊`; // 入群文本消息的替换
            } else {
              // content = '***通过邀请加入群聊'
              content = '';
            }
          }
          break;
        case IMSDK.MessageType.GROUP_ONE_UNMUTE_NOTIFY:
          if (group?.role === 'user') {
            // 只针对普通用户过滤
            if (
              !be_operator_list?.some(
                item => item.be_operator_id === selfInfo.user_id,
              )
            ) {
              // content = '***已解除禁言' // 解除禁言文本消息的替换
              content = '';
            }
          }
          break;
        case IMSDK.MessageType.GROUP_ONE_MUTE_NOTIFY:
          if (group?.role === 'user') {
            // 只针对普通用户过滤
            let str = '1小时';
            if (Number(msg.time_type) === 2) {
              str = '24小时';
            } else if (Number(msg.time_type) === 3) {
              str = '永久';
            }
            if (
              !be_operator_list?.some(
                item => item.be_operator_id === selfInfo.user_id,
              )
            ) {
              // content = `***被禁言${str}`  // 禁言文本消息的替换
              content = '';
            }
          }
          break;
        case IMSDK.MessageType.GROUP_DELETE_NOTIFY:
          if (group?.role === 'user') {
            // 只针对普通用户过滤
            if (
              !be_operator_list?.some(
                item => item.be_operator_id === selfInfo.user_id,
              )
            ) {
              // content = '***已退出群聊' // 退出文本消息的替换
              content = '';
            }
          }
          break;
        default:
          break;
      }
    }
    return content;
  };

  // console.log('conv.is_topchat=======>', conv.is_topchat)
  function isJSON(str) {
    if (!str) {
      return false;
    }
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str);
        if (typeof obj == 'object' && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
  }
  const info =
    conv.type === 1 ? conv.user || {} : conv.type === 2 ? conv.group || {} : {};
  //console.log('info=======>', info);
  const name = conv.type === 1 ? info?.remark || info?.nick_name : info?.name;
  const avatar = info?.face_url
    ? {uri: formatUrl(info.face_url), cache: FastImage.cacheControl.web}
    : conv.type === 1
    ? Assets.imgs.avatar.defalut
    : Assets.imgs.avatar.group;

  const message =
    conv.msg?.type < 100
      ? getConvMsgContent(conv.msg)
      : getSysMsgContent(conv.msg);

  const status =
    conv.type === 1 ? (conv.user?.online ? 'online' : 'offline') : '';

  const topConv = (conversation: IMSDK.Conversation) => {
    imsdk.topConversationList(conversation).then(res => {
      // setPopVisibleIndex(-1)
    });
  };
  const muteConv = (conversation: any) => {
    imsdk.muteConversation(conversation).then(res => {
      // setPopVisibleIndex(-1)
    });
  };
  const deleteConv = (conversation_id: string) => {
    //  setPopVisibleIndex(-1);
    // setIsModalOpen(true);
    // setCurrentConvId(conversation_id);
    Modal.alert(t('提示'), t('是否删除此会话，删除后消息记录也会一同删除'), [
      {
        text: '取消',
        onPress: () => {},
      },
      {
        text: '删除',
        onPress: () => {
          imsdk.deleteConversation(conversation_id).then(res => {});
          imsdk.modifyMessageStatus(conversation_id);
        },
        style: {
          color: Colors.red30,
        },
      },
    ]);
  };
  console.log('renderFunction')
  return (
    <Drawer
      itemsMinWidth={pt(60)}
      rightItems={[
        {
          text: conv.is_topchat == 1 ? '取消置顶' : '置顶',
          background: Colors.gray30,
          onPress: () => {
            topConv(conv);
          },
        },
        {
          text: conv.is_disturb == 1 ? '取消免打扰' : '免打扰',
          background: Colors.blue30,
          onPress: () => {
            muteConv(conv);
          },
        },
        {
          text: '删除',
          background: Colors.red30,
          onPress: () => {
            deleteConv(conv.conversation_id);
          },
        },
      ]}>
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(70)}
        style={{
          backgroundColor: Colors.white,
        }}
        onPress={() => {
          onPressItem(conv);
        }}>
        <ListItem.Part left containerStyle={{marginLeft: pt(25)}}>
          <MessageAvatar
            {...{
              name,
              avatar,
              //status,
            }}
          />
        </ListItem.Part>

        <ListItem.Part middle row>
          <ListItem.Part
            middle
            column
            containerStyle={{
              // height: pt(70),
              marginLeft: pt(15.5),
              marginRight: pt(15.5),
            }}>
            <Text
              style={{
                marginBottom: pt(13),
                color: '#222222',
                fontSize: pt(14),
                fontWeight: 'bold',
              }}>
              {name}
            </Text>
            <View row>
              {conv.type === 2 && conv.at ? (
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{color: 'red', marginRight: pt(5), fontSize: pt(11)}}>
                  [有人@我]
                </Text>
              ) : null}

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{color: '#959595', fontSize: pt(11)}}>
                {message}
              </Text>
            </View>
          </ListItem.Part>
          <ListItem.Part
            containerStyle={{
              marginRight: pt(25),
              flexDirection: 'column',
            }}>
            <Text style={{color: '#999999', fontSize: pt(12)}}>{time}</Text>
            {conv.unread_count > 0 && conv.is_disturb !== 1 ? (
              <View
                center
                style={{
                  width: pt(22),
                  height: pt(22),
                  borderRadius: pt(50),
                  backgroundColor: '#7581FF',
                  marginTop: pt(10),
                }}>
                <Text style={{fontSize: pt(12), color: '#ffffff'}}>
                  {conv.unread_count > 99 ? '99+' : conv.unread_count}
                </Text>
              </View>
            ) : null}
            {conv.is_disturb == 1 ? (
              <SvgIcon
                name="notificationOff"
                size={15}
                style={{
                  width: pt(15),
                  height: pt(15),
                  marginTop: pt(10),
                }}></SvgIcon>
            ) : null}
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    </Drawer>
  );
}

interface NewMessageProps{
  onPressItem:(conv: IMSDK.Conversation) => void,
  selfInfo:any,
  dispatch:any,
  conv:any,
  t:any
}

export class NewMessageItem extends Component<NewMessageProps> {
  selfInfo: any;
  group: any;
  time: string;
  constructor(props:any){
    super(props)
    // const USER = useSelector((state: RootState) => state.user);
    this.selfInfo = props.selfInfo;
    const todayStart = dayjs().startOf('date').unix() * 1000;
    const yesterday = dayjs().subtract(1, 'days');
    const yesterdayStart = yesterday.startOf('date').unix() * 1000;
    const firstDayOfYear = dayjs().startOf('year').unix() * 1000;
    this.group = props.conv?.group;
    this.time = '';
    if (props.conv.msg?.send_time) {
      if (props.conv.msg.send_time >= todayStart) {
        this.time = dayjs(props.conv.msg.send_time).format('HH:mm');
      } else if (
        props.conv.msg.send_time >= yesterdayStart &&
        props.conv.msg.send_time < todayStart
      ) {
        this.time = '昨天';
      } else if (
        props.conv.msg.send_time >= firstDayOfYear &&
        props.conv.msg.send_time < yesterdayStart
      ) {
        this.time = dayjs(props.conv.msg.send_time).format('MM/DD');
      } else {
        this.time = dayjs(props.conv.msg.send_time).format('YYYY/MM/DD');
      }
    }
  }

  componentDidMount(): void {
    if (this.props.conv.type === 2 && !this.props.conv.group) {
      imsdk.getGroupProfile(this.props.conv.conversation_id).then(res => {
        this.props.dispatch(
          updateConversationItem({
            data: {
              conversation_id: this.props.conv.conversation_id,
              group: res,
            },
          }),
        );
      });
    } else if (this.props.conv.type === 1 && !this.props.conv.user) {
      const friend_id = this.props.conv.conversation_id
        .replace(`${this.selfInfo.user_id}`, '')
        .replace('_', '');
      imsdk.getFriendProfile(friend_id).then(res => {
        this.props.dispatch(
          updateConversationItem({
            data: {
              conversation_id: this.props.conv.conversation_id,
              user: res,
            },
          }),
        );
      });
    }
  }

  getConvMsgContent = msg => {
    try {
      if (!msg) return;
      const content = JSON.parse(msg.content);

      // console.log(content, msg.content, 'content=====>');
      switch (msg.type) {
        case 1:
        case 2:
        case 9:
        case 10:
          if (typeof content.text !== 'string') {
            // todo移除脏数据
            return '';
          }
          if (content.at_info?.length) {
            content.at_info?.forEach(i => {
              content.text = content.text?.replace(
                `@${i.user_id}`,
                `@${i.group_nick_name}`,
              );
            });
          }
          return content.text;
        case 3:
          return '[图片]';
        case 4:
          return '[语音]';
        case 5:
          return '[视频]';
        case 6:
          return '[文件]';
        case 7:
          return '[名片]';

        default:
          return JSON.stringify(content);
      }
    } catch (e) {
      return JSON.stringify(e);
    }
  };

  getSysMsgContent = msg => {
    let content = msg?.content,
      be_operator_list = msg?.be_operator_list;
    if (msg) {
      switch (msg.type) {
        case IMSDK.MessageType.GROUP_CREATE_NOTIFY:
          content = content.replace('${groupName}', group.name);
          break;
        case IMSDK.MessageType.REVOKE:
        case 102:
          // content = '';

          // if (systemConfig.is_show_revoke == 1) {
          //   if (conv.type === 2 && group?.role === 'user') {
          //     // content = '***撤回了一条消息'
          //     content = '';
          //   }
          //   if (conv.msg?.send_id === selfInfo.user_id) {
          //     content = '你撤回了一条消息';
          //   }
          // }
          break;
        case 400:
          let msg1 = this.isJSON(content) ? JSON.parse(content) : content;
          if (JSON.parse(msg1.content).rtc_type == 1) {
            content = '[语音通话]';
          }
          if (JSON.parse(msg1.content).rtc_type == 2) {
            content = '[视频通话]';
          }
          break;
        case IMSDK.MessageType.GROUP_ADD_MEMBER_NOTIFY:
          if (this.group?.role === 'user') {
            // 只针对普通用户过滤
            if (
              be_operator_list?.some(
                item => item.be_operator_id === this.selfInfo.user_id,
              )
            ) {
              content = `${this.selfInfo.nick_name}通过邀请加入群聊`; // 入群文本消息的替换
            } else {
              // content = '***通过邀请加入群聊'
              content = '';
            }
          }
          break;
        case IMSDK.MessageType.GROUP_ONE_UNMUTE_NOTIFY:
          if (this.group?.role === 'user') {
            // 只针对普通用户过滤
            if (
              !be_operator_list?.some(
                item => item.be_operator_id === this.selfInfo.user_id,
              )
            ) {
              // content = '***已解除禁言' // 解除禁言文本消息的替换
              content = '';
            }
          }
          break;
        case IMSDK.MessageType.GROUP_ONE_MUTE_NOTIFY:
          if (this.group?.role === 'user') {
            // 只针对普通用户过滤
            let str = '1小时';
            if (Number(msg.time_type) === 2) {
              str = '24小时';
            } else if (Number(msg.time_type) === 3) {
              str = '永久';
            }
            if (
              !be_operator_list?.some(
                item => item.be_operator_id === this.selfInfo.user_id,
              )
            ) {
              // content = `***被禁言${str}`  // 禁言文本消息的替换
              content = '';
            }
          }
          break;
        case IMSDK.MessageType.GROUP_DELETE_NOTIFY:
          if (this.group?.role === 'user') {
            // 只针对普通用户过滤
            if (
              !be_operator_list?.some(
                item => item.be_operator_id === this.selfInfo.user_id,
              )
            ) {
              // content = '***已退出群聊' // 退出文本消息的替换
              content = '';
            }
          }
          break;
        default:
          break;
      }
    }
    return content;
  };

  // console.log('conv.is_topchat=======>', conv.is_topchat)
  isJSON = (str)=> {
    if (!str) {
      return false;
    }
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str);
        if (typeof obj == 'object' && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
  }

  

  topConv = (conversation: IMSDK.Conversation) => {
    imsdk.topConversationList(conversation).then(res => {
      // setPopVisibleIndex(-1)
    });
  };
  muteConv = (conversation: any) => {
    imsdk.muteConversation(conversation).then(res => {
      // setPopVisibleIndex(-1)
    });
  };
  deleteConv = (conversation_id: string) => {
    //  setPopVisibleIndex(-1);
    // setIsModalOpen(true);
    // setCurrentConvId(conversation_id);
    Modal.alert(this.props.t('提示'), this.props.t('是否删除此会话，删除后消息记录也会一同删除'), [
      {
        text: '取消',
        onPress: () => {},
      },
      {
        text: '删除',
        onPress: () => {
          imsdk.deleteConversation(conversation_id).then(res => {});
          imsdk.modifyMessageStatus(conversation_id);
        },
        style: {
          color: Colors.red30,
        },
      },
    ]);
  };

  shouldComponentUpdate(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean {
    console.log('llllll123')
    console.log(nextProps.conv)
    console.log(this.props.conv)
    if(JSON.stringify(nextProps.conv) == JSON.stringify(this.props.conv)){
      console.log('llllll123222')
      return false
    }else{
      console.log('llllll123333')
      return true
    }
  }

  render(): ReactNode {
    console.log('render')
   let info =
    this.props.conv.type === 1 ? this.props.conv.user || {} : this.props.conv.type === 2 ? this.props.conv.group || {} : {};
    //console.log('info=======>', info);
   let name = this.props.conv.type === 1 ? info?.remark || info?.nick_name : info?.name;
   let avatar = info?.face_url
      ? {uri: formatUrl(info.face_url), cache: FastImage.cacheControl.web}
      : this.props.conv.type === 1
      ? Assets.imgs.avatar.defalut
      : Assets.imgs.avatar.group;

   let message =
    this.props.conv.msg?.type < 100
        ? this.getConvMsgContent(this.props.conv.msg)
        : this.getSysMsgContent(this.props.conv.msg);

   let status =
    this.props.conv.type === 1 ? (this.props.conv.user?.online ? 'online' : 'offline') : '';
    return(
      <Drawer
      itemsMinWidth={pt(60)}
      rightItems={[
        {
          text: this.props.conv.is_topchat == 1 ? '取消置顶' : '置顶',
          background: Colors.gray30,
          onPress: () => {
            this.topConv(this.props.conv);
          },
        },
        {
          text: this.props.conv.is_disturb == 1 ? '取消免打扰' : '免打扰',
          background: Colors.blue30,
          onPress: () => {
            this.muteConv(this.props.conv);
          },
        },
        {
          text: '删除',
          background: Colors.red30,
          onPress: () => {
            this.deleteConv(this.props.conv.conversation_id);
          },
        },
      ]}>
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(70)}
        style={{
          backgroundColor: Colors.white,
        }}
        onPress={() => {
          this.props.onPressItem(this.props.conv);
        }}>
        <ListItem.Part left containerStyle={{marginLeft: pt(25)}}>
          <MessageAvatar
            {...{
              name,
              avatar,
              //status,
            }}
          />
        </ListItem.Part>

        <ListItem.Part middle row>
          <ListItem.Part
            middle
            column
            containerStyle={{
              // height: pt(70),
              marginLeft: pt(15.5),
              marginRight: pt(15.5),
            }}>
            <Text
              style={{
                marginBottom: pt(13),
                color: '#222222',
                fontSize: pt(14),
                fontWeight: 'bold',
              }}>
              {name}
            </Text>
            <View row>
              {this.props.conv.type === 2 && this.props.conv.at ? (
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{color: 'red', marginRight: pt(5), fontSize: pt(11)}}>
                  [有人@我]
                </Text>
              ) : null}

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: message === '[红包]' ? 'red' : '#959595',
                  fontSize: pt(11),
                }}>
                {message}
              </Text>
            </View>
          </ListItem.Part>
          <ListItem.Part
            containerStyle={{
              marginRight: pt(25),
              flexDirection: 'column',
            }}>
            <Text style={{color: '#999999', fontSize: pt(12)}}>{this.time}</Text>
            {this.props.conv.unread_count > 0 && this.props.conv.is_disturb !== 1 ? (
              <View
                center
                style={{
                  width: pt(22),
                  height: pt(22),
                  borderRadius: pt(50),
                  backgroundColor: '#7581FF',
                  marginTop: pt(10),
                }}>
                <Text style={{fontSize: pt(12), color: '#ffffff'}}>
                  {this.props.conv.unread_count > 99 ? '99+' : this.props.conv.unread_count}
                </Text>
              </View>
            ) : null}
            {this.props.conv.is_disturb == 1 ? (
              <SvgIcon
                name="notificationOff"
                size={15}
                style={{
                  width: pt(15),
                  height: pt(15),
                  marginTop: pt(10),
                }}></SvgIcon>
            ) : null}
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    </Drawer>
    )
  }
}

