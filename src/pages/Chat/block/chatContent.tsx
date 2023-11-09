import React, {useState, useRef, useEffect, useMemo} from 'react';
import {ViewStyle} from 'react-native';
import {
  View,
  Text,
  Avatar,
  Icon,
  TouchableOpacity,
  RadioButton,
  Assets,
} from 'react-native-ui-lib';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import {pt} from '@/utils/dimension';
import {RootState} from '@/store';
import {FullUserItem} from '@/store/types/user';

import {getMsgContent, formatUrl} from '@/utils/common';

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

import {copyTextToClipboard} from '@/utils/common';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import axios from 'axios';
function ChatMessage(props) {
  const {
    isMine = false,
    content = '',
    type,
    send_face_url,
    send_nickname,
    send_id,
    status,
    client_msg_id,
    msgUserRole,
    selfRole,
    seq,
    domId,
    onClickUser,
    memberList,
    setIsModalOpen,
    setCurrentItem,
    progress,

    showRadio,
    selecteds,
    setSelecteds,
  } = props;

  const selfInfo = useSelector<RootState, FullUserItem>(
    state => state.user.selfInfo,
    shallowEqual,
  );
  const currentConversation =
    useSelector<RootState, IMSDK.Conversation>(
      state => state.conversation.currentConversation,
      shallowEqual,
    ) ?? {};
  const settingInfo = useSelector<RootState, IMSDK.Conversation>(
    state => state.conversation.settingInfo,
    shallowEqual,
  );
  const systemConfig = useSelector<RootState>(
    state => state.global.systemConfig,
    shallowEqual,
  );
  const muteUserList = settingInfo?.muteUserList;
  const is_open_admin_icon = settingInfo?.is_open_admin_icon;
  const [popVisible, setPopVisible] = useState(false);
  const $container = useRef<HTMLDivElement>(null);
  const {group, read_seq} = currentConversation;
  const convType = currentConversation?.type;
  const revoke_time = systemConfig?.revoke_time;
  const is_privilege = selfInfo?.is_privilege;
  const revokeTimer = useRef<any>(null);
  const localTime = useRef<any>(null);
  const getContent = () => {
    switch (type) {
      case 3:
        return (
          <PicContent
            read_seq={read_seq}
            seq={seq}
            send_time={props.send_time}
            content={content}
            isMine={isMine}
            type={type}
          />
        );
      case 4:
        return (
          <Audio
            read_seq={read_seq}
            seq={seq}
            send_time={props.send_time}
            client_msg_id={client_msg_id}
            content={content}
            type={type}
            isMine={isMine}
          />
        );

      case 5:
        return (
          <VideoContent
            read_seq={read_seq}
            seq={seq}
            send_time={props.send_time}
            content={content}
            isMine={isMine}
            type={type}
          />
        );
      case 6:
        return (
          <FileContent
            isMine={isMine}
            read_seq={read_seq}
            seq={seq}
            send_time={props.send_time}
            content={content}
            type={type}
          />
        );
      case 9:
        return (
          <QuoteContent
            read_seq={read_seq}
            seq={seq}
            isMine={isMine}
            send_time={props.send_time}
            content={content}
            type={type}
          />
        );
      case 7:
        return (
          <CardMessage
            openAddContact={props.openAddContact}
            send_time={props.send_time}
            isMine={isMine}
            content={content}
            type={type}
          />
        );
      case 400:
        return (
          <CallMessage
            send_time={props.send_time}
            isMine={isMine}
            content={content}
            type={type}
          />
        );
      default:
        return (
          <MessageBubble
            isMine={isMine}
            send_time={props.send_time}
            read_seq={read_seq}
            seq={seq}>
            <div className={style.messageStyle}>
              <div className={isMine ? 'mine' : 'other'}>
                <div dangerouslySetInnerHTML={{__html: children}}></div>
              </div>
            </div>
          </MessageBubble>
        );
    }
  };

  useEffect(() => {
    if (revokeTimer.current) {
      clearTimeout(revokeTimer.current);
    }
    function tick() {
      localTime.current = Date.now();
      let timeLeft = localTime.current - props.send_time < revoke_time * 1000;
      if (timeLeft) {
        revokeTimer.current = setTimeout(() => {
          tick();
        }, 1000);
      }
    }

    if (revoke_time && isMine) {
      tick();
    }
    return function () {
      if (revokeTimer.current) {
        clearTimeout(revokeTimer.current);
      }
    };
  }, [revoke_time, props.send_time]);

  const copyText = content => {
    let text = content.text;
    if (content.at_info) {
      content.at_info.map(i => {
        text = text.replace(`@${i.user_id}`, '');
      });
      text = text.trim();
    }
    setPopVisible(false);
    message.success('复制成功');
    copyTextToClipboard(text);
  };

  const copyimage = async content => {
    let images: any = document.getElementsByClassName('ant-image-img');
    let tagImg = null;
    try {
      for (let i = 0; i < images.length; i++) {
        if (images[i].currentSrc.indexOf(content.image_info.file_name) > -1) {
          tagImg = images[i];
        }
      }

      let res: any = await axios.get(tagImg.currentSrc, {
        responseType: 'blob',
      });
      let blob = res.data;
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setPopVisible(false);
      message.success('复制成功');
    } catch (e) {
      message.error('复制失败');
    }
  };
  const saveImg = async content => {
    let images: any = document.getElementsByClassName('ant-image-img');
    let tagImg = null;
    try {
      for (let i = 0; i < images.length; i++) {
        if (images[i].currentSrc.indexOf(content.image_info.file_name) > -1) {
          tagImg = images[i];
        }
      }

      let res: any = await axios.get(tagImg.currentSrc, {
        responseType: 'blob',
      });
      let blob = res.data;
      //将请求的blob数据转为可下载的url地址
      let url = URL.createObjectURL(blob);
      // 创建一个下载标签<a>
      const aLink = document.createElement('a');
      aLink.href = url;
      // 2.直接使用自定义文件名,设置下载文件名称
      aLink.setAttribute('download', content.image_info.file_name);
      document.body.appendChild(aLink);
      // 模拟点击下载
      aLink.click();
      // 移除改下载标签
      document.body.removeChild(aLink);

      setPopVisible(false);
      message.success('保存成功');
    } catch (e) {
      message.error('保存失败');
    }
  };
  const handleShareText = msg => {
    setIsModalOpen(true);
    setPopVisible(false);
    setCurrentItem(msg);
  };

  const handleRevertMsg = () => {
    setPopVisible(false);
    imsdk.revokeMessage([props], currentConversation);
  };

  const handleReply = (msg: IMSDK.Message) => {
    setPopVisible(false);
    imsdk.emit(IMSDK.Event.MESSAGE_REPLIED, msg);
  };

  const showRevokeBtn = useMemo(() => {
    // console.log('revoke_time=======>', revoke_time, localTime.current, props.send_time)
    if (convType === 1 && isMine) {
      // 私聊 -> 我发送的消息
      if (is_privilege === 1) return true; // 特权用户允许撤回自己的消息
      if (revoke_time === 0) return true; // revoke_time 0，不受限制，一直有撤回功能
      if (localTime.current - props.send_time < revoke_time * 1000) {
        return true;
      }
    } else if (convType === 2) {
      // 群聊
      if (selfRole === 'owner' || selfRole === 'admin') return true; // 群主/管理员 可以撤回自己发的消息；也可撤回别人发的消息。没有时间限制
      if (selfRole === 'user' && isMine) {
        // 普通用户 -> 我发送的消息
        if (revoke_time === 0) return true; // revoke_time 0，不受限制，一直有撤回功能
        if (localTime.current - props.send_time < revoke_time * 1000) {
          return true;
        }
      }
    }
  }, [convType, is_privilege, selfRole, revoke_time, localTime.current]);

  const PopContent = (msg: IMSDK.Message) => (
    <div onClick={() => null} className="menu_list">
      {type === 1 || type === 9 ? (
        <div
          className="item"
          onClick={() => copyText(JSON.parse(content as string) || '')}>
          <img src={copyIcon} />
          <span>复制</span>
        </div>
      ) : null}
      {type === 3 ? (
        <div
          className="item"
          onClick={() => copyimage(JSON.parse(content as string) || '')}>
          <img src={copyIcon} />
          <span>复制</span>
        </div>
      ) : null}
      {type === 3 ? (
        <div
          className="item"
          onClick={() => saveImg(JSON.parse(content as string) || '')}>
          <img src={copyIcon} />
          <span>保存</span>
        </div>
      ) : null}
      {isMine ? null : (
        <div className="item" onClick={() => handleReply(msg)}>
          <img src={chatIcon} />
          <span>回复</span>
        </div>
      )}
      {
        <div className="item" onClick={() => handleShareText(msg)}>
          <img src={shareIcon} />
          <span>转发</span>
        </div>
      }
      {showRevokeBtn ? (
        <div className="item" onClick={() => handleRevertMsg()}>
          <img src={previousIcon} />
          <span>撤回</span>
        </div>
      ) : null}
    </div>
  );

  const showPopover = useMemo(() => {
    if ([1, 2, 3, 4, 5, 6, 7, 9].includes(type)) {
      // 6
      if (isMine && [2, 3, 4, 5, 7].includes(type) && !showRevokeBtn) {
        return false;
      }
      return true;
    }
    return false;
  }, [showRevokeBtn]);

  const getItems = useMemo(() => {
    // console.log('getItems=====>', isMine, selfRole)
    if (isMine) return [];
    const index = memberList.findIndex(i => {
      const id = i.user ? i.user.user_id : i.user_id;
      return id === send_id;
    }); //判断当前普通用户是否还在群内
    if (index === -1) return [];
    let dropList = [
      {
        label: '@他',
        key: '1',
        onClick: () => {
          imsdk.emit(IMSDK.Event.AT_USER, `${send_id}%____%${send_nickname}`);
        },
      },
    ];
    const isMute = muteUserList?.findIndex(i => i.user_id === send_id);
    if (msgUserRole === 'user' && selfRole != 'user') {
      dropList = dropList.concat(
        [
          {
            label: isMute > -1 ? '取消禁言' : '禁言用户',
            key: '2',
            ...(isMute > -1
              ? {}
              : {
                  children: [
                    {
                      label: '1小时',
                      key: 3600,
                    },
                    {
                      label: '24小时',
                      key: 3600 * 24,
                    },
                    {
                      label: '永久',
                      key: 3600 * 24 * 365,
                    },
                  ],
                }),
            onClick: ({key}) => {
              imsdk.setGroupMemberMuteTime({
                group_id: group.group_id,
                user_id: send_id,
                mute_sec: key === '2' ? 0 : +key,
              });
            },
          },
        ],
        [
          {
            label: '踢出群聊',
            key: '3',
            onClick: () => {
              imsdk
                .removeGroupMember({
                  group_id: group.group_id,
                  user_id_list: [send_id],
                })
                .then(res => {
                  message.success('移除成功');
                  imsdk.emit(IMSDK.Event.GROUP_PANEL_UPDATE, false);
                });
            },
          },
        ],
      );
    }
    return dropList;
  }, [selfRole, send_id, muteUserList, msgUserRole, memberList]);

  let children = getMsgContent({content, type});
  if (typeof children !== 'string') children = JSON.stringify(children);

  const renderContent = (row: MessageItem) => {
    const {
      id,
      msg: {type},
    } = row;

    let content = null;
    switch (type) {
      case 'text':
        content = (
          <ChatText
            row={row}
            showRadio={showRadio}
            setForwardContent={flag => {
              setForwardContent(flag);
            }}
            setQuoteContent={id => {
              const {
                user: {nickname},
                msg,
              } = DATA.filter(item => item.id == id)[0];
              const {message} = msg.content as TEXT;
              setQuoteContent(nickname + '：' + message);
            }}
            setSelectContent={flag => {
              setSelectContent(flag);
            }}
          />
        );
        break;
      case 'image':
        content = <ChatImage {...row} />;
        break;
      case 'voice':
        content = <ChatVoice {...row} />;
        break;
      case 'video':
        content = <ChatVideo {...row} />;
        break;
      case 'file':
        content = <ChatFile {...row} />;
        break;
      case 'card':
        content = <ChatCard {...row} />;
        break;
      case 'redPacket':
        content = <ChatRedPacket {...row} />;
        break;
      case 'transfer':
        content = <ChatTransfer {...row} />;
        break;
      case 'voiceCall':
        content = <ChatVoiceCall {...row} />;
        break;
      case 'videoCall':
        content = <ChatVideoCall {...row} />;
        break;
    }
    return content;
  };

  const renderItem = () => {
    const id = props.id;
    const isOwn = isMine;
    const viewDiffStyle: ViewStyle = isOwn
      ? {flexDirection: 'row-reverse'}
      : {flexDirection: 'row'};

    let maxWidth = 375 - 58 /**头像 */ - 10; /**边留白 */
    maxWidth = showRadio
      ? maxWidth - (16 /**按钮 */ + 24) /**按钮留白 */
      : maxWidth;

    const nickname = isMine ? '' : '';
    const avatar = isMine
      ? selfInfo.face_url
        ? {uri: formatUrl(selfInfo.face_url)}
        : Assets.imgs.avatar.defalut
      : send_face_url
      ? {uri: formatUrl(send_face_url)}
      : Assets.imgs.avatar.defalut;

    return (
      <View key={domId} row>
        <View
          style={{
            margin: pt(12),
            display: showRadio ? 'flex' : 'none',
          }}>
          <RadioButton
            selected={selecteds[domId]}
            onPress={() => {
              let data = {...selecteds};
              if (data[domId]) {
                delete data[domId];
              } else {
                data[domId] = true;
              }
              setSelecteds(data);
            }}
            label={''}
            color={selecteds[domId] ? '#7581FE' : '#BCBCBC'}
          />
        </View>
        <View
          flex
          style={{
            marginBottom: pt(15),
            ...viewDiffStyle,
          }}>
          <Avatar
            {...{
              name: nickname,
              size: pt(38),
              source: avatar,
              containerStyle: {
                marginLeft: pt(10),
                marginRight: pt(10),
              },
            }}
          />
          <View style={{marginTop: pt(12), maxWidth: pt(maxWidth)}}>
            {renderContent(props)}
          </View>
        </View>
      </View>
    );
  };

  return renderItem();
}

export default ChatMessage;
