import { UserProfile } from './User';

export interface BaseFriend {
    id: number
    /**
         * 用户id
         * **/
    user_id: string;
    face_url: string
    nick_name: string
    account: string
    /**
     * 好友建立时间
     * **/
    create_time: number;
    /**
     * 好友请求状态 0 待审核 1已通过 2已拒绝
     * 好友 1是 2不是
     * **/ 
    status: number
}

export interface Friend extends BaseFriend {
    /**
     * 会话id
     * **/
    conversation_id: string;
    /**
     * 备注
     * **/
    remark: string;
    /**
     * 性别
     * **/
    gender: number;
    age: number
    /**
     * 好友状态 好友 1是 2不是
     * **/
    friend_status: 1 | 2;
    /**
     * 在线状态 在线 1是 2不是
     * **/
    online_status: 1 | 2;
    /**
     * 黑名单 1是 2不是
     * **/
    black_status: 1 | 2;
    /**
     * 关联用户
     * **/
    user: UserProfile;
}

export interface FirendListItem extends BaseFriend {
    req_msg: string
}

export interface AddFriendNotify extends Friend {
    face_url: string
    phone_number?:string
    login_ip: string
    login_ip_localtion: string
    version: number
    signatures: string
}