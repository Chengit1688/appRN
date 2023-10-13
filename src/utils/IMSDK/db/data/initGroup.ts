import imsdk from '@/utils/IMSDK';
import uuid from 'react-native-uuid';
import {initGroupMemberData} from './initGroupMember';
import {IMSDK} from '../../types';

export const initGroupData = async (groupVersion: Array<any>) => {
  const {data} = await imsdk.comlink.getGroupVersionList();
  const localVersion = data;
  groupVersion.forEach(group => {
    imsdk.subscribeGroupChat(group.group_id);
    imsdk.subscribeGroups(group.group_id);
  });

  const fetchCreateList = async () => {
    let joinList = [];
    let total = Number.MAX_VALUE;
    let page = 1;
    while (total > joinList.length) {
      const result: any = (await imsdk.getMyCreatedGroupList(page)) || {};

      if (!result.list) {
        await imsdk.emit(IMSDK.Event.GROUP_LIST_UPDATED, {
          groupList: [],
          type: 1,
        });
        break;
      }
      // let tmp = [];
      const {data} = await imsdk.comlink.getDisabledConversation();
      const tmp = result.list.map(async (item, index) => {
        const uid = uuid.v4();
        //这里放开是没看到有地方初始化新成员的数据，后续有性能问题在调整

        // const curLocalVersion = localVersion.filter(
        //   (_local: any) => _local.group_id === item.group_id,
        // );

        // const curLocalVersion = await imsdk.comlink.getGroupById(item.group_id);

        // console.log(item, curLocalVersion, '====>创建的群组item');
        // if (
        //   curLocalVersion.data[0]?.last_member_version <
        //   item.last_member_version
        // ) {
        //   initGroupMemberData(item.group_id, {
        //     local_version: curLocalVersion.data[0]?.last_member_version,
        //     server_version: item.last_member_version,
        //   });
        // }
        const tmpObj = {
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
        // if (curLocalVersion.data.length >= 0) {
        //   imsdk.comlink.updateGroupById(tmpObj);
        // }

        return tmpObj;
      });
      const newTmp = await Promise.all(tmp);
      await imsdk.emit(IMSDK.Event.GROUP_LIST_UPDATED, {
        groupList: newTmp,
        type: 1,
      });
      page++;
      total = result?.count ? result.count : 0;
      joinList = joinList.concat(result.list || []);
    }
    return Promise.resolve(joinList);
  };

  const fetchJoinList = async () => {
    let joinList: any = [];
    let total = Number.MAX_VALUE;
    let page = 1;

    while (total > joinList.length) {
      const result: any = (await imsdk.getMyJoinedGroupList(page)) || {};
      if (!result.list) break;
      // let tmp: any = [];
      const {data} = await imsdk.comlink.getDisabledConversation();
      const tmp = result.list.map(async (item: any, index: number) => {
        const uid = uuid.v4();
        // initGroupMemberData(item.group_id);
        // const curLocalVersion = await imsdk.comlink.getGroupById(item.group_id);
        // if (
        //   curLocalVersion.data[0]?.last_member_version <
        //     item.last_member_version ||
        //   curLocalVersion.data.length === 0
        // ) {
        //   initGroupMemberData(item.group_id, {
        //     local_version: curLocalVersion[0]?.last_member_version,
        //     server_version: item.last_member_version,
        //   });
        // }
        const tmpObj = {
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
        // if (curLocalVersion.data.length >= 0) {
        //   imsdk.comlink.updateGroupById(tmpObj);
        // }
        // return tmp.push(tmpObj);
        return tmpObj;
      });
      const newTmp = await Promise.all(tmp);
      await imsdk.emit(IMSDK.Event.GROUP_LIST_UPDATED, {
        groupList: newTmp,
        type: 1,
      });
      page++;
      total = result?.count ? result.count : 0;
      joinList = joinList.concat(result.list || []);
    }
    return Promise.resolve(joinList);
  };

  async function asyncGroupList(groupList: Array<any>, type: number) {
    //批量同步群信息
    imsdk
      .asyncGroupList(
        groupList.map(item => {
          return item.group_id;
        }),
      )
      .then(async res => {
        if (res.list?.length) {
          let tmp = [];
          const {data} = await imsdk.comlink.getDisabledConversation();
          res.list.forEach(async (item: any, index) => {
            // const curLocalVersion = await imsdk.comlink.getGroupById(
            //   item.group_id,
            // );

            // // console.log(item, curLocalVersion, '====>item');
            // if (
            //   curLocalVersion.data[0]?.last_member_version <
            //   item.last_member_version
            // ) {
            //   initGroupMemberData(item.group_id, {
            //     local_version: curLocalVersion.data[0]?.last_member_version,
            //     server_version: item.last_member_version,
            //   });
            // }
            const uid = uuid.v4();
            // if (type === 1) {
            //     initGroupMemberData(item.group_id);
            // } else {//将需要更新的群本地版本与线上版本做对比更新
            //     const group = localVersion.filter((it) => it.group_id === item.group_id);
            //     initGroupMemberData(item.group_id, {
            //         local_version: +group.member_version,
            //         server_version: +item.member_version
            //     });
            // }

            return tmp.push({
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
              show_qrcode_by_normal: item?.show_qrcode_by_normal_member_v2 || 0,
              join_need_apply: item.join_need_apply,
              ban_remove_by_normal: item.ban_remove_by_normal,
              mute_all_member: item.mute_all_member,
              admins_total: item.admins_total,
              last_version: item.last_version,
              last_member_version: item.last_member_version,
              is_topchat: item.is_topchat || 0,
              is_disturb: item.is_disturb || 0,
              is_topannocuncement: item.is_topannocuncement,
            });
          });
          await imsdk.emit(IMSDK.Event.GROUP_LIST_UPDATED, {
            groupList: tmp,
            type: 1,
          });
        } else {
          if (groupVersion.length) {
            imsdk.comlink.insertGroupVersionList(groupVersion);
          }
        }
      });
  }

  if (!localVersion.length) {
    //全量获取群
    fetchCreateList();
    fetchJoinList();
  } else {
    if (localVersion.length < groupVersion.length) {
      const resArr = groupVersion.filter(
        e => !localVersion.some(e2 => e2.group_id === e.group_id),
      );
      const resArr2 = groupVersion.filter(e =>
        localVersion.some(
          e2 =>
            e2.group_id === e.group_id &&
            (e2.group_version !== e.group_version ||
              e2.member_version !== e.member_version),
        ),
      );
      await asyncGroupList(resArr, 1); //获取需要增加的群列表
      await asyncGroupList(resArr2, 2); //获取需要更新的群
    } else {
      const resArr3 = localVersion.filter(
        e => !groupVersion.some(e2 => e2.group_id === e.group_id),
      ); //需要删除的群
      const resArr4 = groupVersion.filter(e =>
        localVersion.some(
          e2 =>
            e2.group_id === e.group_id &&
            (e2.group_version !== e.group_version ||
              e2.member_version !== e.member_version),
        ),
      ); //需要更新的群
      await imsdk.comlink.deleteGroups(
        resArr3.map(item => {
          //删除群
          return item.group_id;
        }),
      );
      await asyncGroupList(resArr4, 2); //获取需要更新的群
    }
  }
};
