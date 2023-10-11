import {
  CircleActionTypes,
  CircleState,
  LocationInfo,
  SET_LOCATION_INFO,
  SET_IMAGE_TEXT,
  imgDetailInfo,
  imgList,
  SET_IMAGE_LIST,
  whoSee,
  SET_WHO_SEE,
} from '../types/circle';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
let initialState: CircleState = {
  locationInfo: {} as LocationInfo,
  imgInfo: {} as imgDetailInfo,
  imgPushList: [] as imgList,
  whoSee: {
    status: 2, //默认公开
  } as whoSee,
};

const circleReducer = (
  state = initialState,
  action: CircleActionTypes,
): CircleState => {
  switch (action.type) {
    case SET_LOCATION_INFO:
      return {
        ...state,
        locationInfo: {...state.locationInfo, ...action.payload},
      };
    case SET_IMAGE_TEXT:
      return {...state, imgInfo: {...state.imgInfo, ...action.payload}};
    case SET_IMAGE_LIST:
      return {...state, imgPushList: action.payload};
    case SET_WHO_SEE:
      return {...state, whoSee: {...state.whoSee, ...action.payload}};
    default:
      return state;
  }
};

const persistConfig = {
  key: 'circle',
  storage: AsyncStorage,
  blacklist: ['config'],
};

export default persistReducer(persistConfig, circleReducer);
