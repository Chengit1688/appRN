import AsyncStorage from '@react-native-async-storage/async-storage';
import imsdk from '@/utils/IMSDK';

import {IMSDK} from '../../types';
import store from '../../../../store';
import user from './user';

let localStorage = AsyncStorage;
export const initFriendData = async (serVersion: string) => {
  const user_id = store.getState().user.selfInfo.user_id;

  const version = await localStorage.getItem('friendversion' + user_id);
  let currentPage = 1;
  let currentSyncPage = 1;
  function getList(page: number, page_size: number) {
    let pages = 1;
    imsdk
      .getFirendList({page, page_size, search_key: ''})
      .then(async (res: any) => {
        pages = parseInt(res?.count / page_size) + 1;
        if (res.list?.length) {
          // let tmp = [];
          // let userTmp = [];
          // res.list.forEach(item => {
          //   const user_id_1 =
          //     Number(item.user_id) > Number(user_id) ? user_id : item.user_id;
          //   const user_id_2 =
          //     Number(item.user_id) > Number(user_id) ? item.user_id : user_id;
          //   imsdk.subscribeSingleChat({
          //     user_id_1,
          //     user_id_2,
          //   });
          //   userTmp.push({
          //     user_id: item.user_id,
          //     face_url: item.face_url,
          //     nick_name: item.nick_name,
          //     age: item.age,
          //     account: item.account,
          //     phone_number: item.phone_number,
          //     login_ip: item.login_ip,
          //     gender: item.gender,
          //     signatures: item.signatures,
          //     // remark:item.remark,
          //   });
          //   return tmp.push({
          //     user_id: item.user_id,
          //     conversation_id: item.user_id,
          //     remark: item.remark,
          //     create_time: item.create_time,
          //     friend_status: item.status || 1,
          //     online_status: item.online_status || 2,
          //     black_status: item.black_status || 2,
          //   });
          // });

          const {tmp, userTmp} = formatData(res?.list, user_id);

          imsdk.emit(IMSDK.Event.FRIEND_LIST_UPDATED, {
            friendList: tmp,
            type: 1,
          });
          await imsdk.comlink.insertUserList(userTmp);
          if (page < Math.ceil(res?.count / page_size)) {
            currentPage++;
            getList(currentPage, 200);
          } else {
            localStorage.setItem(
              'friendversion' + store.getState().user.selfInfo.user_id,
              serVersion,
            );
          }
        }
      });
  }
  function syncList(page: number, page_size: number) {
    let pages = 1;
    imsdk
      .syncFirendList({page, page_size, version: +version})
      .then(async res => {
        pages = parseInt(res?.count / page_size) + 1;
        if (res.list?.length) {
          //   let tmp = [];
          //   let userTmp = [];
          //   res.list.forEach(item => {
          //     const user_id_1 =
          //       Number(item.user_id) > Number(user_id) ? user_id : item.user_id;
          //     const user_id_2 =
          //       Number(item.user_id) > Number(user_id) ? item.user_id : user_id;
          //     imsdk.subscribeSingleChat({
          //       user_id_1,
          //       user_id_2,
          //     });
          //     userTmp.push({
          //       user_id: item.user_id,
          //       face_url: item.face_url,
          //       nick_name: item.nick_name,
          //       age: item.age,
          //       account: item.account,
          //       phone_number: item.phone_number,
          //       login_ip: item.login_ip,
          //       gender: item.gender,
          //       signatures: item.signatures,
          //     });
          //     tmp.push({
          //       user_id: item.user_id,
          //       conversation_id: item.user_id,
          //       remark: item.remark,
          //       create_time: item.create_time,
          //       friend_status: item.status || 1,
          //       online_status: item.online_status || 2,
          //       black_status: item.black_status || 2,
          //     });
          //     return;
          //   });

          const {tmp, userTmp} = formatData(res?.list, user_id);
          imsdk.emit(IMSDK.Event.FRIEND_LIST_UPDATED, {
            friendList: tmp,
            type: 1,
          });
          await imsdk.comlink.insertUserList(userTmp);

          if (page < Math.ceil(res?.count / page_size)) {
            currentSyncPage++;
            syncList(currentSyncPage, 200);
          } else {
            localStorage.setItem(
              'friendversion' + store.getState().user.selfInfo.user_id,
              serVersion,
            );
          }
        } else {
          if (page >= pages) {
            localStorage.setItem(
              'friendversion' + store.getState().user.selfInfo.user_id,
              serVersion,
            );
          }
        }
      });
  }

  const fetchFriendList = async () => {
    let friendList = [];
    let total = Number.MAX_VALUE;
    let page = 1;
    while (total > friendList.length) {
      const result: any =
        (await imsdk.getFirendList({page, page_size: 100, search_key: ''})) ||
        {};
      if (!result.list) break;
      let tmp = [];
      let userTmp = [];
      result.list.forEach(item => {
        const user_id_1 =
          Number(item.user_id) > Number(user_id) ? user_id : item.user_id;
        const user_id_2 =
          Number(item.user_id) > Number(user_id) ? item.user_id : user_id;
        imsdk.subscribeSingleChat({
          user_id_1,
          user_id_2,
        });
        userTmp.push({
          user_id: item.user_id,
          face_url: item.face_url,
          nick_name: item.nick_name,
          age: item.age,
          account: item.account,
          phone_number: item.phone_number,
          login_ip: item.login_ip,
          gender: item.gender,
          signatures: item.signatures,
          // remark:item.remark,
        });
        return tmp.push({
          user_id: item.user_id,
          conversation_id: item.user_id,
          remark: item.remark,
          create_time: item.create_time,
          friend_status: item.status || 1,
          online_status: item.online_status || 2,
          black_status: item.black_status || 2,
        });
      });
      imsdk.emit(IMSDK.Event.FRIEND_LIST_UPDATED, {friendList: tmp, type: 1});
      await imsdk.comlink.insertUserList(userTmp);
      page++;
      total = result?.count ? result.count : 0;
      friendList = friendList.concat(result.list || []);
    }
    const friend_ids = friendList.map(item => item.user_id);
    const removeFriendList = [];

    const friList = await imsdk.comlink.getFriendList();
    friList.data?.forEach(item => {
      if (!friend_ids.includes(item.user?.user_id)) {
        removeFriendList.push(item.user?.user_id);
      }
    });
    if (removeFriendList.length) {
      imsdk.emit(IMSDK.Event.FRIEND_LIST_UPDATED, {
        friendList: removeFriendList,
        type: 2,
      });
    }
    return Promise.resolve(friendList);
  };
  //fetchFriendList();
  //   console.log('serVersion======>', serVersion);
  if (!version) {
    //版本不存在则全量初始化好友
    getList(1, 200);
  } else if (version != serVersion) {
    //如果版本和服务器不一样则获取增量
    syncList(1, 200);
  } else {
    //如果版本一样则获取本地数据库数据
    try {
      const {data} = await imsdk.comlink.getFriendList();

      data.map((item: any) => {
        item.user_id = item.user.user_id;
        return item;
      });
      const newArr = data.filter((item: any) => item.friend_status == 1);
      imsdk.emit(IMSDK.Event.FRIEND_LIST_UPDATED, {
        friendList: newArr,
        type: 1, // 2 删除？
      });
    } catch (err) {
      throw new Error('获取好友用户列表失败');
    }

    // console.log(await imsdk.comlink.getUser(200, 1));
    // console.log(data, userData, '本地数据库数据');

    // data.forEach(friend => {
    //   const friend_id = friend.user.user_id;
    //   const user_id_1 =
    //     Number(friend_id) > Number(user_id) ? user_id : friend_id;
    //   const user_id_2 =
    //     Number(friend_id) > Number(user_id) ? friend_id : user_id;
    //   imsdk.subscribeSingleChat({
    //     user_id_1,
    //     user_id_2,
    //   });
    // });

    // const {tmp, userTmp} = formatData(data, user_id);
    // console.log(tmp, '===>tmp');

    //await imsdk.comlink.insertUserList(userTmp);
  }
};
/**
 * 格式化数据
 * @param list
 */

const formatData = (list: any, user_id: string | undefined) => {
  let tmp: any = [];
  let userTmp: any = [];
  list.forEach((item: any) => {
    const user_id_1 =
      Number(item.user_id) > Number(user_id) ? user_id : item.user_id;
    const user_id_2 =
      Number(item.user_id) > Number(user_id) ? item.user_id : user_id;
    imsdk.subscribeSingleChat({
      user_id_1,
      user_id_2,
    });
    userTmp.push({
      user_id: item.user_id,
      face_url: item.face_url,
      nick_name: item.nick_name,
      age: item.age,
      account: item.account,
      phone_number: item.phone_number,
      login_ip: item.login_ip,
      gender: item.gender,
      signatures: item.signatures,
      // remark:item.remark,
    });
    tmp.push({
      user_id: item.user_id,
      conversation_id: item.user_id,
      remark: item.remark,
      create_time: item.create_time,
      friend_status: item.status || 1,
      online_status: item.online_status || 2,
      black_status: item.black_status || 2,
    });
  });

  return {tmp, userTmp};
};
