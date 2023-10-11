import {useEffect, useState, useMemo} from 'react';
import {View, Text, Icon, TextField} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {useNavigation, CommonActions} from '@react-navigation/native';
import HeaderMore from '@/components/HeaderRight/more';
import {pt} from '@/utils/dimension';
import {Navbar, ActionSheet, Popup} from '@/components';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import Profile from './block/profile';
import Menu from './block/menu';
import FullButton from '@/components/FullButton';
import {
  checkoutConversation,
  updateSettingInfo,
  updateConversationItem,
  updateCurrentMessageList,
} from '@/store/reducers/conversation';

import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {RootState} from '@/store';
import {getUserInfo} from '@/store/actions';
import {setAudioVideoObjStatus} from '@/store/reducers/global';
import {Toast} from '@ant-design/react-native';
import {exists} from 'i18next';

export default function Info(props) {
  const {info} = props.route.params;
  const conversationList = useSelector(
    (state: RootState) => state.conversation.conversationList,
    shallowEqual,
  );
  const currentConversation = useSelector<RootState, IMSDK.Conversation>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );
  const USER = useSelector((state: RootState) => state.user);
  const friendList = useSelector(
    (state: RootState) => state.contacts.friendList,
    shallowEqual,
  );
  const selfInfo = useSelector(
    (state: RootState) => state.user.selfInfo,
    shallowEqual,
  );
  const user_id = useMemo(() => USER.selfInfo.user_id, [USER]);
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(info || {});
  const [visible, setVisible] = useState(false);
  const {t} = useTranslation();
  const [text, setText] = useState('');
  const {navigate, goBack} = useNavigation();
  const [isShow, setIsShow] = useState(false);
  //console.log('friendList', friendList);

  const isFriend = useMemo(() => {
    const arr = friendList.filter(item => item.user_id == info.user_id);
    return arr.length;
  }, [info, friendList]);

  const isOwner = useMemo(() => {
    return info.user_id === user_id;
  }, [info, user_id]);

  useEffect(() => {
    if (isFriend) {
      imsdk
        .getUserProfile(info?.user_id)
        .then(res => {
          setUserInfo(res);
        })
        .catch(() => {
          setUserInfo({
            ...info,
            status: 2,
          });
        });
    } else {
      imsdk
        .getUserInfo(info.user_id)
        .then(res => {
          setUserInfo(res);
        })
        .catch(() => {
          setUserInfo({
            ...info,
            status: 2,
          });
        });
    }
  }, [isFriend]);

  useEffect(() => {
    if (isOwner) {
      dispatch(getUserInfo());
    }
  }, [isOwner]);

  useEffect(() => {
    if (isOwner) {
      setUserInfo(selfInfo);
    }
  }, [isOwner, selfInfo]);

  const getFriendInfo = (friend_id: string) => {
    //获取群信息
    return imsdk
      .getFriendProfile(friend_id)
      .then(res => {
        //console.log('res========>', res);
        if (res?.user_id) {
          dispatch(updateSettingInfo(res));
        }
      })
      .catch(res => {});
  };

  const sendMessage = async item => {
    const {data} = await imsdk.comlink.getConversationCountByUserId(
      item.user_id,
    );
    let conv_id = '';
    let conversation = null;
    if (data?.[0]?.conversation_id) {
      conv_id = data[0].conversation_id;
      const arr = conversationList.filter(
        item => item.conversation_id === conv_id,
      );
      if (arr.length) {
        conversation = arr[0];
      } else {
        conversation = {
          conversation_id: conv_id,
          type: 1,
          friend: item.user_id,
          group_id: '',
          latest_message: '',
          status: 1,
        };
        imsdk.comlink.insertConversationList([conversation]);
      }
    } else {
      conv_id = [item.user_id, user_id].sort((a, b) => a - b).join('_');
      conversation = {
        conversation_id: conv_id,
        type: 1,
        friend: item.user_id,
        group_id: '',
        latest_message: '',
        status: 1,
      };
      imsdk.comlink.insertConversationList([conversation]);
    }

    //dispatch(checkoutConversation(conv_id));
    dispatch(updateCurrentMessageList([]));
    // dispatch(updateSettingInfo(null));

    const conv = JSON.parse(JSON.stringify(conversation));
    conv.unread_count = 0;
    const recv_id = conv.user?.user_id;

    // getFriendInfo(recv_id);
    // 获取当前详情资料的好友信息
    // getFriendInfo(item.user_id);
    dispatch(updateSettingInfo(userInfo));
    await imsdk.getConversationList();
    dispatch(updateConversationItem({data: conv}));
    dispatch(checkoutConversation(conv_id));

    // imsdk.comlink.updateConversationById({
    //   conversation_id: conv.conversation_id,
    //   unread_count: 0,
    // });

    navigate('Chat');
    // openNewScreen();
  };

  const onConfirm = async () => {
    imsdk
      .addFriend({
        user_id: info.user_id,
        req_msg: text,
        remark: '',
      })
      .then(res => {
        Toast.info({content: '添加成功'});
        setVisible(false);
      })
      .catch(res => {
        Toast.info({content: res.message});
        setVisible(false);
      });
  };

  // console.log('9999====>>>',info)

  return (
    <>
      <Navbar
        right={
          isFriend ? (
            <View style={{marginRight: -pt(16)}}>
              <HeaderMore
                onPress={() => {
                  navigate('ContactSetting', {info: userInfo});
                }}
              />
            </View>
          ) : null
        }
      />
      <View flex>
        <Profile userInfo={userInfo} />
        {!!isFriend && <Menu userInfo={userInfo} />}
      </View>
      {!!isFriend && (
        <FullButton
          outline
          label={t('发消息')}
          icon={
            <Icon
              assetName="more_active"
              assetGroup="page.chat.toolbar"
              size={pt(16)}
            />
          }
          onPress={() => {
            if (
              currentConversation?.type == 1 &&
              currentConversation.user?.user_id == userInfo.user_id
            ) {
              goBack();
            } else {
              sendMessage(userInfo);
            }
          }}
          style={{
            marginTop: pt(0),
            marginBottom: pt(10),
          }}
        />
      )}
      {!!isFriend && (
        <FullButton
          outline
          label={t('音视频通话')}
          icon={
            <Icon
              assetName="more_active"
              assetGroup="page.chat.toolbar"
              size={pt(16)}
            />
          }
          onPress={() => {
            setIsShow(true);
          }}
          style={{
            marginTop: pt(0),
          }}
        />
      )}
      {/* {!isFriend && !isOwner && (
        <FullButton
          label={t('添加到联系人')}
          style={{
            marginTop: pt(0),
          }}
          onPress={() => {
            setVisible(true);
          }}
        />
      )} */}
      <ActionSheet
        isShow={isShow}
        onCancel={() => setIsShow(false)}
        buttons={[
          {
            label: '语音通话',
            onClick: () => {
              setIsShow(false);
              dispatch(
                setAudioVideoObjStatus({
                  open: true,
                  conversation_type: 1,
                  type: 1, // 1 语音  2视频
                  user_id: userInfo.user_id,
                }),
              );
            },
          },
          {
            label: '视频通话',
            onClick: () => {
              setIsShow(false);
              dispatch(
                setAudioVideoObjStatus({
                  open: true,
                  conversation_type: 1,
                  type: 2, // 1 语音  2视频
                  user_id: userInfo.user_id,
                }),
              );
            },
          },
        ]}
      />
      <Popup
        visible={visible}
        onDismiss={() => {
          setVisible(false);
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
            {t('填写验证信息')}
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
              style={{
                borderBottomColor: 'rgba(102, 102, 102, 0.1)',
                borderBottomWidth: pt(1),
                height: pt(45),
              }}
              placeholder="填写验证信息"
            />
          </View>
          <FullButton
            text={t('确认')}
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
    </>
  );
}
