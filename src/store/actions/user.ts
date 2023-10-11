import { SET_SELF_INFO, UserActionTypes, FullUserItem, PartialUserItem, SET_USER_TOKEN,SET_USER_CONFIG, SET_USER_WALLET } from '../types/user';
import {Dispatch} from 'redux';
import imsdk,{UserConfig} from '../../utils/IMSDK';

export const setSelfInfo = (value: PartialUserItem): UserActionTypes => {
  return {
    type: SET_SELF_INFO,
    payload: value as FullUserItem
  };
};

export const setUserToken = (value: string): UserActionTypes => {
  return {
    type: SET_USER_TOKEN,
    payload: value
  };
};

export const setUserConfig = (config: UserConfig): UserActionTypes => {
  return {
    type: SET_USER_CONFIG,
    payload: config
  };
};

export const setUserWallet = (data): UserActionTypes => {
  return {
    type: SET_USER_WALLET,
    payload: data
  };
};

export const getUserInfo = () => {
  return (dispatch: Dispatch) => {
    imsdk.getMyProfile().then((res) =>{
      dispatch(setSelfInfo(res));
    });
  };
};

export const getUserConfig = () => {
  return (dispatch: Dispatch) => {
    return imsdk.getUserConfig().then((res) =>{
      if(!res.content) return
      const data = JSON.parse(res.content) as UserConfig
      if (data.conversation) data.conversationMap = data.conversation.reduce((acc,cur) => {
        acc[cur.conversation_id] = cur
        return acc
      },{})
      dispatch(setUserConfig(data));
    });
  };
};

export const getUserWallet = () => {
  return (dispatch: Dispatch) => {
    imsdk.getUserWallet().then((res:any) =>{
      dispatch(setUserWallet(res));
    });
  };
};