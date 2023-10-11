import { SetStateAction } from 'react';
import { get, post } from '../utils/request';
import Config from 'react-native-config'
interface RequestParams {}
interface RequestResponse {
  [x: string]: SetStateAction<{ type: string; }[]>;
}

/**
 * 获取朋友圈
 * @param
 */
export function getMomentsMessage(params: RequestParams) {
    return post<RequestResponse>('/api/moments/get_moments_message', params);
}


/**
 * 点赞
 * @param
 */
export function likeMoments(params: RequestParams) {
  return post<RequestResponse>('/api/moments/like_moments', params);
}


/**
 * 评论
 * @param
 */
export function addComments(params: RequestParams) {
  return post<RequestResponse>('/api/moments/moments_comments_add', params);
}

/**
 * 发布朋友圈
 * @param
 */
export function publishMoments(params: RequestParams) {
  return post<RequestResponse>('/api/moments/add_moments_message', params);
}





/**
 * 朋友圈详情
 * @param
 */
export function getMomentsDetail(params: RequestParams) {
  return post<RequestResponse>('/api/moments/moments_detail', params);
}

/**
 * 删除
 * @param
 */
export function delMomentsMessage(params: RequestParams) {
  return post<RequestResponse>('/api/moments/del_moments_message', params);
}

