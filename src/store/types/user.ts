import {IMSDK, UserConfig} from '../../utils/IMSDK';

export type FullUserItem = {
  nick_name?: string;
  gender?: number;
  user_id?: string;
  face_url?: string;
  signature?: string;
  phone_number?: string;
  self_invite_code?: string | number;
};

export type UserState = {
  selfInfo: FullUserItem;
  token?: string;
  config: UserConfig;
  userWallet?: any;
};

export type PartialUserItem = Partial<FullUserItem>;

export const SET_SELF_INFO = 'SET_SELF_INFO';
export const SET_USER_WALLET = 'SET_USER_WALLET';
export const SET_USER_TOKEN = 'SET_USER_TOKEN';
export const SET_USER_CONFIG = 'SET_USER_CONFIG';
export const SET_FULL_STATE = 'SET_FULL_STATE';
export const SET_SELF_INIT_LOADING = 'SET_SELF_INIT_LOADING';
export const RESET_USER = 'RESET_USER';

type SetSelfInfo = {
  type: typeof SET_SELF_INFO;
  payload: FullUserItem;
};

type SetUserConfig = {
  type: typeof SET_USER_CONFIG;
  payload: UserConfig;
};

type SetSelfToken = {
  type: typeof SET_USER_TOKEN;
  payload: string;
};

type SetFullState = {
  type: typeof SET_FULL_STATE;
  payload: string;
};

type SetSelfInitLoading = {
  type: typeof SET_SELF_INIT_LOADING;
  payload: boolean;
};

type PurgeUser = {
  type: typeof RESET_USER;
};

type SetUserWallet = {
  type: typeof SET_USER_WALLET;
  payload: any;
};

export type UserActionTypes =
  | SetSelfInfo
  | SetSelfToken
  | SetFullState
  | SetUserConfig
  | SetSelfInitLoading
  | PurgeUser
  | SetUserWallet;
