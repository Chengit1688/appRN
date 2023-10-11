import {get, post} from '../utils/request';

// 获取钱包信息
export function getWallet(params: any) {
  return get<any>('/api/wallet', params);
}

// 获取账单记录
export function getWalletBilling(params: any) {
  return get<any>('/api/wallet/billing_records', params);
}

// 获取配置
export function getWithdrawConfig(params: any) {
  return get<any>('/api/wallet/withdraw_config', params);
}

// 获取配置
export function submitWithdraw(params: any) {
  return post<any>('/api/wallet/withdraw', params);
}

// 获取是否有设置支付密码
export function getPayPassword(params: any) {
  return post<any>('/api/user/has_element', params);
}

// 设置支付密码
export function setPayPassword(params: any) {
  return post<any>('/api/wallet/set_paypasswd', params);
}

// 发送个人红包
export function sendRedpack(params: any) {
  return post<any>('/api/wallet/redpack_single/send', params, {
    hasError: true,
  });
}

// 获取红包信息
export function getRedpackInfo(params: any) {
  return get<any>('/api/wallet/redpack_single', params);
}

// 领取个人红包
export function receiveRedpack(params: any) {
  return post<any>('/api/wallet/redpack_single/recv', params, {
    hasError: true,
  });
}

// 发送群红包
export function sendGroupRedpack(params: any) {
  return post<any>('/api/wallet/redpack_group/send', params, {
    hasError: true,
  });
}
//获取群红包信息
export function getGroupRedpackInfo(params: any) {
  return post<any>('/api/wallet/redpack_group', params);
}

// 领取群红包
export function receiveGroupRedpack(params: any) {
  return post<any>('/api/wallet/redpack_group/recv', params, {
    hasError: true,
  });
}
