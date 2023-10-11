import React, {useEffect, useState} from 'react';
import {Text, Switch, TextField, View} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {pt} from '@/utils/dimension';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import FullButton from '@/components/FullButton';
import {Navbar, ConfirmModal, Popup} from '@/components';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import ListMenuItem from '@/components/ListMenuItem';
import {setGroupList} from '@/store/actions/contacts';
import {Toast, Picker} from '@ant-design/react-native';
import {RootState} from '@/store';
import {ScrollView} from 'react-native-gesture-handler';

const mute_all_member_map = {
  2: '不禁',
  1: '永久禁言',
  3: '新入群禁言',
  4: '时段禁言',
};
export default function Manage(props: any) {
  const groupInfo = props.route.params.groupInfo || {};
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [joinNeedApply, setJoinNeedApply] = useState(false);
  const [noShowNormalMember, setNoShowNormalMember] = useState(false);
  const [noShowAllMember, setNoShowAllMember] = useState(false);
  const [showQrcodeByNormal, setShowQrcodeByNormal] = useState(false);
  const [isOpenAdminIcon, setIsOpenAdminIcon] = useState(false);
  const [banRemoveByNormal, setBanRemoveByNormal] = useState(false);
  const [muteAllMember, setMuteAllMember] = useState(2);
  const [isOpenAdminList, setIsOpenAdminList] = useState(false);
  const [isOpenGroupId, setIsOpenGroupId] = useState(false);
  const [group_send_limit, setGroupSendLimit] = useState(0);

  useEffect(() => {
    setJoinNeedApply(groupInfo.join_need_apply == 1);
    setJoinNeedApply(groupInfo.join_need_apply == 1);
    setNoShowNormalMember(groupInfo.no_show_normal_member == 1);
    setNoShowAllMember(groupInfo.no_show_all_member == 1);
    setShowQrcodeByNormal(groupInfo.show_qrcode_by_normal_member_v2 == 1);
    setBanRemoveByNormal(groupInfo.ban_remove_by_normal == 1);
    setMuteAllMember(groupInfo.mute_all_member);
    setIsOpenAdminIcon(groupInfo.is_open_admin_icon == 1);
    setIsOpenAdminList(groupInfo.is_open_admin_list == 1);
    setIsOpenGroupId(groupInfo.is_open_group_id == 1);
    setGroupSendLimit(groupInfo.group_send_limit || 0);
  }, [groupInfo]);

  const currentConversation = useSelector<RootState, IMSDK.Conversation>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );

  const formatGroupEntity = (item: any) => {
    return {
      id: item.id,
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
      show_qrcode_by_normal: item.show_qrcode_by_normal_member_v2 || 0,
      join_need_apply: item.join_need_apply,
      ban_remove_by_normal: item.ban_remove_by_normal,
      mute_all_member: item.mute_all_member,
      admins_total: item.admins_total,
      last_version: item.last_version,
      last_member_version: item.last_member_version,
      is_topchat: item.is_topchat || 0,
      is_disturb: item.is_disturb || 0,
      is_topannocuncement: item.is_topannocuncement,
    };
  };

  const updateGroupInfo = data => {
    //更新群信息
    return imsdk
      .setGroupAttributes({
        group_id: groupInfo.group_id,
        attributes: {
          // ...props.info,
          ...data,
        },
      })
      .then(async res => {
        if (!res?.group_id) {
          return;
        }
        const {robot_total, ...other} = res;

        //console.log(other, 'other');
        // const group;
        const groupInfo = formatGroupEntity(other);

        await imsdk.comlink.updateGroupById({
          ...groupInfo,
        });
        const g = await imsdk.comlink.getGroupList();
        if (g?.data?.length) {
          dispatch(setGroupList(g.data));
        }
        Toast.info(t('更新成功'));
      })
      .catch(res => {});
  };

  const onOpenGroupIdChange = (checked: boolean) => {
    setIsOpenGroupId(checked);
    updateGroupInfo({is_open_group_id: checked ? 1 : 2});
  };
  const onJoinApplyChange = (checked: boolean) => {
    setJoinNeedApply(checked);
    updateGroupInfo({join_need_apply: checked ? 1 : 2});
  };
  const onOpenAdminListChange = (checked: boolean) => {
    setIsOpenAdminList(checked);
    updateGroupInfo({is_open_admin_list: checked ? 1 : 2});
  };
  const onOpenAdminIconChange = (checked: boolean) => {
    setIsOpenAdminIcon(checked);
    updateGroupInfo({is_open_admin_icon: checked ? 1 : 2});
  };
  const onChange = (checked: boolean) => {
    setShowQrcodeByNormal(checked);
    updateGroupInfo({show_qrcode_by_normal_member_v2: checked ? 1 : 2});
  };
  const onNoshowNormalChange = (checked: boolean) => {
    //隐藏普通成员列表
    setNoShowNormalMember(checked);
    updateGroupInfo({no_show_normal_member: checked ? 1 : 2});
  };
  const onNoshowAllChange = (checked: boolean) => {
    //隐藏所有成员列表
    setNoShowAllMember(checked);
    updateGroupInfo({no_show_all_member: checked ? 1 : 2});
  };
  const onBanRemoveChange = (checked: boolean) => {
    //禁止成员退群
    setBanRemoveByNormal(checked);
    //ban_remove_by_normal 禁止普通用户退群 1 禁止 2 允许
    updateGroupInfo({ban_remove_by_normal: checked ? 1 : 2});
  };
  const muteChange = val => {
    setMuteAllMember(val);
    updateGroupInfo({mute_all_member: val});
  };

  const dismissGroup = () => {
    //解散群
    return imsdk
      .dismissGroup(groupInfo.group_id)
      .then(async res => {
        Toast.info(t('解散成功'));
        if (currentConversation?.conversation_id) {
          await imsdk.deleteConversation(currentConversation.conversation_id);
          imsdk.emit(IMSDK.Event.GROUP_LIST_UPDATED, {
            groupList: [groupInfo.group_id],
            type: 2,
          });
        }
        navigate({name: 'Message'});
      })
      .catch(res => {});
  };

  return (
    <>
      <Navbar title={t('群管理')} />
      <ScrollView>
        {/* <ListMenuItem
          noActiveBg
          label={`${t('隐藏群主')}/${t('管理员列表')}`}
          text={t(
            '群内的普通成员禁止查看群主和管理员列表，群主和管理员不受限制。',
          )}
          right={
            <Switch
              value={isOpenAdminList}
              onValueChange={onOpenAdminListChange}
            />
          }
        /> */}
        <ListMenuItem
          noActiveBg
          label={t('隐藏普通群成员列表')}
          text={t(
            '群内的普通成员禁止查看普通群成员列表，不允许互加好友；群主和管理员不受限制。',
          )}
          right={
            <Switch
              value={noShowNormalMember}
              onValueChange={onNoshowNormalChange}
            />
          }
        />
        {/* <ListMenuItem
          noActiveBg
          label={t('隐藏所有群成员列表')}
          text={t(
            '群内的普通成员禁止查看普通群成员列表，不允许互加好友；群主和管理员同样受限制。',
          )}
          right={
            <Switch value={noShowAllMember} onValueChange={onNoshowAllChange} />
          }
        /> */}
        {/* <ListMenuItem
          noActiveBg
          label={t('显示群主/管理员图标')}
          right={
            <Switch
              value={isOpenAdminIcon}
              onValueChange={onOpenAdminIconChange}
            />
          }
        /> */}
        <ListMenuItem
          noActiveBg
          label={t('允许普通群成员查看群二维码')}
          right={<Switch value={showQrcodeByNormal} onValueChange={onChange} />}
        />
        <ListMenuItem
          noActiveBg
          label={t('允许普通群成员查看群账号')}
          right={
            <Switch value={isOpenGroupId} onValueChange={onOpenGroupIdChange} />
          }
        />
        <ListMenuItem
          noActiveBg
          label={t('进群是否需要审核')}
          // text={t(
          //   '启用后，群成员需群主或群管理员确认才能邀请朋友进群。扫描二维码进群将同时停用',
          // )}
          right={
            <Switch value={joinNeedApply} onValueChange={onJoinApplyChange} />
          }
        />
        <ListMenuItem
          noActiveBg
          label={t('禁止群成员退群')}
          right={
            <Switch
              value={banRemoveByNormal}
              onValueChange={onBanRemoveChange}
            />
          }
        />
        {/* <ListMenuItem
          noActiveBg
          label={t('发言频率')}
          rightContent={
            <Text
              style={{
                textAlign: 'right',
                color: '#999999',
                fontSize: pt(14),
              }}>
              {group_send_limit}
            </Text>
          }
          onPress={() => {
            setVisible1(true);
          }}
        /> */}
        <ListMenuItem
          noActiveBg
          label={t('禁言列表')}
          onPress={() => {
            navigate('GroupChatMuteMember', {groupInfo});
          }}
        />
        <ListMenuItem
          noActiveBg
          label={t('全员禁言')}
          rightContent={
            <Picker
              style={{flex: 1, width: pt(200)}}
              data={[
                {
                  label: t('不禁'),
                  value: 2,
                },
                {
                  label: t('永久禁言'),
                  value: 1,
                },
                {
                  label: t('新入群禁言'),
                  value: 3,
                },
                // {
                //   label: t('时段禁言'),
                //   value: 4,
                // },
              ]}
              cols={1}
              value={muteAllMember}
              onChange={e => {
                console.log(e);
                muteChange(e[0]);
              }}>
              <Text
                style={{
                  textAlign: 'right',
                  color: '#999999',
                  fontSize: pt(14),
                }}>
                {mute_all_member_map[muteAllMember]}
              </Text>
            </Picker>
          }
        />
        {/* <ListMenuItem
          noActiveBg
          label={t('仅限群主/群管理员可修改群聊名称')}
          right={<Switch value={false} onValueChange={() => {}} />}
        /> */}
        {groupInfo.role === 'owner' && (
          <ListMenuItem
            noActiveBg
            label={t('群主管理权转让')}
            onPress={() =>
              navigate('GroupChatMember', {groupInfo, type: 'setOwner'})
            }
          />
        )}
        <ListMenuItem
          noActiveBg
          label={t('群管理员')}
          onPress={() => {
            navigate('GroupChatMember', {groupInfo, type: 'owner'});
          }}
        />
      </ScrollView>
      <FullButton
        danger
        outline
        text={t('解散该群')}
        onPress={() => {
          setVisible(true);
        }}
      />
      <ConfirmModal
        title={t('解散群聊')}
        content={t('确定解散该群聊吗?')}
        showClose
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onConfirm={() => {
          setVisible(false);
          dismissGroup();
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
          <View row>
            <Text
              style={{
                fontSize: pt(15),
                fontWeight: 'bold',
                color: '#000',
                marginBottom: pt(20),
              }}>
              {t('发言频率')}
            </Text>
            <Text
              style={{
                fontSize: pt(13),
                color: '#999',
                marginBottom: pt(20),
              }}>
              (0-10000秒)
            </Text>
          </View>
          <View
            style={{
              marginBottom: pt(20),
            }}>
            <TextField
              keyboardType="numeric"
              value={`${group_send_limit}`}
              onChangeText={text => {
                let newText = text.replace(/[^0-9]/g, '');
                if (newText >= 0 || newText <= 10000) {
                  setGroupSendLimit(newText);
                }
              }}
              multiline={true}
              numberOfLines={2}
              style={{
                height: pt(90),
              }}
              placeholder="填写发言频率"
            />
          </View>
          <FullButton
            text={t('完成')}
            onPress={() => {
              setVisible1(false);
              updateGroupInfo({group_send_limit: +group_send_limit});
            }}
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
