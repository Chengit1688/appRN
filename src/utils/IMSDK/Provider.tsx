import {useContext, useState, useEffect, createContext} from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {useRequest} from 'ahooks';
import uuid from 'react-native-uuid';
import _ from 'lodash';

import {decrypt} from '@/utils/aes';
import {EnvContext} from '@/utils/env';
import {StorageFactory} from '@/utils/storage';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {createNewGroupData} from '@/utils/IMSDK/db/data/createGroup';
import {formatUrl, transfer311ToText} from '@/utils/common';
import {userLogin} from '@/api/login';
import store, {RootState, AppDispatch} from '@/store';
import {setSelfInfo, setUserToken} from '@/store/actions/user';
import {initConversationData} from '@/utils/IMSDK/db/data/initConversation';
import PushNotification from 'react-native-push-notification';
import BackgroundTimer from 'react-native-background-timer';
import {
  checkoutConversation,
  insertCurrentMessageList,
  updateSettingInfo,
  deleteCurrentMessageList,
  updateConversationItem,
  updateConversationList,
  removeConversationItem,
  updateCurrentMessageList,
  setConversationAtList,
} from '@/store/reducers/conversation';
import {
  setCurrentMemberList,
  setFriendList,
  setGroupList,
  setNoticeCount,
} from '@/store/actions/contacts';
import {
  setConnectDelay,
  setVideoAndAudio,
  setSystemConfig,
  setRemindCiircle,
} from '@/store/reducers/global';
import {getSettingConfig, getUserWallet, getShieldList} from '@/store/actions';
import MessageNotify from './messageNotify';
import FastImage from 'react-native-fast-image';
import {Platform} from 'react-native';

const Context = createContext({isReady: false, isConnected: false});

let timerid = null;

