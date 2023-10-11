import imsdk from '@/utils/IMSDK';
import uuid from 'react-native-uuid';
export const initGroupMemberData = async (
  group_id: string,
  version?: {local_version?: number; server_version?: number},
) => {
  console.log('initGroupMemberData-----', group_id, 'group_id', version);
  let currentPage = 1;
  let currentSyncPage = 1;
  function getList(page: number, page_size: number) {
    let pages = 1;
    imsdk.getGroupMemberList({group_id, page, page_size}).then(async res => {
      pages = parseInt(res?.count / page_size) + 1;
      console.log(res.list, '群成员');
      if (res.list?.length) {
        let tmp = [];
        let userTmp = [];
        res.list.forEach(item => {
          userTmp.push({
            user_id: item.user_id,
            face_url: item.face_url,
            nick_name: item.nick_name,
            age: item.age || 0,
            account: item.account || '',
            phone_number: item.phone_number || '',
            login_ip: item.login_ip || '',
            gender: item.gender || 1,
            signatures: item.signatures || '',
          });
          const uid = uuid.v4();
          return tmp.push({
            member_id: `${group_id}_${item.user_id}`,
            group_id: group_id,
            user_id: item.user_id,
            id: uid,
            group_nick_name: item.group_nick_name,
            role: item.role,
            mute_end_time: item.mute_end_time,
            version: item.version,
            status: item.status,
          });
        });
        await imsdk.comlink.insertGroupMemberList(tmp);
        await imsdk.comlink.insertUserList(userTmp);
        if (page < pages + 1) {
          currentPage++;
          getList(currentPage, 200);
        }
      }
    });
  }
  function syncList(page: number, page_size: number) {
    let pages = 1;
    // imsdk
    //   .asyncGroupMemberList({group_id, page, page_size, local_version: 28})
    imsdk
      .asyncGroupMemberList({
        group_id,
        page,
        page_size,
        local_version: version?.local_version || 0,
      })
      .then(async res => {
        pages = parseInt(res?.count / page_size) + 1;
        console.log(res.list, '群同步成员');
        if (res.list?.length) {
          let tmp = [];
          let userTmp = [];
          res.list.forEach(item => {
            userTmp.push({
              user_id: item.user_id,
              face_url: item.face_url,
              nick_name: item.nick_name,
              age: item.age || 0,
              account: item.account || '',
              phone_number: item.phone_number || '',
              login_ip: item.login_ip || '',
              gender: item.gender || 1,
              signatures: item.signatures || '',
            });
            const uid = uuid.v4();
            return tmp.push({
              member_id: `${group_id}_${item.user_id}`,
              group_id: group_id,
              user_id: item.user_id,
              id: uid,
              group_nick_name: item.group_nick_name,
              role: item.role,
              mute_end_time: item.mute_end_time,
              version: item.version,
              status: item.status,
            });
          });
          await imsdk.comlink.insertGroupMemberList(tmp);
          await imsdk.comlink.insertUserList(userTmp);
          if (page < pages + 1) {
            currentSyncPage++;
            syncList(currentSyncPage, 200);
          }
        }
      });
  }
  if (version) {
    //获取增量
    syncList(1, 200);
  } else {
    getList(1, 200);
  }
};
