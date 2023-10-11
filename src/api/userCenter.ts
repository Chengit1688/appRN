import {post} from '../utils/request';

interface RequestParams {}
interface RequestResponse {}

/**
 * 获取实名认证信息
 * @param
 */
export function getRealNameInfo(params: RequestParams) {
  return post<RequestResponse>('/api/user/real_name_info', params);
}

/**
 * 实名认证
 * @param
 */
export function addRealName(params: RequestParams) {
  return post<RequestResponse>('/api/user/real_name', params);
}
