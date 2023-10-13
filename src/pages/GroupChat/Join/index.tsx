import React, {useEffect, useState} from 'react';
import {View, Text, Avatar} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {opacity, pt} from '@/utils/dimension';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import FullButton from '@/components/FullButton';
import {Navbar} from '@/components';
import {face2faceInvite, face2faceAdd} from '@/api/group';
import {formatUrl} from '@/utils/common';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  checkoutConversation,
  updateCurrentMessageList,
  updateSettingInfo,
  updateConversationItem,
} from '@/store/reducers/conversation';
import uuid from 'react-native-uuid';

export default function Join(props) {
  const verifyCode = props.route.params.verifyCode;
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const [users, setUser] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (verifyCode) {
      face2faceInvite({
        group_number: verifyCode,
        operation_id: `${Date.now()}`,
      })
        .then(res => {
          setUser(res?.users || []);
        })
        .catch(res => {});
    }
  }, [verifyCode]);

  const getGroupInfo = group_id => {
    //获取群信息
    const promiseArr = [
      imsdk.getGroupMemberList({group_id, is_mute: 1, page_size: 1000}),
      imsdk.getGroupProfile(group_id),
    ];
    Promise.all(promiseArr).then(res => {
      const groupInfo: any = res[1];
      groupInfo.muteUserList = res[0].list;
      dispatch(updateSettingInfo(groupInfo));
    });
    // return imsdk.getGroupProfile(group_id).then((res) => {
    //     if (res.group_id) {
    //         dispatch(updateSettingInfo(res));
    //     }
    // }).catch((res)=>{
    // });
  };

  const getGroupChat = async item => {
    console.log(item, 'itemadsas');
    //    const {data}=await imsdk.comlink.getConversationById(item.conversation_id);
    const list = await imsdk.getConversationList();
    const hasGroup = list.filter(
      conv => conv?.conversation_id === item.group_id,
    );
    //    console.log(list)
    //    console.log(data,'dataqeqe');
    if (hasGroup.length && hasGroup[0]?.conversation_id) {
      const {data} = await imsdk.comlink.getConversationById(
        hasGroup[0].conversation_id,
      );
      if (data.length && data[0].status !== 0) {
        dispatch(updateCurrentMessageList([]));
        dispatch(updateSettingInfo(null));
        dispatch(checkoutConversation(hasGroup[0].conversation_id));

        await dispatch(
          updateConversationItem({data: {...hasGroup[0], unread_count: 0}}),
        );

        data[0].unread_count = 0;
        getGroupInfo(data[0].group_id);
        await imsdk.comlink.updateConversationById(data[0]);

        if (data[0]?.max_seq) {
          imsdk.conversation_ack_seq(
            data[0].type,
            data[0].conversation_id,
            data[0].max_seq,
          );
        }
        // imsdk.fetchMessage(data[0].type, data[0].group_id, data[0].max_seq)
        navigate('Chat');

        return;
      }
    }
    const uid = uuid.v4();
    await imsdk.comlink.insertConversationList([
      {
        conversation_id: item.group_id,
        type: 2,
        group_id: item.group_id,
        latest_message: '',
        status: 1,
        unread_count: 0,
      },
    ]);
    await imsdk.comlink.insertGroupList([
      {
        id: uid,
        group_id: +item.group_id,
        conversation_id: item.group_id,
        name: item.name,
        role: item.role,
        face_url: item.face_url,
        members_total: item.members_total,
        notification: item.notification,
        introduction: item.introduction,
        create_time: item.create_time,
        create_user_id: +item.create_user_id,
        status: item.status,
        no_show_normal_member: item.no_show_normal_member,
        no_show_all_member: item.no_show_all_member,
        show_qrcode_by_normal: item.show_qrcode_by_normal,
        join_need_apply: item.join_need_apply,
        ban_remove_by_normal: item.ban_remove_by_normal,
        mute_all_member: item.mute_all_member,
        admins_total: item.admins_total,
        last_version: item.last_version,
        last_member_version: item.last_member_version,
        is_topchat: item.is_topchat || 0,
        is_disturb: item.is_disturb || 0,
        is_topannocuncement: item.is_topannocuncement,
      },
    ]);
    await imsdk.getConversationList().then(async res => {
      console.log('update==========>', res);
      dispatch(checkoutConversation(item.group_id));
    });
    navigate('Chat');
  };

  const join = () => {
    face2faceAdd({
      group_number: verifyCode,
      operation_id: `${Date.now()}`,
    }).then(res => {
      console.log('resjoin', res);
      getGroupChat(res);
      // 进入群聊
    });
  };

  return (
    <>
      <Navbar title={verifyCode} />
      <View flex centerH>
        <Text
          style={{
            marginTop: pt(53),
            fontSize: pt(29),
            fontWeight: 'bold',
            color: '#7581FF',
          }}>
          {verifyCode}
        </Text>
        <Text
          style={{
            marginTop: pt(25),
            marginBottom: pt(50),
            fontSize: pt(16),
            color: '#12203B',
          }}>
          {t('这些朋友也将进入该群聊')}
        </Text>
        {users.map((item: any) => {
          return (
            <View
              key={item.user_id}
              row
              centerV
              style={{
                marginVertical: pt(5),
              }}>
              <Avatar
                {...{
                  name: item.nick_name,
                  size: pt(27),
                  source: {
                    uri: formatUrl(item.face_url),
                  },
                }}
              />
              <Text
                style={{
                  marginLeft: pt(10),
                  fontSize: pt(14),
                }}>
                {item.nick_name}
              </Text>
            </View>
          );
        })}
      </View>
      <FullButton
        label={t('立即加入')}
        onPress={() => {
          join();
        }}
      />
    </>
  );
}
