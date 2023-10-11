import {get, post} from '../utils/request';

interface RequestParams {}
interface RequestResponse {}

export function userRegister(params: RequestParams) {
  return post<RequestResponse>('/api/user/register', params);
}

export function userLogin(params: RequestParams) {
  return post<RequestResponse>('/api/user/login', params);
}

export function settingConfig(params: RequestParams) {
  return get<RequestResponse>('/api/setting/config', params);
}

export function domainConfig(params: RequestParams) {
  return post<RequestResponse>('/api/setting/domain_list', params);
}

export function verificationCode(params: any) {
  return post<RequestResponse>(`/api/setting/sms`, params);
}

export function forgotPassword(params: RequestParams) {
  return post<RequestResponse>('/api/user/forgot_password', params);
}

/**
 * 获取隐私政策
 * @param
 */
export function getPrivacyPolicy(params: RequestParams) {
  return get<RequestResponse>('/api/setting/privacy_policy', params);
}
/**
 * 获取用户协议
 * @param
 */
export function getUserAgreement(params: RequestParams) {
  return get<RequestResponse>('/api/setting/user_agreement', params);
}
