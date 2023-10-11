// @ts-ignore
// import OSS from 'ali-oss';
import Config from 'react-native-config';
import {get, post} from '../utils/request';
import {StorageFactory} from '@/utils/storage';

interface RequestParams {}
interface RequestResponse {}

export function resetPassword(params: RequestParams) {
  return post<RequestResponse>('/api/user/password_secure', params);
}

export function resetPayPassword(params: RequestParams) {
  return post<RequestResponse>('/api/wallet/set_paypasswd', params);
}

export function updateInfo(params: RequestParams) {
  return post<RequestResponse>('/api/user/update_info', params);
}
export function getVersion(params: any) {
  return post<RequestResponse>('/api/user/server_version', params);
}
export function upload(params: any, config?: any) {
  return post<RequestResponse>('/api/third/upload', params, config);
}
export function getDomainList(params: any) {
  return post<RequestResponse>('/api/setting/domain_list', params);
}
export async function uploadV2(params: any, config?: any) {
  const res: any = await getDomainList({});
  const list = res?.list || [];
  const data = list.find((item: any) => item.site === 'minio');
  const newConfig = {...config};
  if (data?.domain) {
    // 判断开发环境
    if (Config.MODE === 'development') {
      newConfig.baseURL = '/domain';
    } else {
      newConfig.baseURL = `${data?.domain}`;
    }
  }
  await StorageFactory.setSession('SSO_DOMAIN', newConfig.baseURL);

  return post<RequestResponse>('/api/third/upload/v2', params, newConfig);
}
export async function ossUpload(params: any) {
  // return new Promise(async (resolve, reject) => {
  //   const res: any = await get<RequestResponse>('/api/third/sts', params);
  //   const OSSOptions = {
  //   //   endpoint: res.endPoint, // 阿里云域名（注意：可以写http或https, 但如果系统是https, 必须用https）
  //     accessKeyId: res.accessId,
  //     accessKeySecret: res.accessSecret, // 密钥
  //     bucket: res.bucketName, // 存储桶名（类似大类别目录名）
  //     region: res.region,
  //     stsToken: res.securityToken,
  //   };
  //   const ossClient = new OSS(OSSOptions);
  //   ossClient
  //     .multipartUpload(
  //       Date.now().toString(),
  //       params.file,
  //       {
  //           partSize: 500 * 1024,
  //           meta: {
  //               year: 2023,
  //               people: 'test'
  //           },
  //           timeout: 60000,
  //         progress: function (p, checkpoint) {
  //           console.log('上传实时进度为', p.toFixed(2) * 100);
  //         },
  //       }
  //     )
  //     .then((ret) => {
  //       console.log('上传成功', ret);
  //     }).catch((err) => {
  //       console.log('err--', err);
  //
  //     });
  // });
}
export function getUserOnline(params: any) {
  return post<RequestResponse>('/api/user/get_user_online_status', params);
}
export function getUserInfo(params: any, headers: any) {
  return get<RequestResponse>('/api/user/info', params, headers);
}
export function suggestion(params: any) {
  return post<RequestResponse>('/api/user/suggestion', params);
}
export function pingNet(params: any) {
  return get<RequestResponse>('/vite.svg', params);
}
// 获取隐私设置
export function getPrivacy(params: any) {
  return post<RequestResponse>('/api/user/get_privacy', params);
}
// 隐私设置
export function setPrivacy(params: any) {
  return post<RequestResponse>('/api/user/set_privacy', params);
}