export default function Provider({children}: any) {
  const {domains} = useContext(EnvContext);

  const backDomains = useSelector(
    (state: any) => state.global.domains,
    shallowEqual,
  );

  const dispatch = useDispatch();
  const {
    token,
    selfInfo: {user_id, face_url},
  } = useSelector((state: RootState) => state.user, shallowEqual);

  const noticeCount = useSelector(
    (state: RootState) => state.contacts.noticeCount,
    shallowEqual,
  );
  const [noticeCountStatus, setNoticeCountStatus] = useState(false);
  const [noticeGroupStatus, setNoticeGroupStatus] = useState(false);

  const currentConversation: any = useSelector(
    (state: RootState) => state.conversation.currentConversation,
    shallowEqual,
  );

  const [isReady, setReady] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [hasFetchConv, setHasFetchConv] = useState(false);
  // const [token, setToken] = useState();

  // 网络延迟变化
  function onConnectDelayChange(delay: number) {
    console.log(delay, 'connect delay change');
  }
  // 网络变化
  function onConnectStateChange(state: IMSDK.ConnectState) {
    setConnected(IMSDK.ConnectState.CONNECTED === state);
    if (IMSDK.ConnectState.CONNECTED === state) {
      setHasFetchConv(false);
      // getConversationList();
      initConversationData();
      clearTimeout(timerid);
      timerid = setTimeout(() => {
        setHasFetchConv(false);
        initConversationData();
        // getConversationList();
      }, 60 * 60 * 1000);
    }
  }

  // 收到消息
  function onMessageRecieve(msgs: IMSDK.Message[]) {
    // console.log(msgs, '收到的消息');
  }

  // 更新联系人
  async function onFriendUpdate(state: {friendList: Array<any>; type: number}) {
    if (state.type === 1) {
      //添加
      state.friendList.forEach(item => {
        const user_id_1 =
          Number(item.user_id) > Number(user_id) ? user_id : item.user_id;
        const user_id_2 =
          Number(item.user_id) > Number(user_id) ? item.user_id : user_id;
        imsdk.subscribeSingleChat({
          user_id_1,
          user_id_2,
        });
      });
      await imsdk.comlink.insertFriendList(state.friendList);
    } else if (state.type === 2 || state.type === 3) {
      //3 加入黑名单
      const convers = await imsdk.comlink.getConversationCountByUserId(
        state.friendList,
      );

      if (convers?.data?.length) {
        const convIds = convers.data.map(item => {
          return item.conversation_id;
        });
        await imsdk.comlink.deleteConversationById(convIds);
        await imsdk.comlink.deleteMessageByConvId(convIds);
      }
      //删除会话
      state.friendList.forEach(async item => {
        const user_id_1 =
          Number(item.user_id) > Number(user_id) ? user_id : item.user_id;
        const user_id_2 =
          Number(item.user_id) > Number(user_id) ? item.user_id : user_id;
        imsdk.subscribeSingleChat({
          user_id_1,
          user_id_2,
        });
        await imsdk.deleteConversation(`${user_id_1}_${user_id_2}`);
      });
      state.friendList.map(id => {
        dispatch(
          removeConversationItem({
            data: [id, user_id].sort((a, b) => a - b).join('_'),
          }),
        );
      });
      state.type === 2
        ? await imsdk.comlink.deleteFriends(state.friendList)
        : await imsdk.comlink.updateFriendById(state.friendList[0]);
    } else if (state.type === 4) {
      //移出黑名单
      await imsdk.comlink.updateFriendById(state.friendList[0]);
    }
    const {data} = await imsdk.comlink.getFriendList();
    const friendList = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].friend_status == 1 && data[i].black_status == 2) {
        friendList.push({
          account: data[i].user.account,
          age: data[i].user.age,
          create_time: data[i].create_time,
          id: data[i].user.user_id,
          gender: data[i].user.gender,
          nick_name: data[i].user.nick_name,
          phone_number: data[i].user.phone_number,
          signatures: data[i].user.signatures,
          remark: data[i].remark,
          user_id: data[i].user.user_id,
          face_url: data[i].user.face_url,
          friend_status: data[i].friend_status,
          black_status: data[i].black_status,
        });
      }
    }
    dispatch(setFriendList(friendList));
  }

  // 更新群组
  async function onGroupListUpdate(state: {
    groupList: Array<any>;
    type: number;
  }) {
    if (state.type === 1) {
      //添加
      // console.log(state.groupList, '群组===>');
      if (state.groupList.length <= 0) return;

      await imsdk.comlink.insertGroupList(state.groupList);
    } else if (state.type === 2) {
      //删除
      const {data} = await imsdk.comlink.getConversationList();
      await imsdk.comlink.deleteGroups(state.groupList);
    }
    const {data} = await imsdk.comlink.getGroupList();
    dispatch(setGroupList(data));
  }

  //触发视频通话
  async function newVideo(data) {
    // console.log(`拨打语音电话:${JSON.stringify(data)}`, Platform.OS);
    if (data.rtc_status === 1 && data.send_id !== user_id) {
      let messageInfo: any = {
        title: `${data.send_nickname}`,
        message: `邀请你进行${data.rtc_type === 1 ? '语音' : '视频'}聊天`,
      };
      if (Platform.OS === 'android') {
        PushNotification.createChannel(
          {
            channelId: 'video',
            channelName: '语音视频消息',
          },
          created => console.log(`ceeateChannel returned '${created}'`),
        );
        messageInfo.channelId = 'video';
      }

      PushNotification.localNotification({
        ...messageInfo,
      });
    }
    dispatch(setVideoAndAudio(data));
  }
  async function newGroupMember(data) {
    //新的群成员
    const uid = uuid.v4();
    await imsdk.comlink.insertGroupMemberList(
      data.map(item => {
        return {
          member_id: `${item.group_id}_${item.user_id}`,
          group_id: item.group_id,
          user_id: item.user_id,
          id: uid,
          group_nick_name: item.nick_name,
          role: item.role,
          mute_end_time: item.mute_end_time || 0,
          version: item.version || 1,
          status: item.status,
        };
      }),
    );
    await imsdk.comlink.insertUserList(
      data.map(item => {
        return {
          user_id: item.user_id,
          face_url: item.face_url,
          nick_name: item.nick_name,
          age: item.age || 0,
          account: item.account || '',
          phone_number: item.phone_number || '',
          login_ip: item.login_ip || '',
          gender: item.gender || 1,
          signatures: item.signatures || '',
          // remark: item.remark || ''
        };
      }),
    );
  }
  async function removeMove(list) {
    if (list?.length && user_id !== list[0].user_id) {
      await imsdk.comlink.deleteGroupMembers(
        list.map(item => `${item.group_id}_${item.user_id}`),
      );
      const {data} = await imsdk.comlink.getGroupMember(
        10000,
        1,
        list[0].group_id,
      );
      dispatch(setCurrentMemberList(data));
      list.forEach(user => {
        if (user_id !== user.user_id && user.status === 3) {
          // 被移除
          imsdk.deleteMessageByUserId([user.user_id], user.group_id);
        }
      });
    }
  }

  async function updateGroupMember(
    group_id: string,
    user_id: string,
    data: Partial<IMSDK.GroupMember>,
  ) {
    delete data.big_face_url;
    const d = await imsdk.comlink.getGroupMemberById(`${group_id}_${user_id}`);
    if (d?.data?.[0]) {
      const member = d.data[0];
      await imsdk.comlink.updateGroupMemberById(
        Object.assign({}, member, data),
      );
      const e = await imsdk.comlink.getGroupMember(10000, 1, group_id);
      if (e?.data?.length) {
        const data = e.data;
        dispatch(setCurrentMemberList(data));
      }
    }
  }

  const removeGroupMember = async response => {
    const group_id = response.group_id;
    dispatch(removeConversationItem({data: group_id}));
    imsdk.comlink.deleteConversationById(group_id);
    imsdk.emit(IMSDK.Event.GROUP_LIST_UPDATED, {
      groupList: [group_id],
      type: 2,
    });
    imsdk.unsubscribeGroupChat(group_id);
    imsdk.unsubscribeGroups(group_id);
  };
  useEffect(() => {
    if (noticeCountStatus) {
      const nums = noticeCount.friendNotice + 1;
      dispatch(
        setNoticeCount({
          ...noticeCount,
          friendNotice: nums,
        }),
      );
      setNoticeCountStatus(false);
    }
  }, [noticeCountStatus]);
  useEffect(() => {
    if (noticeGroupStatus) {
      const nums = noticeCount.groupNotice + 1;
      dispatch(
        setNoticeCount({
          ...noticeCount,
          groupNotice: nums,
        }),
      );
      setNoticeCountStatus(false);
    }
  }, [noticeGroupStatus]);
  function newFriendApply(state) {
    setNoticeCountStatus(true);
  }
  function newGroupApply(state) {
    setNoticeGroupStatus(true);
  }
  // 获取是否还有待审核的群
  function getGroupApply() {
    return new Promise((resolve, reject) => {
      imsdk
        .getJoinGroupApplication({
          page_size: 20,
          page: 1,
        })
        .then(res => {
          const {list} = res;
          const newarr = list?.filter(item => item.status === 0) || [];
          resolve(newarr.length);
        });
    });
  }

  // 获取是否还有待验证的好友
  function getFriendApply() {
    return new Promise((resolve, reject) => {
      imsdk
        .getFriendApplicationList({
          page_size: 20,
          page: 1,
        })
        .then(res => {
          const {list} = res;
          const newarr = list?.filter(item => item.status === 0) || [];
          resolve(newarr.length);
        });
    });
  }
  const getApplyNums = () => {
    Promise.all([getGroupApply(), getFriendApply()]).then((res: any) => {
      dispatch(
        setNoticeCount({
          groupNotice: res[0] || 0,
          friendNotice: res[1] || 0,
        }),
      );
    });
  };
  const handleGlobalConfig = data => {
    dispatch(setSystemConfig(data));
  };

  const clearData = async () => {
    await imsdk.deleteAllConversation();
    await imsdk.deleteAllMessage();
    await imsdk.deleteAllGroupVersion();
    await imsdk.comlink.getConversationList();
    dispatch(updateCurrentMessageList([]));
    dispatch(updateConversationList([]));
    dispatch(checkoutConversation(''));
  };

  const getConversationList = () => {
    if (isReady && !hasFetchConv) {
      setHasFetchConv(true);
      imsdk.getConversationList({sync: true}).then(async res => {
        let max_version = res?.length
          ? Math.max.apply(
              Math,
              res.map(item => item.version),
            )
          : 0;

        const fetchConversationList = async () => {
          let conversationList = [];
          let total = Number.MAX_VALUE;
          let page = 1;
          while (total > conversationList.length) {
            const result: any = await imsdk.fetchConversationList({
              version: max_version,
              pageSize: 10,
              page: page,
            });
            if (!result.list) {
              break;
            }
            page++;
            result.list = result.list.filter(
              i => i.id && !i.deleted_at && !!i.message,
            );
            total = result?.count ? result.count : 0;
            conversationList = conversationList.concat(result.list || []);
            // console.log(res)
          }
          return Promise.resolve(conversationList);
        };
        let result = await fetchConversationList();
        if (!result.length) {
          return;
        }
        res.map((item: any, index) => {
          const cv =
            result?.filter(c => c.id === item.conversation_id)?.[0] || null;
          if (!cv) {
            let data = {id: item.conversation_id};
            data = Object.assign(data, item);
            result.push(data);
          }
        });
        await Promise.all(
          result.map(async item => {
            const cv: any =
              res?.filter(c => c.conversation_id === item.id)?.[0] || {};
            if (item.message) {
              item.latest_message = item.message.msg_id;
              item.message.content = decrypt(item.message.content);
              if (
                item.message.type ===
                IMSDK.MessageType.GROUP_NOTIFICATION_NOTIFY
              ) {
                item.message = transfer311ToText(item.message);
              }
            }

            if (!item.msg) {
              const messageEntity: any = imsdk.createMessageEntity(
                item.id,
                item.message,
              );

              // await imsdk.insertMessageList([messageEntity]);
              item.msg = {
                ...messageEntity,
                be_operator_list: item.message?.be_operator_list,
              };
            }
            if (!item.conversation_id) {
              item.conversation_id = item.id;
            }

            item.status = 1;
            if (item.type === 1) {
              item.user = cv.user;
              if (!item.user || !item.user.user_id) {
                const friend_id = item.id
                  .replace(`${user_id}`, '')
                  .replace('_', '');
                const user_info = await imsdk.getFriendProfile(friend_id);
                item.user = user_info;
              }
            } else if (item.type === 2) {
              item.group = cv.group;
              if (!item.group || !item.group.group_id) {
                const group_info = await imsdk.getGroupProfile(item.id);
                item.group = group_info;
              }
            }
            const state = store.getState();
            if (state.user?.config?.conversationMap) {
              const config =
                state.user.config.conversationMap[item.conversation_id];
              if (config) {
                item.is_disturb = config.is_nocare;
                item.is_topchat = config.is_top;
                item.update_time = config.update_time;
              }
            }
            delete item.message;
            delete item.deleted_at;
            delete item.id;
            delete item.name;
            delete item.face_url;
          }),
        );
        // const localData = _.keyBy(res, 'conversation_id')

        const serverData = _.keyBy(result, 'conversation_id');
        //console.log('localData=======>', serverData);
        // const newData = Object.assign({}, localData, serverData)
        dispatch(updateConversationList(result));
        await imsdk.updateConversationList(result);

        const getMaxSeq = (list: any) => {
          let max = 0;
          for (let i = 0; i < list.length; i++) {
            if (max < list[i].seq) {
              max = list[i].seq;
            }
          }
          return max;
        };
        const checkMessage = async () => {
          let res: any = await imsdk.getMyGroupMaxSeq(1, 20);

          let list = res.list;
          for (let i = 0; i < res.count; i++) {
            let conversation = await imsdk.comlink.getConversationById(
              list[i].conversation_id,
            );

            let localSeq =
              (await imsdk.comlink.getMaxSeq(list[i].conversation_id)) || 0;

            if (list[i].MaxGroupSeq - 1 > localSeq) {
              let msgres = await imsdk.fetchMessage(
                2,
                conversation.data[0]?.group_id,
                list[i].MaxGroupSeq,
                list[i].conversation_id,
              );

              if (
                currentConversation?.conversation_id == list[i].conversation_id
              ) {
                dispatch(
                  updateCurrentMessageList({
                    data: msgres,
                  }),
                );
              }
            }
          }

          res = await imsdk.getMyGFriendMaxSeq(1, 20);
          list = res.list;
          for (let i = 0; i < res.count; i++) {
            let conversation = await imsdk.comlink.getConversationById(
              list[i]?.conversation_id,
            );

            let localSeq =
              (await imsdk.comlink.getMaxSeq(list[i]?.conversation_id)) || 0;

            if (list[i]?.MaxFriendSeq > localSeq) {
              let msgres = await imsdk.fetchMessage(
                1,
                conversation.data[0]?.friend,
                list[i].MaxFriendSeq,
                list[i].conversation_id,
              );
              if (
                currentConversation?.conversation_id == list[i].conversation_id
              ) {
                dispatch(
                  updateCurrentMessageList({
                    data: msgres,
                  }),
                );
              }
            }
          }
        };

        checkMessage();
        // await imsdk.getConversationList({sync:true, updateRedux: true});
      });
    }
  };

  //login test
  const handleLogin = useRequest(userLogin, {
    manual: true,
    onSuccess: (result: any) => {
      if (result) {
        // setToken(result.token);
        dispatch(setUserToken(result.token));
        dispatch(setSelfInfo({user_id: result.user_id}));
        StorageFactory.setSession('USER_LOGIN_INFO', {
          user_id: result.user_id,
          token: result.token,
        });
        //console.log('token---', token, user_id);
      }
    },
  });
  useEffect(() => {
    const requestParams = Object.assign(
      {},
      {
        account: 'heshi',
        device_id: '0c5d47eb-312a-440c-a302-9d1334507fdb',
        login_type: 2,
        operation_id: Date.now().toString(),
        password: 'heshi123',
        platform: 5,
      },
    );
    //handleLogin.run(requestParams)
  }, []);

  //连接mqtt
  useEffect(() => {
    const domainList = domains?.list || backDomains?.list || [];
    const domain = domainList[0]?.domain;
    if (domain && token && user_id) {
      //每次切换的时候都提前预加载自己的头像
      face_url && FastImage.preload([{uri: formatUrl(face_url) || ''}]);
      imsdk.setConnectUrl('ws://' + domain + ':8083/mqtt');
      imsdk.login({user_id, token}).catch(err => {
        console.debug('MqttProvider init err ', err);
      });
    }
  }, [domains, token, user_id, backDomains]);

  const updateSelfInfo = (data: any) => {
    dispatch(setSelfInfo(data));
  };
  const onConversationListUpdate = (data: any) => {
    dispatch(updateConversationList(data));
  };
  const onFreeze = () => {
    dispatch(setUserToken(''));
  };

  // 群配置更新
  const onGroupInfoUpdate = async (state: any) => {
    const res = await imsdk.comlink.getGroupById(state.group_id);
    if (!res?.data) return;
    const {data} = res;
    const {
      group_id,
      create_user_id,
      is_topchat,
      is_disturb,
      robot_total,
      role,
      ...props
    } = state;
    const group = {
      id: data[0]?.id,
      conversation_id: group_id,
      group_id: group_id,
      create_user_id: +create_user_id,
      is_topchat: is_topchat || 0,
      is_disturb: is_disturb || 0,
      // 推送的role都是''
      role: data[0]?.role || 'user',
      name: props.name,

      face_url: props.face_url,
      members_total: props.members_total,
      notification: props.notification,
      introduction: props.introduction,
      create_time: props.create_time,
      status: props.status,
      no_show_normal_member: props.no_show_normal_member,
      no_show_all_member: props.no_show_all_member,
      show_qrcode_by_normal: props.show_qrcode_by_normal_member_v2 || 0,
      join_need_apply: props.join_need_apply,
      ban_remove_by_normal: props.ban_remove_by_normal,
      mute_all_member: props.mute_all_member,
      admins_total: props.admins_total,
      last_version: props.last_version,
      last_member_version: props.last_member_version,
      is_topannocuncement: props.is_topannocuncement,
    };
    await imsdk.comlink.updateGroupById(group);
    const g = await imsdk.comlink.getGroupList();
    if (g?.data?.length) dispatch(setGroupList(g.data));
    if (currentConversation?.conversation_id === group_id) {
      //更新当前群会话
      dispatch(
        updateSettingInfo({
          ...group,
        }),
      );
    }
    await dispatch(
      updateConversationItem({
        data: {
          //更新会话列表item
          conversation_id: group_id,
          group: group,
        },
      }),
    );
  };

  //群聊@消息
  const handleGroupAtInfo = (data: any) => {
    if (currentConversation?.conversation_id === data.conversation_id) return;
    // 设置会话列表@消息
    dispatch(setConversationAtList(data));
  };

  useEffect(() => {
    if (isReady && isConnected && token) {
      getApplyNums();
      dispatch(getSettingConfig());
      // getConversationList();
    }
  }, [isReady, isConnected, token]);

  useEffect(() => {
    // if (isReady && isConnected && token) {
    //   BackgroundTimer.runBackgroundTimer(() => {
    //     console.log('后台运行');
    //   }, 3000);
    // }
    // return () => {
    //   BackgroundTimer.stopBackgroundTimer();
    // };
  }, [isReady, isConnected, token]);

  useEffect(() => {
    imsdk.on(IMSDK.Event.SDK_READY, () => {
      setReady(true);
    });

    imsdk.on(IMSDK.Event.NET_STATE_CHANGE, onConnectStateChange);
    imsdk.on(IMSDK.Event.NET_CONNENT_DELAY_CHANGR, onConnectDelayChange);

    imsdk.on(IMSDK.Event.MESSAGE_RECEIVED, onMessageRecieve);
    imsdk.on(IMSDK.Event.FRIEND_LIST_UPDATED, onFriendUpdate);
    imsdk.on(IMSDK.Event.GROUP_LIST_UPDATED, onGroupListUpdate);
    imsdk.on(IMSDK.Event.CONVERSATION_LIST_UPDATED, onConversationListUpdate);

    //群配置更新
    imsdk.on(IMSDK.dataType['MessageGroupInfoUpdate'], onGroupInfoUpdate);

    // dispatch(updateConversationList(result));
    imsdk.on(IMSDK.dataType.MessageGroupNotify, async data => {
      //申请加群通过通知
      if (user_id !== data.create_user_id) {
        createNewGroupData(data);
      }
    });
    imsdk.on(IMSDK.dataType.MessageFriendNotify, newFriendApply);

    imsdk.on(100, updateSelfInfo); //更新个人信息
    imsdk.on(150, onFreeze); //冻结用户
    imsdk.on(403, clearData); //清空数据
    imsdk.on(404, newVideo); //触发视频通话
    imsdk.on(305, newGroupMember); //新的群成员
    imsdk.on(306, removeMove); //移除群成员
    imsdk.on(IMSDK.dataType.MessageGroupMemberChange, data => {
      // 307
      const muteUserList = [],
        unMuteUserList = [];
      data.forEach((item: any) => {
        // 前端SQL没nick_name等
        const {id, nick_name, account, face_url, ...other} = item;
        updateGroupMember(item.group_id, item.user_id, other);
        if (item.mute_end_time > 0) {
          muteUserList.push(item);
        } else {
          unMuteUserList.push(item);
        }
      });
      if (muteUserList.length > 0) {
        dispatch(updateSettingInfo({muteUserList}));
      } else if (unMuteUserList.length > 0) {
        dispatch(updateSettingInfo({unMuteUserList}));
      }
    });
    imsdk.on(301, removeGroupMember); //自己被移除
    imsdk.on(303, newGroupApply); //新入群申请
    imsdk.on(308, handleGroupAtInfo); // 群聊@消息
    // imsdk.on(301,(state)=>{
    //     console.log(state,'89080qew',state.group_id);
    //     onGroupListUpdate({groupList:[state.group_id],type:2});
    // });//退出群、被移除群、解散群
    imsdk.on(203, data => {
      onFriendUpdate({friendList: [data.user_id], type: 2});
    }); //删除好友
    imsdk.on(IMSDK.dataType.MessageFniendAddNotify, async data => {
      //好友通过通知
      await imsdk.comlink.insertUserList([
        {
          user_id: data.user_id,
          face_url: data.face_url,
          nick_name: data.nick_name,
          age: data.age,
          account: data.account,
          phone_number: data.phone_number,
          login_ip: data.login_ip,
          gender: data.gender,
          signatures: data.signatures,
        },
      ]);
      onFriendUpdate({
        friendList: [
          {
            user_id: data.user_id,
            conversation_id: data.user_id,
            remark: data.remark,
            create_time: data.create_time,
            friend_status: data.friend_status || 1,
            online_status: data.online_status || 2,
            black_status: data.black_status || 2,
          },
        ],
        type: 1,
      });
    });

    // 这里新增
    imsdk.on(IMSDK.dataType.MessageFniendSetRemarkNotify, async data => {
      //用户更新通
      let {user_id, remark, ...others} = data;
      await imsdk.comlink.updateFriendById({remark, user_id});
      let temp = JSON.parse(
        JSON.stringify(store.getState().contacts.friendList),
      ).map(item => {
        if (item.user_id === user_id) {
          return {
            ...item,
            ...others,
            remark: remark,
          };
        }
        return item;
      });
      dispatch(setFriendList(temp));
      let temp2 = JSON.parse(
        JSON.stringify(store.getState().conversation.conversationList),
      );
      temp2.forEach(item => {
        if (item.type === 1 && item.user.user_id == user_id) {
          item.user = {
            ...item.user,
            ...others,
            remark: remark,
          };
        }
      });
      dispatch(updateConversationList(temp2));
    });

    const handleShieldList = () => {
      dispatch(
        getShieldList({
          operation_id: Date.now(),
          page: 1,
          page_size: 999999,
        }),
      );
    };

    imsdk.on(500, handleGlobalConfig); // 系统配置消息通知
    imsdk.on(501, handleShieldList); // 铭感词消息通知

    const handleRemindCircle = (data: any) => {
      const newData = {
        ...data,
        type: '701',
      };
      dispatch(setRemindCiircle(newData));
    };
    const handleRemindLike = (data: any) => {
      const newData = {
        ...data,
        type: '702',
      };
      dispatch(setRemindCiircle(newData));
    };
    const handleRemindCommon = (data: any) => {
      const newData = {
        ...data,
        type: '703',
      };
      dispatch(setRemindCiircle(newData));
    };

    imsdk.on(701, handleRemindCircle); //朋友圈提醒谁看
    imsdk.on(702, handleRemindLike); //朋友圈点赞
    imsdk.on(703, handleRemindCommon); //朋友圈评论

    return () => {
      imsdk.off(IMSDK.Event.SDK_READY);

      imsdk.off(IMSDK.Event.NET_STATE_CHANGE, onConnectStateChange);
      imsdk.off(IMSDK.Event.NET_CONNENT_DELAY_CHANGR, onConnectDelayChange);

      imsdk.off(IMSDK.dataType.MessageFriendNotify, newFriendApply);
      imsdk.off(300);
      imsdk.off(201);
      imsdk.off(IMSDK.dataType['MessageGroupInfoUpdate']);
      imsdk.off(304);
      imsdk.off(305);
      imsdk.off(306);
      imsdk.off(308);
      imsdk.off(IMSDK.dataType.MessageGroupMemberChange);
      imsdk.off(303);
      imsdk.off(203);
      imsdk.off(404);
      imsdk.off(403);
      imsdk.off(501);
      imsdk.off(IMSDK.dataType.MessageFniendSetRemarkNotify);
      imsdk.off(701, handleRemindCircle); //朋友圈提醒谁看
      imsdk.off(702, handleRemindLike); //朋友圈点赞
      imsdk.off(703, handleRemindCommon); //朋友圈评论
    };
  }, []);

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <Context.Provider
      value={{
        isReady,
        isConnected,
      }}>
      <MessageNotify />
      {children}
    </Context.Provider>
  );
}
