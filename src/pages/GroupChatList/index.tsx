import {useState, useEffect, useMemo} from 'react';
import {View} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {Navbar, Empty} from '@/components';
import SearchInput from '@/components/SearchInput';
import GroupIndexList from '@/components/GroupIndexList';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  checkoutConversation,
  updateCurrentMessageList,
  updateSettingInfo,
  updateConversationItem,
} from '@/store/reducers/conversation';
import {setGroupList} from '@/store/actions/contacts';
import uuid from 'react-native-uuid';

export default function Contacts() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {navigate} = useNavigation();
  const [searchKey, setSearchKey] = useState('');
  const groupList: any = useSelector<any>(
    state => state.contacts.groupList,
    shallowEqual,
  );
  useEffect(() => {
    if (groupList.length) {
      imsdk.subscribeGroup(groupList);
    }
  }, [groupList]);

  const list = useMemo(() => {
    if (searchKey.length) {
      const list = groupList.filter(group => {
        const name = group.name;
        return name.toLowerCase().includes(searchKey.toLowerCase());
      });
      return list;
    } else {
      return groupList;
    }
  }, [groupList, searchKey]);

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

  const getGroupChat = async res => {
    dispatch(checkoutConversation(res.group_id));
    navigate('Chat');

    // const arr = Object.keys(res);
    // // setIsLoading(false);
    // // closeOpen();
    // // success(t('创建成功') + '!');
    // // setIsCheckAll(false);
    // dispatch(
    //   updateCurrentMessageList({
    //     data: [],
    //   }),
    // );
    // dispatch(checkoutConversation(''));

    // const client_msg_id = uuid.v4();
    // const data: any = {
    //   conversation_id: res.group_id,
    //   type: 2,
    //   group_id: res.group_id,
    //   latest_message: client_msg_id,
    //   status: 1,
    //   unread_count: 0,
    //   max_seq: 1,
    //   ack_seq: 1,
    //   deleted_at: 0,
    // };
    // await imsdk.comlink.insertConversationList([data]);
    // await imsdk.comlink.insertGroupList([
    //   {
    //     id: res.id,
    //     group_id: +res.group_id,
    //     conversation_id: res.group_id,
    //     name: res.name,
    //     role: res.role,
    //     face_url: res.face_url,
    //     members_total: res.members_total,
    //     notification: res.notification,
    //     introduction: res.introduction,
    //     create_time: res.create_time,
    //     create_user_id: +res.create_user_id,
    //     status: res.status,
    //     no_show_normal_member: res.no_show_normal_member,
    //     no_show_all_member: res.no_show_all_member,
    //     show_qrcode_by_normal: res.show_qrcode_by_normal,
    //     join_need_apply: res.join_need_apply,
    //     ban_remove_by_normal: res.ban_remove_by_normal,
    //     mute_all_member: res.mute_all_member,
    //     admins_total: res.admins_total,
    //     last_version: res.last_version,
    //     last_member_version: res.last_member_version,
    //     is_topchat: res.is_topchat || 0,
    //     is_disturb: res.is_disturb || 0,
    //     is_topannocuncement: res.is_topannocuncement,
    //   },
    // ]);
    // const messageEntity = {
    //   client_msg_id: client_msg_id,
    //   msg_id: client_msg_id,
    //   conversation_id: res.group_id,
    //   send_id: '',
    //   send_nickname: '',
    //   send_face_url: '',
    //   send_time: res.create_time * 1000,
    //   conversation_type: 2,
    //   bus_id: '',
    //   type: 301,
    //   status: 0,
    //   seq: 1,
    //   content: '你已成功创建群聊${groupName}，快邀请好友进群', //msg组件替换groupname
    // };
    // await imsdk.comlink.insertMessageList([messageEntity]);
    // const result = await imsdk.getConversationList(); //更新会话
    // dispatch(checkoutConversation(res.group_id));
    // dispatch(updateConversationItem({data}));
    // imsdk.subscribeGroupChat(res.group_id, () => {
    //   imsdk.subscribeGroups(res.group_id, () => {
    //     if (!arr.length) {
    //       return;
    //     }
    //     // navigate('GroupChat');
    //     navigate('Chat');
    //     // dispatch(setGroupList(data));
    //   });
    // });
  };

  return (
    <>
      <Navbar title="群聊" />
      <View flex>
        <SearchInput
          placeholder={t('搜索')}
          style={{
            margin: pt(16),
            marginBottom: 0,
          }}
          onChange={(keyword: string) => {
            setSearchKey(keyword);
          }}
        />
        {!list.length && <Empty tip="暂无群聊" />}
        {!!list.length && (
          <GroupIndexList
            source={list}
            onPress={(_, item) => {
              getGroupChat(item);
            }}
          />
        )}
      </View>
    </>
  );
}
