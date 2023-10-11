import { SET_LOCATION_INFO,SET_IMAGE_TEXT,LocationInfo,CircleActionTypes,SET_IMAGE_LIST, SET_WHO_SEE } from '../types/circle';


export const setLocationInfo = (value: LocationInfo): CircleActionTypes => {
    return {
      type: SET_LOCATION_INFO,
      payload: value as LocationInfo
    };
  };
  

export const setImageText = (value: any): any => {
    return {
      type: SET_IMAGE_TEXT,
      payload: value
    };
  };
 
  export const setPushImgList = (value: any): any => {
    return {
      type: SET_IMAGE_LIST,
      payload: value
    };
  };

  export const setWhoSee = (value: any): any => {
    return {
      type: SET_WHO_SEE,
      payload: value
    };
  };