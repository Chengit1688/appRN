import {FriendActionlet} from './FriendActionlet';
import {BaseActionlet} from './BaseActionlet';
import {IMSDK} from '../types';
import {MemberListItem} from '@/store/types/contacts';
import uuid from 'react-native-uuid';
export abstract class GroupActionlet extends BaseActionlet {
  /**
   * 创建群组
   */
  createGroup(name: string, face_url?: string) {
    return this.post<IMSDK.Group>('/api/group/create_group', {name, face_url});
  }

  /**}
   * 解散群组
   */
  dismissGroup(group_id: string) {
    return this.post<IMSDK.GroupDetail>('/api/group/group_update', {
      group_id,
      status: 2,
    });
  }

  /**
   * 申请入群
   */
  joinGroup(data: {group_id: string; remark: string}) {
    return this.post<void>('/api/group/join_group_apply', data);
  }

  /**
   * 退出群组
   */
  quitGroup(group_id: string) {
    return this.post<void>('/api/group/quit_group', {group_id});
  }

  /**
   * 邀请入群
   */
  inviteToGroup(data: {group_id: string; user_id_list: string[]}) {
    if (data.user_id_list.length === 0) return Promise.resolve();
    return this.post<void>('/api/group/invite_group_member', data);
  }

  /**
   * 踢出群聊
   */
  removeGroupMember(data: {group_id: string; user_id_list: string[]}) {
    return this.post('/api/group/remove_group_member', data);
  }

  private joinGroupVerify(apply_id: number, status: IMSDK.JoinGroupApplyState) {
    return this.post<void>('/api/group/join_group_verify', {
      apply_id,
      status,
    });
  }

  /**
   * 同意入群申请
   */
  accepetJoinGroupApplication(apply_id: number) {
    return this.joinGroupVerify(apply_id, 1);
  }

  /**
   * 拒绝入群申请
   */
  refuseJoinGroupApplication(apply_id: number) {
    return this.joinGroupVerify(apply_id, 2);
  }

  /**
   * 获取我创建的群组列表
   */
  getMyCreatedGroupList(page = 1) {
    return this.post<{list: IMSDK.GroupDetail[]; count: number}>(
      '/api/group/my_group_list',
      {
        page: page,
        page_size: 200,
      },
    );
  }

  /**
   * 获取我加入的群组列表
   */
  getMyJoinedGroupList(page: number) {
    return this.post<{list: IMSDK.Group[]; count: number}>(
      '/api/group/joind_group_list',
      {
        page: page,
        page_size: 200,
      },
    );
  }
  /**
   * 批量同步群组列表
   */
  asyncGroupList(group_id_list: Array<any>) {
    return this.post<{list: IMSDK.Group[]; count: number}>(
      '/api/group/group_info_sync',
      {
        group_id_list,
      },
    );
  }
  /**
   * 获取群组详细信息
   */
  getGroupProfile(group_id: string) {
    return this.post<IMSDK.GroupDetail>('/api/group/group_info', {
      group_id,
    });
  }
  /**
   * 搜索群
   */
  searchGroup(keyword: string) {
    return this.post('/api/group/search', {
      keyword,
    });
  }

  /**
   * 获取入群申请列表
   */
  getJoinGroupApplication(data?: {page?: number; page_size?: number}) {
    const {page = 1, page_size = 20} = data || {};
    return this.post<{count: number; list: IMSDK.JoinGroupApplication[]}>(
      '/api/group/group_apply_list',
      {
        page,
        page_size,
      },
    );
  }

  /**
   * 转移群主
   */
  changeGroupOwner(data: {group_id: string; user_id: string}) {
    return this.post<void>('/api/group/set_owner', data);
  }

  /**
   * 设置/取消群管理员
   */
  setGroupMemberRole(data: {
    group_id: string;
    user_id: string;
    role: 'admin' | 'user';
  }) {
    return this.post<void>('/api/group/set_admin', {
      group_id: data.group_id,
      user_id: data.user_id,
      status: data.role === 'admin' ? 1 : 2,
    });
  }
  /**
   * 设置/取消群管理员
   */
  getOwnerAdmin(group_id: string) {
    return this.post<void>('/api/group/get_owner_admin', {
      group_id,
    });
  }

  /**
   * 获取群成员列表
   */
  getGroupMemberList(params: {
    group_id: string;
    page?: number;
    page_size?: number;
    search_key?: string;
  }) {
    return this.post<{total: number; list: IMSDK.GroupMember[]}>(
      '/api/group/group_member_list',
      params,
    );
  }
  /**
   * 同步群成员列表
   */
  asyncGroupMemberList(params: {
    group_id: string;
    page?: number;
    page_size?: number;
    local_version: number;
  }) {
    return this.post<{total: number; list: IMSDK.GroupMember[]}>(
      '/api/group/group_sync',
      params,
    );
  }
  /**
   * 设置群成员的禁言时间获取消禁言
   */
  setGroupMemberMuteTime(data: {
    group_id: string;
    user_id: string;
    mute_sec: number;
  }) {
    return this.post<void>('/api/group/mute_member', data);
  }

  /**
   * 设置群组属性
   */
  setGroupAttributes(data: {
    group_id: string;
    attributes: Partial<IMSDK.GroupAttribute>;
  }) {
    return this.post<IMSDK.GroupDetail>('/api/group/group_update', {
      group_id: data.group_id,
      ...(data.attributes || {}),
    });
  }

  /**
   * 获取群成员，按权限分组排序
   * **/
  getGroupMemberByType() {
    let meberArr: MemberListItem[] = [];
    let adminArr: MemberListItem[] = [];
    const {currentMemberList} = this.store.getState().contacts;

    if (currentMemberList.length) {
      for (let i = 0; i < currentMemberList.length; i++) {
        const {user, ...other} = currentMemberList[i];
        const data = {
          ...other,
          ...user,
        };
        if (
          currentMemberList[i].role == 'user' ||
          currentMemberList[i].role == 'staff'
        ) {
          meberArr.push(data);
        }
        if (
          currentMemberList[i].role == 'owner' ||
          currentMemberList[i].role == 'admin'
        ) {
          adminArr.push(data);
        }
      }
    }
    return {
      meberArr,
      adminArr,
    };
  }

  /**
   * 清空本地群信息
   */
  deleteAllGroupVersion() {
    return this.comlink.deleteAllGroupVersion();
  }
  /**
   * 获取群成员
   */
  async initGroupMember({group_id}) {
    let memberList = [];
    let total = Number.MAX_VALUE;
    let page = 1;
    // while (total > memberList.length) {
    const result = await this.getGroupMemberList({
      group_id,
      page,
      page_size: 20,
    });
    // if (!result.list) break;
    let tmp = [];
    let userTmp = [];
    total = result?.count ? result.count : 0;
    memberList = memberList.concat(result.list || []);
    result.list.forEach((item: any) => {
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
      tmp.push({
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
    await this.comlink.insertGroupMemberList(tmp);
    await this.comlink.insertUserList(userTmp);
    // }

    const {data} = await this.comlink.getGroupMember(10000, 1, group_id);
    const remoteUserIds = memberList.map(member => member.user_id);
    if (data?.length) {
      const removeIdList = [];
      data.forEach(member => {
        if (!remoteUserIds.includes(member.user?.user_id)) {
          removeIdList.push(member.member_id);
        }
      });
      if (removeIdList.length) {
        await this.comlink.deleteGroupMembers(removeIdList);
      }
    }
    return Promise.resolve(memberList);
  }
}
