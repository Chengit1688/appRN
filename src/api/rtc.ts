import { get, post } from '../utils/request';

interface RequestParams {}
interface RequestResponse {
  rtc_channel(rtc_channel: any): unknown;
  rtc_token(rtc_token: any): unknown;
}


// 获取rtc 
export function getRtc(params: any) {
    return get<RequestResponse>('/api/chat/rtc_info',params);
}
// 发起RTC
export function setRtc(params: RequestParams) {
    return post<RequestResponse>('/api/chat/rtc', params);
}

// 操作RTC
export function operateRtc(params: RequestParams) {
    return post<RequestResponse>('/api/chat/rtc_operate', params);
}

// 更新RTC  RTC保活，2s调用一次，10s未调用，RTC通话结束
export function upRtc(params: RequestParams) {
    return post<RequestResponse>('/api/chat/rtc_update', params);
}