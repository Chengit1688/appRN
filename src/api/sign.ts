import {get, post} from '../utils/request';

interface RequestParams {}
interface RequestResponse {}

/**
 * 获取当月签到信息
 * @param
 */
export function getUserSignInfo(params: RequestParams) {
  return get<RequestResponse>('/api/user/user_sign_info_week', params);
}

/**
 * 用户签到
 * @param
 */
export function signToday(params: RequestParams) {
  return post<RequestResponse>('/api/user/sign_today', params);
}

/**
 * 奖品列表
 * @param
 */

export function getPrizeList(params: RequestParams) {
  return post<RequestResponse>('/api/user/prize_list', params);
}

/**
 * 兑换奖品
 * @param
 */
export function exchangePrize(params: RequestParams) {
  return post<RequestResponse>('/api/user/redeem_prize', params);
}

/**
 * 兑换奖品列表
 * @param
 */

export function getPrizeRecord(params: RequestParams) {
  return post<RequestResponse>('/api/user/redeem_prize_list', params);
}
