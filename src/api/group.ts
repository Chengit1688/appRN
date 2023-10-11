import {SetStateAction} from 'react';
import {post} from '../utils/request';

interface RequestParams {}
interface RequestResponse {
  [x: string]: SetStateAction<{type: string}[]>;
}

/**
 * 首页-面对面加群-发起群
 * @param
 */
export function face2faceInvite(params: RequestParams) {
  console.log('params', params);

  return post<RequestResponse>('/api/group/face2face_invite', params);
}

/**
 * 首页-面对面加群-立即加入
 * @param
 */
export function face2faceAdd(params: RequestParams) {
  return post<RequestResponse>('/api/group/face2face_add', params);
}

export function updateGroupAvatar(params: RequestParams) {
  return post<RequestResponse>('/api/group/group_update_avatar', params);
}
export function updateGroupMemberNickName(params: RequestParams) {
  return post<RequestResponse>('/api/group/update_group_member', params);
}
