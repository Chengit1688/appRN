import {Dispatch} from 'redux';
import imsdk from '../../utils/IMSDK';

export * from './contacts';
export * from './user';
export * from './circle';
import {
  setDiscoverList,
  setSystemConfig,
  setShieldList,
} from '../reducers/global';
import {setVideoAndAudio} from '../reducers/global';
export const getDiscoverList = () => {
  return (dispatch: Dispatch) => {
    imsdk.discover().then(res => {
      dispatch(setDiscoverList(res));
    });
  };
};

export const getSettingConfig = () => {
  console.log(131);

  return (dispatch: Dispatch) => {
    console.log(123);

    imsdk.getSettingConfig().then((res: any) => {
      console.log('re111', res);

      dispatch(setSystemConfig(res.system_config));
    });
  };
};

export const getShieldList = params => {
  return (dispatch: Dispatch) => {
    imsdk.getShieldList(params).then((res: any) => {
      dispatch(setShieldList(res.list || []));
    });
  };
};
