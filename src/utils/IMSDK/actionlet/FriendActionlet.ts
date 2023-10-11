/* eslint-disable */
import {IMSDK, FirendListItem} from '../types';
import {UserActionlet} from './UserActionlet';
import {BaseActionlet} from './BaseActionlet';

interface AddFriendData {
  req_id: string;
}
enum AddFriendApplicationType {
  Refuse = 2,
  Accept = 1,
}
interface GetFriendListType {
  page: number;
  page_size: number;
  search_key: string;
}
interface SyncFriendListType {
  page: number;
  page_size: number;
  version: string;
}

export interface FirendList {
  list: FirendListItem[];
  count: number;
}

export abstract class FriendActionlet extends BaseActionlet {
  handleFriendApplication(
    data: AddFriendData,
    status: AddFriendApplicationType,
  ) {
    return this.post<void>('/api/friend/add_friend_ack', {
      status,
      req_id: data.req_id,
    });
  }

  /**
   * 获取好友列表
   */
  getFirendList(params: GetFriendListType) {
    return this.post<IMSDK.UserProfile[]>(
      '/api/friend/get_friend_list',
      params,
    );
  }
  /**
   * 同步好友列表
   */
  syncFirendList(params: SyncFriendListType) {
    return this.post<IMSDK.UserProfile[]>('/api/friend/friend_sync', params);
  }
  /**
   * 搜索好友
   */
  searchFriend(user_id: string) {
    return this.post<IMSDK.UserProfile | null>('/api/friend/search_user', {
      user_id,
    });
  }
  /**
   * 搜索好友
   */
  searchUser(keyword: string) {
    return this.post('/api/friend/search', {
      keyword,
    });
  }

  /**
   * 添加好友
   */
  addFriend(data: {user_id: string; req_msg: string; remark}) {
    return this.post<void>('/api/friend/add_friend', {
      user_id: data.user_id,
      req_msg: data.req_msg,
      remark: data.remark,
    });
  }

  /**
   * 删除好友
   */
  deleteFriend(user_id: string) {
    return this.post<void>('/api/friend/delete_friend', {
      user_id,
    });
  }

  /**
   * 添加好友备注
   */
  addFriendRemark(data: {user_id: string; remark: string}) {
    return this.post<void>('/api/friend/set_friend_remark', {
      operation_id: Date.now() + '',
      user_id: data.user_id,
      remark: data.remark,
    });
  }

  /**
   * 获取好友申请列表
   */
  getFriendApplicationList(params: {page?: number; page_size?: number}) {
    return this.post<FirendList>('/api/friend/get_friend_apply_list', params);
  }

  /**
   * 获取好友申请与自己加好友申请列表
   */
  getUserFriendaApplyList(params: {page?: number; page_size?: number}) {
    return this.post<FirendList>('/api/friend/get_friend_apply_all', params);
  }

  /**
   * 获取发送好友申请列表
   */
  getAddFriendApplicationList() {
    return this.post<FirendList>('/api/friend/get_self_friend_apply_list');
  }

  /**
   * 同意好友申请
   */
  acceptFriendApplication({req_id}: AddFriendData) {
    return this.handleFriendApplication(
      {
        req_id,
      },
      AddFriendApplicationType.Accept,
    );
  }

  /**
   * 拒绝好友申请
   */
  refuseFriendApplication({req_id}: AddFriendData) {
    return this.handleFriendApplication(
      {
        req_id,
      },
      AddFriendApplicationType.Refuse,
    );
  }

  /**
   * 获取指定好友的还有数据和资料数据
   */
  getFriendProfile(user_id: string) {
    return this.post<IMSDK.UserProfile | null>('/api/friend/get_friend', {
      user_id: user_id,
    });
  }

  /**
   * 获取我的黑名单列表
   */
  getBlackList(params: {page: number; page_size: number}) {
    return this.post<IMSDK.UserProfile[]>('/api/friend/get_black_list', params);
  }

  /**
   * 添加用户到黑名单
   */
  addToBlackList(user_id: string) {
    return this.post<void>('/api/friend/add_black', {
      user_id,
    });
  }

  /**
   * 将用户从黑名单中移除
   */
  removeFromBlackList(user_id: string) {
    return this.post<void>('/api/friend/remove_black', {
      user_id,
    });
  }
}
