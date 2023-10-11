import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserState, FullUserItem, UserActionTypes, SET_SELF_INFO, SET_USER_TOKEN,SET_USER_CONFIG, SET_USER_WALLET } from '../types/user';

let initialState: UserState = {
  selfInfo: {} as FullUserItem,
  token: '',
  config:{},
  userWallet: {}
};

const userReducer = (state = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case SET_SELF_INFO:
      
      return { ...state, selfInfo: { ...state.selfInfo, ...action.payload }};
    case SET_USER_CONFIG:
        return { ...state, config: { ...state.config, ...action.payload } };
    case SET_USER_TOKEN:
      return { ...state, token: action.payload };
    case SET_USER_WALLET:
      return { ...state, userWallet: Object.assign({}, state.userWallet, action.payload) };
    default:
      return state;
  }
};

const persistConfig = {
  key: 'user',
  storage:AsyncStorage,
  blacklist:['config']
};

export default persistReducer(persistConfig, userReducer);
