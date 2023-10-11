export const SET_LOCATION_INFO = 'SET_LOCATION_INFO';
export const SET_IMAGE_TEXT = 'SET_IMAGE_TEXT';
export const SET_IMAGE_LIST = 'SET_IMAGE_LIST';
export const SET_WHO_SEE = 'SET_WHO_SEE';



export type LocationInfo = {
    name: string | undefined,
    address: string | undefined,
}

export type imgTextItem = {
   imgUrl: string,
   total:number,
   index: number,
   [key:string]: any
}
export type imgPushItm = {
  [key:string]: any
}

export type whoSee = {
   status: number,
   tags?: any,
   friends?: any
}

export type imgList =  imgPushItm[]


export type imgDetailInfo = {
   page_num: number,
   list: imgTextItem[]
}


export type CircleState = {
    locationInfo: LocationInfo;
    imgInfo: imgDetailInfo,
    imgPushList: imgList,
    whoSee: whoSee
  };

type SetLocationInfo = {
    type: typeof SET_LOCATION_INFO;
    payload: LocationInfo
  };


type SetImageText = {
    type: typeof SET_IMAGE_TEXT;
    payload: imgDetailInfo
  };

  type SetImageList = {
    type: typeof SET_IMAGE_LIST;
    payload: imgList
  };

  type SetWhoSee = {
    type : typeof SET_WHO_SEE;
    payload: whoSee
  }


export type CircleActionTypes = SetLocationInfo | SetImageText | SetImageList | SetWhoSee;
