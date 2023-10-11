import { get } from '../utils/request';

interface DemoRequestParams {}
interface DemoRequestResponse {}

export function demoApi(params: DemoRequestParams) {
    return get<DemoRequestResponse>('/api/demo', params);
}
