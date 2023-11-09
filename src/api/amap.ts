/**
 * 高德地图Api
 */

import { get, post } from '@/utils/request';
import { SetStateAction } from 'react';
import Config from 'react-native-config'
interface RequestParams {}
interface RequestResponse {
  [x: string]: SetStateAction<{ type: string; }[]>;
}


/**
 * 逆地理编码
 * @param
 */
export function getGeocodeRegeo(params?: RequestParams) {
    // console.log('params======>>>>',params)
    // console.log('VITE_AMAP_BASE_URL======>>>>',Config.VITE_AMAP_BASE_URL)
    return get<RequestResponse>(`/v3/geocode/regeo`, {
        key:Config.VITE_AMAP_KEY,
        ...params
    },{},{
        baseURL: Config.VITE_AMAP_BASE_URL,
        platform: 'amap'
    });

}

/**
 * 获取地位
 * @param
 */
export function getLocation(params?: RequestParams) {
    return post<RequestResponse>(`/v3/ip?output=json&key=${Config.VITE_AMAP_KEY}`, params, {
      baseURL: Config.VITE_AMAP_BASE_URL
    });
}


/**
 * 坐标转换
 * @param
 */
export function coordinateConvert(params?: RequestParams) {
    return get<RequestResponse>(`/v3/assistant/coordinate/convert`, {
        key:Config.VITE_AMAP_KEY,
        ...params
    },{},{
        baseURL: Config.VITE_AMAP_BASE_URL,
        platform: 'amap'
    });
}


  
/**
 * 获取周边地址
 * @param
 */
export function getAroundAddress(params?: RequestParams) {
    return get<RequestResponse>(`v5/place/around`, {
        key:Config.VITE_AMAP_KEY,
        ...params
    },{},{
        baseURL: Config.VITE_AMAP_BASE_URL,
        platform: 'amap'
    });
}

/**
 * 获取地图及标注
 * @param
 */

export function getStaticmap(params?: RequestParams) {
    return get<RequestResponse>(`/v3/staticmap`, {
        key:Config.VITE_AMAP_KEY,
        ...params
    },{},{
        baseURL: Config.VITE_AMAP_BASE_URL,
        platform: 'amap'
    });
}
