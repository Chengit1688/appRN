import { IMSDK,UserConfig } from '../types';
import { BaseActionlet } from './BaseActionlet';

export abstract class UserActionlet extends BaseActionlet {
    /**
     * 获取个人资料
     */
    getMyProfile() {
        return this.get<IMSDK.UserProfile>('/api/user/info');
    }

    /**
     * 更新个人资料
     */
    updateMyProfile(params: Partial<Omit<IMSDK.UserProfile, 'user_id' | 'phone_number'>>) {
        return this.post('/api/user/update_info', {
            ...params,
            user_id: this.user_id,
        });
    }

    /**
     * 获取其他用户资料
     */
    getUserProfile(user_id: string) {
        return this.post<IMSDK.UserProfile | null>('/api/friend/get_friend', {
            user_id: user_id,
        });
    }

    /**
     * 获取用户信息(非好友也可获取)
     */
    getUserInfo(user_id: string) {
        return this.post<IMSDK.UserProfile | null>('/api/user/get_user_info', {
            user_id: user_id,
        });
    }

    /**
     * 获取用户配置
     */
    getUserConfig() {
        return this.get<{
            content:string
        }>('/api/user/get_user_config');
    }

    /**
     * 更新用户配置
     */
    updateUserConfig(content: string) {
        return this.post<UserConfig>('/api/user/user_config_handle', {
            content,
        });
    }

    /**
     * 获取用户钱包
     */
    getUserWallet() {
        return this.get<{
            content:string
        }>('/api/wallet');
    }
}