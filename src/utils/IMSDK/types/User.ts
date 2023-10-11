import {IMSDK} from './'

export interface UserProfile {
    remark: string;
    online: boolean;
    /**
     * 用户id
     * **/ 
    user_id: string;
    /**
     * 用户头像
     * **/ 
    face_url: string;
    /**
     * 昵称
     * **/ 
    nick_name: string;
    /**
     * 年龄
     * **/ 
    age: number;
    /**
     * 账户
     * **/ 
    account: number;
    /**
     * 电话号码
     * **/ 
    phone_number: string;
    /**
     * 登录ip
     * **/ 
    login_ip: string;
    /**
     * 性别 1-male;2-female
     * **/ 
    gender:  1 | 2;
    /**
     * 个性签名
     * **/ 
    signatures: string;
}

export interface ConversationConfig {
    conversation_id : IMSDK.Conversation['conversation_id'],
    is_top : IMSDK.Conversation['is_topchat'],
    is_nocare : IMSDK.Conversation['is_disturb']
    update_time:IMSDK.Conversation['update_time']
}


export type UserConfig = {
    conversation?:ConversationConfig[]
    conversationMap?:Record<IMSDK.Conversation['conversation_id'],ConversationConfig>
    
} & Record<string,unknown>