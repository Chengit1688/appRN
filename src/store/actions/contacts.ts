import {Dispatch} from 'redux';
import imsdk, {IMSDK} from '../../utils/IMSDK';
import {
  ContactActionTypes,
  SET_FRIEND_LIST,
  SET_GROUP_LIST,
  SET_CURRENT_MEMBER_LIST,
  SET_NOTICE_COUNT,
  SET_CURRENT_MEMBER_ITEM,
  MemberItem,
  NoticeCount,
} from '../types/contacts';
export const setFriendList = (value: MemberItem[]): ContactActionTypes => {
  return {
    type: SET_FRIEND_LIST,
    payload: value,
  };
};
export const setGroupList = (list: IMSDK.GroupDetail[]): ContactActionTypes => {
  return {
    type: SET_GROUP_LIST,
    payload: list,
  };
};
export const setCurrentMemberList = (list: any): ContactActionTypes => {
  return {
    type: SET_CURRENT_MEMBER_LIST,
    payload: list,
  };
};
export const setCurrentMemberItem = (list: any): ContactActionTypes => {
  return {
    type: SET_CURRENT_MEMBER_ITEM,
    payload: list,
  };
};
export const getFriendList = (page: number, page_size: number) => {
  return (dispatch: Dispatch) => {
    imsdk.getFirendList({page, page_size, search_key: ''}).then(res => {
      if (res.list?.length) {
        let tmp: MemberItem[] = [];
        res.list.forEach((item: MemberItem) => {
          return tmp.push(item);
        });
        dispatch(setFriendList(tmp));
      }
    });
  };
};
export const getGroupList = () => {
  return (dispatch: Dispatch) => {
    imsdk.getMyCreatedGroupList().then(res => {
      dispatch(setGroupList(res.list));
    });
  };
};
export const setNoticeCount = (value: NoticeCount): ContactActionTypes => {
  return {
    type: SET_NOTICE_COUNT,
    payload: value,
  };
};
