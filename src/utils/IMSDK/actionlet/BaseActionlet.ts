import Config from 'react-native-config';
import axios, {AxiosRequestConfig} from 'axios';
import {SdkBase} from '../core/SdkBase';
import imsdk from '@/utils/IMSDK';
import {IMSDK} from '../types';
/* @ts-ignore */
import {initComlink} from '../db';
import {Toast} from '@ant-design/react-native';
import * as toast from '@/utils/toast';
import store from '@/store';
import {StorageFactory} from '@/utils/storage';
import {updateConversationList} from '@/store/reducers/conversation';
import {setUserToken} from '@/store/actions/user';
import {setFriendList, setGroupList} from '@/store/actions/contacts';
interface ResponsePayload<T> {
  code: number;
  message: string;
  data: T;
}

const CONV_TYPE = {
  [IMSDK.ConversationType.C2C]: 'C2C',
  [IMSDK.ConversationType.GROUP]: 'GROUP',
  [IMSDK.ConversationType.CHANNEL]: 'CHANNEL',
};

const CONV_TYPE_VAL = {
  [CONV_TYPE[IMSDK.ConversationType.C2C]]: 1,
  [CONV_TYPE[IMSDK.ConversationType.GROUP]]: 2,
  [CONV_TYPE[IMSDK.ConversationType.CHANNEL]]: 3,
};

export abstract class BaseActionlet extends SdkBase {
  private readonly client = axios.create({
    baseURL: Config.VITE_APP_AXIOSURL,
    timeout: 10e3,
  });

  comlink = initComlink();
  store = store;

  private handleResponse(
    response: ResponsePayload<any>,
    config: AxiosRequestConfig,
  ) {
    const {code, data, message} = response;
    switch (code) {
      case 0:
        return data;
      case 10212:
        toast.warn(message);
        return;

      case 1:
      default:
        if (message === '群组不存在' || message === '请求参数错误') {
          return;
        }
        if (message === '') {
          return;
        } else {
          toast.info(message);
        }
        if (message === '请重新登录') {
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
        throw new Error(message || 'request error');
    }
  }

  protected request<T>(config: AxiosRequestConfig): Promise<T> {
    /* eslint-disable */
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.token) {
          throw new Error('please login first.');
        }

        if (config.headers) {
          /* @ts-ignore */
          config.headers['token'] = this.token;
          config.headers['im_site'] = Config.VITE_APP_SITEID;
        } else {
          config.headers = {
            token: this.token,
            im_site: Config.VITE_APP_SITEID,
          };
        }

        const res = await this.client.request<ResponsePayload<T>>(config);

        resolve(this.handleResponse(res.data, config));
      } catch (e) {
        console.log('http request err-----', e.message, config);
        toast.error(`${e.message}`);
        reject(e);
        throw new Error(e.message);
      }
    });
  }

  protected get<T>(url: string, params?: any) {
    console.log('params===>', JSON.stringify(params));
    return this.request<T>({
      url,
      params: {
        ...(params || {}),
        operation_id: Date.now().toString(),
      },
      method: 'GET',
    });
  }

  protected post<T>(url: string, data?: any) {
    console.log('data===>', JSON.stringify(data));
    return this.request<T>({
      url,
      data: {
        ...(data || {}),
        operation_id: Date.now().toString(),
      },
      method: 'POST',
    });
  }

  protected createConversationId(
    type: IMSDK.ConversationType,
    id: string,
  ): string {
    return CONV_TYPE[type] + '_' + id;
  }

  protected parseConversationId(conv_id: string): {
    type: IMSDK.ConversationType;
    id: string;
  } {
    const [type, id] = conv_id.split('_');

    return {
      type: CONV_TYPE_VAL[type],
      id,
    };
  }

  /**
   * 获取系统配置
   */
  getSettingConfig() {
    return this.get<{
      content: string;
    }>('/api/setting/config');
  }

  /**
   * 获取系统铭感词
   */
  getShieldList(params) {
    return this.post<{
      content: string;
    }>('/api/setting/shield_list', params);
  }
}
