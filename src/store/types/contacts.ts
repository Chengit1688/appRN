import { IMSDK } from "@/utils/IMSDK";

/*import { MemberMapType } from '../../@types/open_im';*/
export type MemberItem ={
  account:string;
  age: number;
  create_time: number;
  id: string;
  gender: number;
  nick_name: string;
  phone_number: string;
  signatures: string;
  remark:string;
  user_id:string;
  face_url:string,
  isChecked?: boolean;
};
// type GroupItem = {
//   groupID: string;
//   groupName: string;
//   notification: string;
//   notificationUserID: string;
//   notificationUpdateTime: number;
//   introduction: string;
//   faceURL: string;
//   ownerUserID: string;
//   createTime: number;
//   memberCount: number;
//   creatorUserID: string;
//   groupType: number;
//   ex: string;
// };
type GroupItem = IMSDK.Group

export type NoticeCount = {
   friendNotice:number,
   groupNotice:number
};
export type ContactState = {
  friendList:Array<MemberItem>;
  groupList: GroupItem[];
  currentMemberList:(IMSDK.GroupMember & {user:MemberItem})[],
  noticeCount:NoticeCount
};

export type MemberListItem = Omit<ContactState['currentMemberList'][number],'user'> & MemberItem

export const SET_FRIEND_LIST = 'SET_FRIEND_LIST';
export const SET_GROUP_LIST = 'SET_GROUP_LIST';
export const SET_CURRENT_MEMBER_LIST = 'SET_CURRENT_MEMBER_LIST';
export const SET_CURRENT_MEMBER_ITEM = 'SET_CURRENT_MEMBER_ITEM';
export const SET_NOTICE_COUNT = 'SET_NOTICE_COUNT';
type SetFriendList = {
  type: typeof SET_FRIEND_LIST;
  payload: MemberItem[];
};
type SetCurrentMemberList = {
  type: typeof SET_CURRENT_MEMBER_LIST;
  payload: [];
};
type SetCurrentMemberItem = {
  type: typeof SET_CURRENT_MEMBER_ITEM;
  payload: {
    data: MemberItem
  };
};
type SetGroupList = {
  type: typeof SET_GROUP_LIST;
  payload:GroupItem[];
};
type SetNoticeBode = {
  type: typeof SET_NOTICE_COUNT;
  payload:NoticeCount;
};
export type ContactInfoType ={
  account:any;
  age:number;
  face_url:string;
  gender:number;
  nick_name:string;
  signatures:string;
  user_id:string;
  online_status:number;
  remark:string;
};
export type NewFriendType ={
  id:string,
  age:number,
  user_id:string,
  nick_name:string,
  face_url:string,
  req_msg:string,
  signatures:string,
  status:number
};
export type BlackItemType ={
  id:string,
  user_id:string,
  nick_name:string,
  face_url:string,
  signatures:string
};
export type ContactActionTypes =
  | SetFriendList
  | SetGroupList
  | SetCurrentMemberList
  | SetNoticeBode
  | SetCurrentMemberItem