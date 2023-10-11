import {post} from '../utils/request';

interface RequestParams {}
interface RequestResponse {}

/**
 * 申请成为加盟商
 * @param
 */
export function applyFor(params: RequestParams) {
  return post<RequestResponse>('/api/operator/apply_for', params);
}

/**
 * 加入团队
 * @param
 */
export function joinTeam(params: RequestParams) {
  return post<RequestResponse>('/api/operator/join_team', params);
}

/**
 * 加盟商列表/搜索加盟商
 * @param
 */
export function shoppingList(params: RequestParams) {
  return post<RequestResponse>('/api/operator/search', params);
}

/**
 * 加盟商详情
 * @param
 */
export function shoppingDetail(params: RequestParams) {
  return post<RequestResponse>('/api/operator/detail', params);
}

/**
 * 修改资料
 * @param
 */
export function updateShopping(params: RequestParams) {
  return post<RequestResponse>('/api/operator/update', params);
}

/**
 * 团队成员
 * @param
 */
export function teamMembersList(params: RequestParams) {
  return post<RequestResponse>('/api/operator/team_member_list', params);
}

/**
 * 成员加盟商信息
 * @param
 */
export function getTeamMemeberInfo(params: RequestParams) {
  return post<RequestResponse>('/api/operator/team_leader_info', params);
}

/**
 * 成员信息
 * @param
 */
export function getMemeberInfo(params: RequestParams) {
  return post<RequestResponse>('/api/operator/team_member_info', params);
}
