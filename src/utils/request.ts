import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import Config from 'react-native-config';
// import { Toast } from '@ant-design/react-native';
import * as toast from './toast';
import store from '../store';
import imsdk from '@/utils/IMSDK';

import {StorageFactory} from './storage';
import {setUserToken} from '@/store/actions/user';
import {updateConversationList} from '@/store/reducers/conversation';
import {setFriendList, setGroupList} from '@/store/actions';

let errConut = 0;
export const client = axios.create({
  timeout: 300000,
  withCredentials: true,
  baseURL: Config.VITE_APP_AXIOSURL,
});

function handleError(error: AxiosError) {
  const {code} = error;
  // console.log('code====>>>>>>',code)
  if (code === 'ECONNABORTED') {
    // TODO
  }
  return Promise.reject(error);
}

client.interceptors.request.use(
  config => {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);



client.interceptors.response.use(response => {
  // console.log('调用token', response.config.headers.token);
  // console.log('调用地址', response.request.responseURL);
  // console.log('请求参数', response.config.data);
  // console.log('返回结果', response.data);
  const {config} = response;
  //调用高德API单独处理
  if (
    config.baseURL &&
    config.baseURL.indexOf(Config.VITE_AMAP_BASE_URL as string) > -1
  ) {
    return response.data;
  }
  const res = response.data;
  const {code} = res;
  // 这里是打印接口数据
  // console.log('进来这里啦吗res====>>>>>>',res)
  if (response.request.responseURL.includes('vite.svg')) {
    return response.data;
  } else {
    if (config?.hasError) {
      // 错误不在这里处理
      return response.data;
    }
    switch (code) {
      case 0:
        return res.data;
      case 500:
        // TODO
        toast.warn(res.message);
        throw new Error(res.message);
      default:
        if (res.message === '群组不存在' || res.message === '请求参数错误') {
          toast.warn(res.message);
          return;
        }
        if (res.message === '请重新登录') {
          //location.href = '/login';
          //调用退出方法
          store.dispatch(updateConversationList([]));
          store.dispatch(setUserToken(''));
          store.dispatch(setGroupList([]));
          store.dispatch(setFriendList([]));
          //重置数据库
          imsdk.comlink.close();
          imsdk.logout();
          return;
        }
        // if(res.message === "通话不存在"){
        //     return;
        // }
        if (response.request.responseURL.includes('rtc_update')) {
          throw new Error(res.message);
        }
        toast.warn(res.message);
        if (response.config.url?.endsWith('user/register')) {
          throw Error(res.code);
        } else {
          throw new Error(res.message);
        }
        // if(res.message === "通话不存在"){
        //     return;
        // }
        if (response.request.responseURL.includes('rtc_update')) {
          throw new Error(res.message);
        }
        toast.warn(res.message);
        if (response.config.url?.endsWith('user/register'))
          throw Error(res.code);
        else throw new Error(res.message);
    }
  }
}, handleError);

export function request<T>(options: any): Promise<T> {
  return client.request(options);
}

export async function get<T>(
  api: string,
  params?: any,
  headers?: any,
  config?: any,
) {
  // console.log('start======>2');
  if (headers) {
    headers.im_site = Config.VITE_APP_SITEID;
  } else {
    headers = {
      im_site: Config.VITE_APP_SITEID,
    };
  }
  const {token} = (await StorageFactory.getSession('USER_LOGIN_INFO')) || {};
  if (token) {
    headers.token = token;
  }
  console.log('getapi======>2',api);
  return request<T>({
    url: api,
    method: 'GET',
    params,
    headers,
    ...config,
  });
}

export async function post<T>(api: string, data: any, config?: any) {
  // TODO: create request url
  // console.log('VITE_APP_AXIOSURL===>>',Config.VITE_APP_AXIOSURL)
  // console.log('apistart======>3',api);
  const headers: any = {
    im_site: Config.VITE_APP_SITEID,
  };
  // const token = store.getState()?.user?.token || '';
  const {token} = (await StorageFactory.getSession('USER_LOGIN_INFO')) || {};

  if (token) {
    headers.token = token;
  }
  if (api.indexOf('third/upload/v2') > -1) {
    headers['Content-Type'] = 'multipart/form-data';
  }
  // console.log('token====>>>',token)
  // console.log('Config======>2', Config.VITE_APP_AXIOSURL);
  // console.log('postapi======>',token);
  // console.log('postheaders======>3',headers);
  // api = Config.VITE_APP_AXIOSURL + api
  return request<T>({
    url: api,
    method: 'POST',
    data,
    headers,
    ...config,
    onUploadProgress: function (progressEvent) {
      //原生获取上传进度的事件
      config?.onUploadProgress?.(progressEvent);
    },
  });
}
