import {SetStateAction} from 'react';
import {post} from '../utils/request';

interface RequestParams {}
interface RequestResponse {
  [x: string]: SetStateAction<{type: string}[]>;
}

/**
 * 获取标签
 * @param
 */
export function getTagList(params: RequestParams) {
  return post<RequestResponse>('/api/contacts/tag_list', params);
}

/**
 * 新增标签
 * @param
 */
export function addTag(params: RequestParams) {
  return post<RequestResponse>('/api/contacts/tag_add', params);
}

/**
 * 编辑标签
 * @param
 */
export function updateTag(params: RequestParams) {
  return post<RequestResponse>('/api/contacts/tag_update', params);
}

/**
 * 标签详情
 * @param
 */
export function getTagDetail(params: RequestParams) {
  return post<RequestResponse>('/api/contacts/tag_detail', params);
}

/**
 * 好友是否在标签
 * @param
 */
export function tagFetchFriend(params: RequestParams) {
  return post<RequestResponse>('/api/contacts/tag_fetch_friend', params);
}

/**
 * 好友加入标签
 * @param
 */
export function tagAddFriend(params: RequestParams) {
  return post<RequestResponse>('/api/contacts/tag_add_friend', params);
}

/**
 * 删除标签
 * @param
 */
export function delTag(params: RequestParams) {
  return post<RequestResponse>('/api/contacts/tag_delete', params);
}
