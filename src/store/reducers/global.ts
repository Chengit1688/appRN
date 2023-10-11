import {DiscoverListItem} from '@/utils/IMSDK';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {GlobalState} from '../types/global';

const initialState: GlobalState = {
  connectDelay: 0,
  disCoverList: [],
  systemConfig: {},
  userObj: {},
  sendLimit: false,
  shieldList: [],
  remindCiircle: [],
  domains: {},
  servers: {},
  audioAndVideoObjStatus: {},
};

export const globalState = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setConnectDelay: (state, action: PayloadAction<number>) => {
      state.connectDelay = action.payload;
    },
    setDiscoverList: (state, action: PayloadAction<DiscoverListItem[]>) => {
      state.disCoverList = action.payload;
    },
    setSystemConfig: (state, action: PayloadAction<any>) => {
      state.systemConfig = action.payload;
    },
    setVideoAndAudio: (state, action: PayloadAction<any>) => {
      state.userObj = action.payload;
    },
    setSendLimit: (state, action: PayloadAction<any>) => {
      state.sendLimit = action.payload;
    },
    setShieldList: (state, action: PayloadAction<any>) => {
      state.shieldList = action.payload;
    },

    setDomains: (state, action: PayloadAction<any>) => {
      state.domains = action.payload;
    },

    setServerData: (state, action: PayloadAction<any>) => {
      state.servers = action.payload;
    },

    //设置提醒朋友圈消息
    setRemindCiircle: (state, action: PayloadAction<any>) => {
      const index = state.remindCiircle.findIndex(
        (item: any) =>
          Number(item.publisher_user_id) ===
            Number(action.payload.publisher_user_id) &&
          Number(item.moments_id) === Number(action.payload.moments_id),
      );
      // 点赞消息 1 取消点赞 2 点赞
      if (action.payload.like_status && action.payload.like_status === 1) {
        if (index > -1) {
          state.remindCiircle.splice(index, 1);
          return;
        }
        return;
      }

      if (index < 0) {
        state.remindCiircle.push(action.payload);
      }
    },

    // 设置已读朋友圈消息
    setRemindCiircleRed: (state, action: PayloadAction<any>) => {
      const newData = state.remindCiircle.filter((item: any) => {
        return (
          Number(item.publisher_user_id) !==
            Number(action.payload.publisher_user_id) &&
          Number(item.moments_id) !== Number(action.payload.moments_id)
        );
      });
      state.remindCiircle = newData;
    },

    setAudioVideoObjStatus: (state, action: PayloadAction<any>) => {
      state.audioAndVideoObjStatus = action.payload;
    },
  },
});

export const {
  setConnectDelay,
  setDiscoverList,
  setSystemConfig,
  setVideoAndAudio,
  setSendLimit,
  setShieldList,
  setAudioVideoObjStatus,
  setRemindCiircle,
  setRemindCiircleRed,
  setDomains,
  setServerData,
} = globalState.actions;

export default globalState.reducer;
