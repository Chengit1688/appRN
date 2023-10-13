import React, {
  Fragment,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {ScrollView, DeviceEventEmitter} from 'react-native';
import {
  View,
  Switch,
  Avatar,
  Text,
  GridView,
  Icon,
  TouchableOpacity,
  TextField,
  Assets,
} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {opacity, pt} from '@/utils/dimension';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import FullButton from '@/components/FullButton';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Navbar, ConfirmModal, Popup} from '@/components';
import ListMenuItem from '@/components/ListMenuItem';
import {formatUrl} from '@/utils/common';
import {RootState} from '@/store';
import {Toast} from '@ant-design/react-native';
import {
  insertCurrentMessageList,
  updateConversationItem,
  checkoutConversation,
  updateCurrentMessageList,
} from '@/store/reducers/conversation';
import {setGroupList} from '@/store/actions/contacts';
import {selectPhotoTapped} from '@/components/ImagePickUpload/photoCamera';
import {updateGroupAvatar, updateGroupMemberNickName} from '@/api/group';
import Clipboard from '@react-native-clipboard/clipboard';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';

export default function Info(props: any) {
  const info = props.route.params.info || {};
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const groupList: any = useSelector<any>(
    state => state.contacts.groupList,
    shallowEqual,
  );
  const conversationList = useSelector(
    (state: RootState) => state.conversation.conversationList,
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

  const [visible, setVisible] = useState(false); // 清空聊天记录
  const [visible1, setVisible1] = useState(false); // 投诉
  const [visible2, setVisible2] = useState(false); // 解散群聊
  const [visible3, setVisible3] = useState(false); // 退群
  const [groupInfo, setGroupInfo] = useState(info || {});
  const [groupMember, setGroupMember] = useState<any>({});
  const [text, setText] = useState('');
  const [groupOwner, setGroupOwner] = useState<IMSDK.GroupMemberRole | ''>('');
  const [isTopchat, setIsTopchat] = useState(false);
  const [allMember, setAllMember] = useState({});
  useEffect(() => {
    DeviceEventEmitter.addListener('setUserData', data => {
      // 接收到 update 页发送的通知，后进行的操作内容
      // setUserList(data?.data || []);
      const list = data?.data || [];
      if (!list.length) {
        return;
      }
      imsdk
        .inviteToGroup({
          group_id: groupInfo.group_id,
          user_id_list: list.map(item => item.user_id) || [],
        })
        .then(() => {
          Toast.info('邀请成功');
        });
    });
    return () => {
      DeviceEventEmitter.removeAllListeners('setUserData');
    };
  }, []);

  // 展示推出按钮
  const showQuit = useMemo(() => {
    if (groupOwner === 'user') {
      if (groupInfo.ban_remove_by_normal === 2) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }, [groupInfo]);

  const initInfo = () => {
    //只展示前10条本地数据
    // imsdk.comlink.getGroupMember(10, 1, groupInfo.group_id).then((res: any) => {
    //   console.log(res, 'res');
    //   setGroupMember({
    //     ...res,
    //     list: res.data
    //       .filter((item: any) => item.status === 1)
    //       .map((item: any) => {
    //         return {
    //           ...item,
    //           ...item.user,
    //         };
    //       }),
    //   });
    // });

    imsdk
      .getGroupMemberList({
        group_id: groupInfo.group_id,
        page: 1,
        page_size: 10,
      })
      .then((res: any) => {
        console.log(res, 'res');
        setGroupMember({
          ...res,
          list: res.list
            .filter((item: any) => item.status === 1)
            .map((item: any) => {
              return {
                ...item,
              };
            }),
        });
      });

    // imsdk
    //   .getGroupMemberList({
    //     group_id: groupInfo.group_id,
    //     page: 1,
    //     page_size: 100,
    //   })
    //   .then(res => {
    //     console.log(res, 'res');
    //     let list = res?.list || [];
    //     setAllMember(
    //       list.reduce((obj, item) => {
    //         obj[item.user_id] = true;
    //         return obj;
    //       }, {}),
    //     );
    //     const owner = list.filter(
    //       item => item.role == 'owner' || item.role == 'admin',
    //     );
    //     // 获取管理员
    //     setGroupMember({
    //       ...res,
    //       list: owner,
    //     });
    //   });
  };

  const getGroupInfo = () => {
    //获取群信息
    imsdk
      .getGroupProfile(info.group_id)
      .then(res => {
        if (res.group_id) {
          const groupInfo = {...res};
          setGroupInfo(groupInfo);
          setGroupOwner(res.role);
          setIsTopchat(currentConversation?.is_topchat == 1);
        }
      })
      .catch(res => {});
  };

  useEffect(() => {
    initInfo();
    getGroupInfo();
  }, [info]);

  useFocusEffect(
    React.useCallback(() => {
      initInfo();
      getGroupInfo();
    }, []),
  );

  // 删除聊天记录
  const clearMsg = useCallback(() => {
    console.log('currentConversation========>', currentConversation);
    const {type, conversation_id, max_seq} = currentConversation;
    if (!max_seq) {
      return;
    }
    imsdk.clearMsg(type, conversation_id, max_seq).then(async res => {
      Toast.info(t('聊天记录已清空'));
      imsdk.comlink.clearMessageByConversationId(conversation_id);
      dispatch(insertCurrentMessageList({data: null}));

      const {data} = await imsdk.comlink.getConversationById(
        currentConversation?.conversation_id,
      );
      // console.log('listlistdata[0]=============>', data, conv)
      data[0].latest_message = '';
      dispatch(
        updateConversationItem({
          data: {...currentConversation, msg: {}, unread_count: 0},
        }),
      );
      imsdk.comlink.updateConversationById(data[0]);
    });
  }, [currentConversation]);

  // 投诉提交
  const onConfirm = () => {
    if (!text) {
      Toast.info(t('请输入需要提交的内容'));
      return;
    }
    setVisible1(false);
    Toast.info(t('提交成功'));
    setText('');
  };

  // 消息免打扰
  const onDisturbChange = async (checked: boolean) => {
    await imsdk.muteConversation(currentConversation);
  };

  // 置顶
  const onTopchatChange = async (checked: boolean) => {
    await imsdk.topConversationList(currentConversation);
    setIsTopchat(checked);
    dispatch(checkoutConversation(currentConversation?.conversation_id));
  };

  const dismissGroup = () => {
    //解散群
    return imsdk
      .dismissGroup(groupInfo.group_id)
      .then(async res => {
        Toast.info(t('解散成功'));
        if (currentConversation?.conversation_id) {
          await imsdk.deleteConversation(currentConversation?.conversation_id);
          imsdk.emit(IMSDK.Event.GROUP_LIST_UPDATED, {
            groupList: [groupInfo.group_id],
            type: 2,
          });
        }
        navigate({name: 'Message'});
      })
      .catch(res => {});
  };

  const quitGroup = () => {
    //退出群
    return imsdk
      .quitGroup(groupInfo.group_id)
      .then(async res => {
        Toast.info(t('退出成功'));
        if (currentConversation?.conversation_id) {
          await imsdk.deleteConversation(currentConversation?.conversation_id);
          imsdk.emit(IMSDK.Event.GROUP_LIST_UPDATED, {
            groupList: [groupInfo.group_id],
            type: 2,
          });
        }
        navigate({name: 'Message'});
      })
      .catch(res => {});
  };

  // 显示群成员昵称
  const onSwitchnNicknameOpen = e => {
    setGroupInfo({
      ...groupInfo,
      is_display_nickname_open: e ? 1 : 2,
    });
    imsdk
      .setGroupAttributes({
        group_id: groupInfo.group_id,
        attributes: {
          is_display_nickname_open: e ? 1 : 2,
        },
      })
      .then(res => {
        getGroupInfo();
      })
      .catch(res => {});
  };

  // 是否是管理
  const isAdmin = groupOwner === 'owner' || groupOwner === 'admin';
  // 是否展示管理员
  // const showAdminList = useMemo(() => {
  //   // console.log(groupInfo, 'groupInfo');
  //   if (groupInfo.role === 'admin' || groupInfo.role === 'owner') {
  //     return true;
  //   } else {
  //     return groupInfo.is_open_admin_list === 1 ? false : true;
  //   }
  // }, [groupInfo]);

  // 是否展示二维码
  const showQrcode = useMemo(() => {
    if (groupOwner === 'user') {
      if (groupInfo.show_qrcode_by_normal_member_v2 === 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }, [groupInfo]);
  // 是否展示群账号
  const showGroupId = useMemo(() => {
    if (groupOwner === 'admin' || groupOwner === 'owner') {
      return true;
    } else {
      return groupInfo.is_open_group_id === undefined ||
        groupInfo.is_open_group_id === 2
        ? false
        : true;
    }
  }, [groupInfo]);

  const avatar = groupInfo?.face_url
    ? {uri: formatUrl(groupInfo.face_url), cache: FastImage.cacheControl.web}
    : Assets.imgs.avatar.group;

  //修改群名
  const [groupName, setGroupName] = useState('');
  const [groupNameVisible, setGroupNameVisible] = useState(false);

  const onGroupNameConfirm = () => {
    updateGroupAvatar({
      name: groupName,
      group_id: groupInfo.group_id,
      operation_id: Date.now().toString(),
    }).then((res: any) => {
      if (res.group_id) {
        setGroupInfo(res);
        setGroupNameVisible(false);
        Toast.info(t('群名称修改成功'));
      }
    });
  };

  //修改群昵称
  const [groupNickName, setGroupNickName] = useState('');
  const [nickNameVisible, setNickNameVisibleVisible] = useState(false);

  const onNickNameConfirm = () => {
    if (!groupNickName) return;
    updateGroupMemberNickName({
      group_nick_name: groupNickName,
      group_id: groupInfo.group_id,
      operation_id: Date.now().toString(),
    }).then((res: any) => {
      if (res.group_id) {
        setGroupInfo(res);
        setNickNameVisibleVisible(false);
        Toast.info(t('昵称修改成功'));
      }
    });
  };

  return (
    <>
      <Navbar
        title="群聊设置"
        right={
          showQrcode ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigate('GroupChatQRcode', {groupInfo})}>
              <View right>
                <Icon
                  assetName="qrcode_half"
                  assetGroup="icons.app"
                  size={pt(20)}
                />
              </View>
            </TouchableOpacity>
          ) : null
        }
      />
      <ScrollView>
        <View row centerV style={{marginHorizontal: pt(16), marginTop: pt(10)}}>
          <TouchableOpacity
            style={{
              width: pt(55),
              height: pt(55),
              borderRadius: pt(28),
              backgroundColor: '#F2F2F2',
            }}
            activieOpacity={1}
            onPress={() => {
              selectPhotoTapped()
                .then((res: any) => {
                  const img_url = res?.[0]?.thumbnail || res?.[0]?.url;
                  if (!img_url) {
                    Toast.info(t('图片上传失败'));
                    return;
                  }
                  updateGroupAvatar({
                    face_url: img_url,
                    group_id: groupInfo.group_id,
                    operation_id: Date.now().toString(),
                  })
                    .then(res => {
                      if (!res.group_id) {
                        Toast.info(t('群头像设置失败'));
                        return;
                      }
                      setGroupInfo(res);

                      const conv_id = info.conversation_id || info.group_id;
                      // 更新redux会话列表
                      const currentConvArr = conversationList.filter(
                        item => item.conversation_id === conv_id,
                      );
                      if (currentConvArr.length) {
                        dispatch(
                          updateConversationItem({
                            data: {
                              ...currentConvArr[0],
                              group: {
                                ...currentConvArr[0].group,
                                face_url: img_url,
                              },
                            },
                          }),
                        );
                      }
                      // 更新群组列表
                      const currentGroupIndex = groupList.findIndex(
                        item => item.conversation_id == conv_id,
                      );
                      if (currentGroupIndex > -1) {
                        let arr = [...groupList];
                        let currentGroup = groupList[currentGroupIndex];
                        currentGroup.face_url = img_url;
                        arr.splice(currentGroupIndex, 1, currentGroup);
                        dispatch(setGroupList(arr));
                      }

                      Toast.info(t('群头像设置成功'));
                    })
                    .catch(e => e);
                })
                .catch(e => e);
            }}>
            <FastImage
              style={{
                width: pt(55),
                height: pt(55),
                borderRadius: pt(28),
                backgroundColor: '#F2F2F2',
              }}
              source={avatar}
              resizeMode="cover"
            />
          </TouchableOpacity>
          {/* <Avatar
            onPress={() => {
              selectPhotoTapped()
                .then((res: any) => {
                  const img_url = res?.[0]?.thumbUrl;
                  if (!img_url) {
                    return;
                  }
                  updateGroupAvatar({
                    face_url: img_url,
                    group_id: groupInfo.group_id,
                    operation_id: Date.now().toString(),
                  })
                    .then(res => {
                      if (!res.group_id) {
                        return;
                      }
                      setGroupInfo(res);
                    })
                    .catch(e => e);
                })
                .catch(e => e);
            }}
            {...{
              name: groupInfo.name,
              size: pt(55),
              source: {
                uri: formatUrl(groupInfo.face_url),
              },
            }}
          /> */}
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                isAdmin && setGroupNameVisible(true);
              }}
              row
              centerV>
              <Text
                style={{
                  marginLeft: pt(14),
                  fontSize: pt(15),
                  fontWeight: 'bold',
                  color: '#222222',
                }}>
                {groupInfo.name}
              </Text>
              {isAdmin ? (
                <Icon
                  assetName="edit"
                  assetGroup="icons.app"
                  size={pt(12)}
                  style={{
                    marginLeft: pt(6),
                  }}
                />
              ) : null}
            </TouchableOpacity>
            <Popup
              visible={groupNameVisible}
              onDismiss={() => {
                setGroupNameVisible(false);
              }}>
              <View
                style={{
                  borderRadius: pt(10),
                  backgroundColor: '#fff',
                  padding: pt(15),
                  width: pt(300),
                }}>
                <Text
                  style={{
                    fontSize: pt(15),
                    fontWeight: 'bold',
                    color: '#000',
                    marginBottom: pt(20),
                  }}>
                  {t('群名称')}
                </Text>
                <View
                  style={{
                    marginBottom: pt(20),
                  }}>
                  <TextField
                    value={groupName}
                    onChangeText={e => {
                      setGroupName(e);
                    }}
                    style={{
                      height: pt(20),
                    }}
                    placeholder="填写群名称"
                  />
                </View>
                <FullButton
                  text={t('提交')}
                  onPress={onGroupNameConfirm}
                  disabled={!groupName.trim()}
                  style={{
                    width: pt(270),
                    marginLeft: 0,
                    marginTop: pt(20),
                    marginBottom: pt(0),
                    marginRight: 0,
                  }}
                />
              </View>
            </Popup>

            {showGroupId && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  Clipboard.setString(groupInfo.group_id);
                  Toast.info(t('复制成功'));
                }}>
                <View
                  row
                  centerV
                  style={{
                    marginTop: pt(5),
                    marginLeft: pt(14),
                  }}>
                  <Text
                    style={{
                      fontSize: pt(12),
                      color: '#999999',
                    }}>
                    {t('群号：')}
                    {groupInfo.group_id}
                  </Text>
                  <Icon
                    assetName="copy"
                    assetGroup="icons.app"
                    size={pt(12)}
                    style={{
                      marginLeft: pt(6),
                    }}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ListMenuItem
          noActiveBg
          border="none"
          label={t('群聊成员')}
          rightText={`${t('共')}${groupMember.count || 0}${t('人')}`}
          onPress={() => navigate('GroupChatMember', {groupInfo})}
        />
        {
          <View
            style={{
              marginHorizontal: pt(16),
            }}>
            <GridView
              numColumns={5}
              items={groupMember.list}
              renderCustomItem={item => {
                const {nick_name, group_nick_name, face_url, key} = item;

                const faceURL = face_url
                  ? {
                      uri: formatUrl(face_url),
                      cache: FastImage.cacheControl.web,
                    }
                  : Assets.imgs.avatar.defalut;
                let lastItem = null;
                if (key === groupMember.list.length - 1 && isAdmin) {
                  lastItem = (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          navigate('SelectContact', {
                            disabledSelecteds: allMember,
                          });
                        }}
                        center
                        style={{
                          marginRight: (key + 1) % 4 === 0 ? pt(0) : pt(35),
                          marginBottom: pt(15),
                          width: pt(40),
                        }}>
                        <View
                          center
                          style={{
                            width: pt(40),
                            height: pt(40),
                            borderRadius: pt(50),
                            borderWidth: pt(0.5),
                            borderColor: '#F2F2F2',
                          }}>
                          <Icon
                            assetName="plus"
                            assetGroup="page.groupchat"
                            size={pt(12)}
                          />
                        </View>
                        <Text
                          style={{
                            marginTop: pt(4),
                            fontSize: pt(12),
                            color: '#999999',
                          }}>
                          {t('邀请')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                          navigate('GroupChatMember', {
                            groupInfo,
                            type: 'delete',
                          })
                        }
                        center
                        style={{
                          marginRight: (key + 2) % 4 === 0 ? pt(0) : pt(35),
                          marginBottom: pt(15),
                          width: pt(40),
                        }}>
                        <View
                          center
                          style={{
                            width: pt(40),
                            height: pt(40),
                            borderRadius: pt(50),
                            borderWidth: pt(0.5),
                            borderColor: '#F2F2F2',
                          }}>
                          <Icon
                            assetName="minus"
                            assetGroup="page.groupchat"
                            size={pt(12)}
                          />
                        </View>
                        <Text
                          style={{
                            marginTop: pt(4),
                            fontSize: pt(12),
                            color: '#999999',
                          }}>
                          {t('删除')}
                        </Text>
                      </TouchableOpacity>
                    </>
                  );
                }
                return (
                  <Fragment key={key}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        if (selfInfo.user_id === item.user_id) {
                          return;
                        }
                        if (groupInfo.no_show_normal_member === 1 && !isAdmin) {
                          return;
                        }
                        navigate('ContactInfo', {info: item});
                      }}
                      center
                      style={{
                        marginRight: (key + 1) % 5 === 0 ? pt(0) : pt(35),
                        marginBottom: pt(15),

                        width: pt(40),
                      }}>
                      <FastImage
                        style={{
                          width: pt(40),
                          height: pt(40),
                          borderRadius: pt(20),
                          backgroundColor: '#F2F2F2',
                        }}
                        source={faceURL}
                        resizeMode="cover"
                      />
                      {/* <Avatar
                        {...{
                          name: nick_name,
                          size: pt(40),
                          source: {
                            uri: formatUrl(face_url),
                          },
                        }}
                      /> */}
                      <Text
                        numberOfLines={1}
                        style={{
                          marginTop: pt(4),
                          fontSize: pt(12),
                          color: '#999999',
                        }}>
                        {group_nick_name || nick_name}
                      </Text>
                    </TouchableOpacity>
                    {lastItem}
                  </Fragment>
                );
              }}
            />
          </View>
        }
        <View
          style={{
            borderTopWidth: pt(5),
            borderTopColor: opacity('#BFBFBF', 0.2),
          }}>
          <Text
            style={{
              marginHorizontal: pt(16),
              marginVertical: pt(15),
              fontSize: pt(15),
              color: '#B1B1B2',
            }}>
            {t('群聊信息')}
          </Text>
          <ListMenuItem
            label={t('群公告')}
            text={groupInfo?.notification}
            onPress={() => navigate('GroupChatNotice', {groupInfo})}
          />
          <ListMenuItem
            label={t('我的本群昵称')}
            onPress={() => {
              setNickNameVisibleVisible(true);
            }}
            right={
              <Text>{groupInfo.group_nick_name || selfInfo.nick_name}</Text>
            }
          />
          <ListMenuItem
            label={t('邀请链接')}
            onPress={() => {
              setNickNameVisibleVisible(true);
            }}
            right={
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Clipboard.setString(
                    `${Config.VITE_APP_GROUPURL}/qrcode?type=1&id=${groupInfo.group_id}&name=${groupInfo.name}`,
                  );
                  Toast.info(t('复制成功'));
                }}
                row
                style={{width: pt(200), marginRight: pt(10)}}>
                <Text
                  numberOfLines={
                    1
                  }>{`${Config.VITE_APP_GROUPURL}/qrcode?type=1&id=${groupInfo.group_id}&name=${groupInfo.name}`}</Text>
                <Icon
                  assetName="copy"
                  assetGroup="icons.app"
                  size={pt(14)}
                  style={{
                    marginLeft: pt(6),
                  }}
                />
              </TouchableOpacity>
            }
          />
          <Popup
            visible={nickNameVisible}
            onDismiss={() => {
              setNickNameVisibleVisible(false);
            }}>
            <View
              style={{
                borderRadius: pt(10),
                backgroundColor: '#fff',
                padding: pt(15),
                width: pt(300),
              }}>
              <Text
                style={{
                  fontSize: pt(15),
                  fontWeight: 'bold',
                  color: '#000',
                  marginBottom: pt(20),
                }}>
                {t('群昵称')}
              </Text>
              <View
                style={{
                  marginBottom: pt(20),
                }}>
                <TextField
                  value={groupNickName}
                  onChangeText={e => {
                    setGroupNickName(e);
                  }}
                  style={{
                    height: pt(20),
                  }}
                  placeholder="填写群昵称"
                />
              </View>
              <FullButton
                text={t('提交')}
                onPress={onNickNameConfirm}
                disabled={!groupNickName.trim()}
                style={{
                  width: pt(270),
                  marginLeft: 0,
                  marginTop: pt(20),
                  marginBottom: pt(0),
                  marginRight: 0,
                }}
              />
            </View>
          </Popup>

          {isAdmin && (
            <>
              <ListMenuItem
                border="none"
                label={t('显示群成员昵称')}
                right={
                  <Switch
                    value={groupInfo.is_display_nickname_open === 1}
                    onValueChange={onSwitchnNicknameOpen}
                  />
                }
              />
              <ListMenuItem
                label={t('群管理')}
                onPress={() => {
                  navigate('GroupChatManage', {groupInfo});
                }}
              />
            </>
          )}
        </View>
        <View
          style={{
            borderTopWidth: pt(5),
            borderTopColor: opacity('#BFBFBF', 0.2),
          }}>
          <Text
            style={{
              marginHorizontal: pt(16),
              marginTop: pt(15),
              fontSize: pt(15),
              color: '#B1B1B2',
            }}>
            {t('聊天会话')}
          </Text>
          {/* <ListMenuItem
            label={t('查找聊天记录')}
            onPress={() => {
              navigate('GroupChatRecords', {groupInfo});
            }}
          /> */}
          <ListMenuItem
            label={t('消息免打扰')}
            right={
              <Switch
                value={currentConversation?.is_disturb === 1}
                onValueChange={onDisturbChange}
              />
            }
          />
          <ListMenuItem
            label={t('置顶聊天')}
            right={<Switch value={isTopchat} onValueChange={onTopchatChange} />}
          />
          {/* <ListMenuItem
            border="none"
            label={t('显示群成员昵称')}
            right={
              <Switch
                value={nicknameVisible}
                onValueChange={() => setNicknameVisible(!nicknameVisible)}
              />
            }
          /> */}
        </View>
        <View
          style={{
            borderTopWidth: pt(5),
            borderTopColor: opacity('#BFBFBF', 0.2),
          }}>
          <Text
            style={{
              marginHorizontal: pt(16),
              marginTop: pt(15),
              fontSize: pt(15),
              color: '#B1B1B2',
            }}>
            {t('其它设置')}
          </Text>
          {/* <ListMenuItem label={t('设置当前聊天背景')} /> */}
          <ListMenuItem
            label={t('清空聊天记录')}
            onPress={() => {
              setVisible(true);
            }}
          />
          <ListMenuItem
            border="none"
            label={t('投诉')}
            onPress={() => {
              setVisible1(true);
            }}
          />
        </View>
        {groupOwner === 'owner' && (
          <FullButton
            outline
            danger
            text={t('解散群聊')}
            onPress={() => {
              setVisible2(true);
            }}
          />
        )}
        {showQuit && groupOwner !== 'owner' && (
          <FullButton
            disabled={
              groupInfo?.ban_remove_by_normal === 1 && groupOwner != 'admin'
            }
            outline
            danger
            text={t('退出群聊')}
            onPress={() => {
              setVisible3(true);
            }}
          />
        )}
      </ScrollView>
      <ConfirmModal
        title={t('清空聊天记录')}
        content={t('确定清空聊天记录吗?')}
        showClose
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onConfirm={async () => {
          setVisible(false);

          const conv_id = info.conversation_id || info.group_id;
          // 更新redux会话列表
          const arr = conversationList.filter(
            item => item.conversation_id === conv_id,
          );
          if (arr.length) {
            dispatch(
              updateConversationItem({
                data: {...arr[0], latest_message: '', unread_count: 0, msg: {}},
              }),
            );
          }
          // 更新当前会话
          if (
            currentConversation &&
            currentConversation.conversation_id == conv_id
          ) {
            dispatch(updateCurrentMessageList({data: []}));
          }
          // 更新本地数据库会话列表
          const {data} = await imsdk.comlink.getConversationById(conv_id);
          if (data && data[0]) {
            imsdk.comlink.updateConversationById({
              ...data[0],
              latest_message: '',
              unread_count: 0,
            });
          }
          // 本地消息列表修改状态
          imsdk.modifyMessageStatus(conv_id);

          Toast.info(t('聊天记录已清空'));
        }}
      />
      <Popup
        visible={visible1}
        onDismiss={() => {
          setVisible1(false);
        }}>
        <View
          style={{
            borderRadius: pt(10),
            backgroundColor: '#fff',
            padding: pt(15),
            width: pt(300),
          }}>
          <Text
            style={{
              fontSize: pt(15),
              fontWeight: 'bold',
              color: '#000',
              marginBottom: pt(20),
            }}>
            {t('投诉')}
          </Text>
          <View
            style={{
              marginBottom: pt(20),
            }}>
            <TextField
              value={text}
              onChangeText={e => {
                setText(e);
              }}
              multiline={true}
              numberOfLines={2}
              style={{
                height: pt(90),
              }}
              placeholder="填写投诉内容"
            />
          </View>
          <FullButton
            text={t('提交')}
            onPress={onConfirm}
            style={{
              width: pt(270),
              marginLeft: 0,
              marginTop: pt(20),
              marginBottom: pt(0),
              marginRight: 0,
            }}
          />
        </View>
      </Popup>
      <ConfirmModal
        title={t('解散群聊')}
        content={t('确定解散该群聊吗?')}
        showClose
        visible={visible2}
        onClose={() => {
          setVisible2(false);
        }}
        onConfirm={() => {
          setVisible2(false);
          dismissGroup();
        }}
      />
      <ConfirmModal
        title={t('退出群聊')}
        content={t('确定退出该群聊吗?')}
        showClose
        visible={visible3}
        onClose={() => {
          setVisible3(false);
        }}
        onConfirm={() => {
          setVisible3(false);
          quitGroup();
        }}
      />
    </>
  );
}
