import React, {useState} from 'react';
import {
  View,
  Text,
  TextField,
  TouchableOpacity,
  Icon,
  Image,
} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import * as toast from '@/utils/toast';
import FullButton from '@/components/FullButton';
import {Navbar} from '@/components';
import {ImagePickerUpload} from '@/components/ImagePickUpload';
import imsdk from '@/utils/IMSDK';
import {Toast} from '@ant-design/react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import uuid from 'react-native-uuid';
import {setGroupList} from '@/store/actions/contacts';
import {initGroupMemberData} from '@/utils/IMSDK/db/data/initGroupMember';
import {
  checkoutConversation,
  insertCurrentMessageList,
  updateSettingInfo,
  updateConversationItem,
  updateCurrentMessageList,
} from '@/store/reducers/conversation';
import {selectPhotoTapped} from '@/components/ImagePickUpload/photoCamera';
import {set} from 'lodash-es';
import GlobalLoading from '@/components/Loading/globalLoading';

export default function Create(props) {
  const selecteds = props.route.params.selecteds;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation();
  const {navigate, reset} = useNavigation();
  const [isShow, setIsShow] = useState(false); // 图片选择上传
  const [title, setTitle] = useState('');
  const [face_url, setFace_url] = useState('');

  const getGroupInfo = (group_id: string) => {
    //获取群禁言信息,群信息
    const promiseArr = [
      imsdk.getGroupMemberList({group_id, is_mute: 1, page_size: 1000}),
      imsdk.getGroupProfile(group_id),
    ];
    Promise.all(promiseArr).then(res => {
      const groupInfo: any = res[1];
      groupInfo.muteUserList = res[0].list;
      dispatch(updateSettingInfo(groupInfo));
    });
  };

  const inviteMember = (
    group_id: string,
    user_id_list: Array<any>,
    fn?: Function,
  ) => {
    return imsdk
      .inviteToGroup({group_id, user_id_list})
      .then(async res => {
        if (fn) {
          fn();
        }
      })
      .catch(() => {
        if (fn) {
          fn();
        }
      });
  };

  const onCreate = () => {
    setLoading(true);
    GlobalLoading.startLoading({text: '创建中...'});
    return imsdk
      .createGroup(title, face_url)
      .then(async res => {
        const arr = Object.keys(selecteds);
        // setIsLoading(false);
        // closeOpen();
        // success(t('创建成功') + '!');
        // setIsCheckAll(false);
        dispatch(
          updateCurrentMessageList({
            data: [],
          }),
        );
        dispatch(checkoutConversation(''));

        const client_msg_id = uuid.v4();
        await imsdk.comlink.insertConversationList([
          {
            conversation_id: res.group_id,
            type: 2,
            group_id: res.group_id,
            latest_message: client_msg_id,
            status: 1,
            unread_count: 0,
            max_seq: 1,
            ack_seq: 1,
            deleted_at: 0,
            name: res.name,
          },
        ]);
        await imsdk.comlink.insertGroupList([
          {
            id: res.id,
            group_id: +res.group_id,
            conversation_id: res.group_id,
            name: res.name,
            role: res.role,
            face_url: res.face_url,
            members_total: res.members_total,
            notification: res.notification,
            introduction: res.introduction,
            create_time: res.create_time,
            create_user_id: +res.create_user_id,
            status: res.status,
            no_show_normal_member: res.no_show_normal_member,
            no_show_all_member: res.no_show_all_member,
            show_qrcode_by_normal: res.show_qrcode_by_normal,
            join_need_apply: res.join_need_apply,
            ban_remove_by_normal: res.ban_remove_by_normal,
            mute_all_member: res.mute_all_member,
            admins_total: res.admins_total,
            last_version: res.last_version,
            last_member_version: res.last_member_version,
            is_topchat: res.is_topchat || 0,
            is_disturb: res.is_disturb || 0,
            is_topannocuncement: res.is_topannocuncement,
          },
        ]);
        const messageEntity = {
          client_msg_id: client_msg_id,
          msg_id: client_msg_id,
          conversation_id: res.group_id,
          send_id: '',
          send_nickname: '',
          send_face_url: '',
          send_time: res.create_time * 1000,
          conversation_type: 2,
          bus_id: '',
          type: 301,
          status: 0,
          seq: 1,
          content: '你已成功创建群聊${groupName}，快邀请好友进群', //msg组件替换groupname
        };
        await imsdk.comlink.insertMessageList([messageEntity]);
        const result = await imsdk.getConversationList(); //更新会话
        dispatch(checkoutConversation(res.group_id));

        imsdk.subscribeGroupChat(res.group_id, () => {
          imsdk.subscribeGroups(res.group_id, async () => {
            if (!arr.length) {
              initGroupMemberData(res.group_id);
              const {data} = await imsdk.comlink.getGroupList(); //更新群列表
              // navigate('GroupChat', {source: 'create'});
              navigate('Chat', {source: 'createGroup'});

              dispatch(setGroupList(data));
              return;
            }
            inviteMember(res.group_id, arr, async () => {
              initGroupMemberData(res.group_id);
              const {data} = await imsdk.comlink.getGroupList(); //更新群列表
              // navigate('GroupChat', {source: 'create'});
              navigate('Chat', {source: 'createGroup'});

              dispatch(setGroupList(data));
            });
          });
        });
      })
      .finally(() => {
        setLoading(false);
        GlobalLoading.endLoading();
      });
    //     imsdk
    //       .createGroup(title)
    //       .then(res => {
    //         console.log('res', res);
    //
    //         imsdk
    //           .inviteToGroup({
    //             user_id_list: Object.keys(selecteds),
    //             group_id: res.group_id,
    //           })
    //           .then(async () => {
    //             console.log('创建成功', res);
    //             Toast.info({content: '创建成功'});
    //             const conv_id = res.group_id;
    //             dispatch(checkoutConversation(conv_id));
    //             dispatch(updateCurrentMessageList([]));
    //             dispatch(updateSettingInfo(null));
    //
    //             getGroupInfo(conv_id);
    //
    //             // await dispatch(updateConversationItem({data: conv}));
    //
    //             await imsdk.comlink.updateConversationById({
    //               conversation_id: conv_id,
    //               unread_count: 0,
    //             });
    //             navigate('GroupChat');
    //             // navigate('GroupChat', {
    //             //   params: {
    //             //     id: res.data.group_id,
    //             //   },
    //             // });
    //           });
    //       })
    //       .catch(e => {
    //         Toast.info({content: e.message});
    //       });
  };

  return (
    <>
      <Navbar title="创建群组" />
      <View flex>
        <View
          style={{
            margin: pt(24),
            marginBottom: 0,
          }}>
          <Text
            style={{
              fontSize: pt(14),
              fontWeight: 'bold',
              color: '#222222',
            }}>
            {t('群名称')}
          </Text>
          <TextField
            value={title}
            placeholder={t('填写群名称（2~15个字）')}
            placeholderTextColor="#B1B1B2"
            containerStyle={{
              marginTop: pt(10),
              padding: pt(5),
              borderBottomWidth: pt(1),
              borderBottomColor: '#E7E7EF',
            }}
            style={{
              fontSize: pt(13),
            }}
            onChangeText={val => setTitle(val)}
          />
        </View>
        <View
          style={{
            margin: pt(24),
            marginBottom: 0,
          }}>
          <Text
            style={{
              fontSize: pt(14),
              fontWeight: 'bold',
              color: '#222222',
            }}>
            {t('群头像')}
          </Text>
          <TouchableOpacity
            center
            style={{
              marginTop: pt(20),
              width: pt(62),
              height: pt(62),
              borderWidth: pt(0.5),
              bordercolor: '#D0D0D5',
              borderRadius: pt(6),
            }}
            onPress={() => {
              // setIsShow(true);
              selectPhotoTapped(true, {
                selectionLimit: 1,
              }).then((res: any) => {
                if (res?.[0]?.thumbnail) {
                  setFace_url(res?.[0]?.thumbnail);
                }
              });
            }}>
            {!!face_url && (
              <Image
                source={{uri: face_url}}
                style={{
                  width: pt(62),
                  height: pt(62),
                  borderRadius: pt(6),
                }}
              />
            )}
            {!face_url && (
              <Icon assetName="upload_add" assetGroup="icons.app" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <FullButton
        text={t('立即创建')}
        onPress={() => {
          if (title.length < 2) {
            toast.error('请输入合适的群名称');
            return;
          }
          if (loading) return;
          onCreate();
          // navigate('GroupChat', {info: {title}});
        }}
      />
      {/* <ImagePickerUpload
        isShow={isShow}
        limit={1}
        onCancel={() => {
          setIsShow(false);
        }}
        type="photo"
        onSelect={e => {
          setFace_url(e?.[0]?.url);
        }}
      /> */}
    </>
  );
}
