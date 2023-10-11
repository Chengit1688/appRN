import {SetStateAction} from 'react';
import {post} from '../utils/request';

interface RequestParams {}
interface RequestResponse {
  [x: string]: SetStateAction<{type: string}[]>;
}

/**
 * 获取黑名单
 * @param
 */
export function getBlackList(params: RequestParams) {
  return post<RequestResponse>('/api/friend/get_black_listv2', params);
}

/**
 * 新增黑名单
 * @param
 */
export function addBlack(params: RequestParams) {
  return post<RequestResponse>('/api/friend/add_black', params);
}

/**
 * 移除黑名单
 * @param
 */
export function removeBlack(params: RequestParams) {
  return post<RequestResponse>('/api/friend/remove_black', params);
}
