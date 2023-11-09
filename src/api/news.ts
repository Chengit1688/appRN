import { post } from '../utils/request';

interface RequestParams {}
interface RequestResponse {}

/**
 * 获取新闻列表
 * @param
 */
export function getNewList(params: RequestParams) {
    // console.log('params===>>>',params)
    return post<RequestResponse>('/api/news/list', params);
}

/**
 * 获取新闻详情
 * @param
 */
export function getNewsDetail(params: RequestParams) {
       console.log('params===>>>',params)
    return post<RequestResponse>('/api/news/detail', params);
}

