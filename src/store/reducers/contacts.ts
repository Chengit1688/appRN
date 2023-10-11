import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ContactActionTypes,
  ContactState,
  SET_CURRENT_MEMBER_LIST,
  SET_CURRENT_MEMBER_ITEM,
  SET_FRIEND_LIST,
  SET_GROUP_LIST,
  SET_NOTICE_COUNT,
} from '../types/contacts';

let initialState: ContactState = {
  friendList: [],
  groupList: [],
  currentMemberList: [],
  noticeCount: {
    friendNotice: 0,
    groupNotice: 0,
  },
};

const friendReducer = (
  state = initialState,
  action: ContactActionTypes,
): ContactState => {
  switch (action.type) {
    case SET_FRIEND_LIST:
      return {...state, friendList: action.payload};
    case SET_GROUP_LIST:
      return {...state, groupList: action.payload};
    case SET_CURRENT_MEMBER_LIST:
      return {...state, currentMemberList: action.payload};
    case SET_CURRENT_MEMBER_ITEM:
      let currentMemberList = JSON.parse(
        JSON.stringify(state.currentMemberList),
      );
      const memberItem: any = action.payload.data;

      const index = currentMemberList.findIndex((member: any) => {
        // member.member_id === memberItem.member_id

        if (memberItem?.member_id) {
          return member.member_id === memberItem.member_id;
        } else {
          return member.user.user_id === memberItem.user_id;
        }
      });

      Object.assign(currentMemberList[index], memberItem);
      return {...state, currentMemberList: [...currentMemberList]};
    case SET_NOTICE_COUNT:
      return {...state, noticeCount: action.payload};
    default:
      return state;
  }
};

const persistConfig = {
  key: 'contacts',
  storage: AsyncStorage,
};

export default persistReducer(persistConfig, friendReducer);
