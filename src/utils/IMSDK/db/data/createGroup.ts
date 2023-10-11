import uuid from 'react-native-uuid';
import {initGroupMemberData} from './initGroupMember';
import {IMSDK} from '../../types';
import imsdk from '@/utils/IMSDK';
export const createNewGroupData = async (group) => {
    console.debug('createNewGroupData-----',group,'513213213')
        const uid = uuid.v4();
       let ctemp={
            conversation_id: group.group_id,
            type: 2,
            group_id: group.group_id,
            latest_message: '',
            status: 1,
            unread_count: 0,
            max_seq: 1,
            ack_seq: 1
        };
        await initGroupMemberData(group.group_id);
        let tmp={
            id: uid,
            group_id: group.group_id,
            conversation_id: group.group_id,
            name: group.name,
            role: group.role,
            face_url: group.face_url,
            members_total: group.members_total,
            notification: group.notification,
            introduction: group.introduction,
            create_time: group.create_time,
            create_user_id: group.create_user_id,
            status: group.status,
            no_show_normal_member: group.no_show_normal_member,
            no_show_all_member: group.no_show_all_member,
            show_qrcode_by_normal: group.show_qrcode_by_normal,
            join_need_apply: group.join_need_apply,
            ban_remove_by_normal: group.ban_remove_by_normal,
            mute_all_member: group.mute_all_member,
            admins_total: group.admins_total,
            last_version: group.last_version,
            last_member_version: group.last_member_version,
            is_topchat: group.is_topchat || 0,
            is_disturb: group.is_disturb || 0,
            is_topannocuncement: group.is_topannocuncement
        };
        imsdk.subscribeGroupChat(group.group_id)
        imsdk.subscribeGroups(group.group_id)
        await imsdk.comlink.insertConversationList([ctemp]);//插入群会话
        imsdk.emit(IMSDK.Event.GROUP_LIST_UPDATED,{groupList:[tmp],type:1});
};