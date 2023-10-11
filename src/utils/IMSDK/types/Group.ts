/* eslint-disable */
export enum GroupSwitch {
    OPEN = 1,
    CLOSE,
};


export interface GroupAttribute {
    id: string;
    /**
     * 群名
     * **/ 
    name: string;
    /**
     * 群头像
     * **/ 
    face_url: string;
    /**
     * 公告
     * **/ 
    notification: string;
    /**
     * 群简介
     * **/ 
     introduction: string;
     /**
     * 不显示普通用户
     * **/ 
    no_show_normal_member: GroupSwitch;
    /**
     * 不显示所有用户
     * **/ 
    no_show_all_member: GroupSwitch;
    /**
     * 不对普通用户显示二维码
     * **/ 
    show_qrcode_by_normal: GroupSwitch;
    /**
     * 是否允许申请入群
     * **/ 
    join_need_apply: GroupSwitch;
    /**
     * 暂无
     * **/ 
    ban_remove_by_normal: GroupSwitch;
    /**
     * 全员禁言
     * **/ 
    mute_all_member: GroupSwitch;
    /**
     * 是否置顶聊天(1 打开 2关闭)
     * **/ 
    is_topchat: GroupSwitch;
    /**
     * 是否开启消息免打扰(1 打开 2关闭)
     * **/ 
    is_disturb: GroupSwitch;
    /**
     * 是否置顶公告(1 打开 2关闭)
     * **/ 
    is_topannocuncement: GroupSwitch;
    is_open_admin_icon: GroupSwitch;
    is_open_admin_list: GroupSwitch;
    is_open_group_id: GroupSwitch;
    group_send_limit: GroupSwitch;
	is_display_nickname_open: GroupSwitch;
    /**
     * 机器人数量
     * **/ 
    robot_total: number;
}

export interface Group extends GroupAttribute {
    /**
     * 群id
     * **/ 
    group_id: string;
    /**
     * 会话ID,需要搭配其他配置产生主题ID
     * **/ 
    conversation_id: string;
    /**
     * 自己在群中的角色
     * **/ 
    role: string;
    /**
     * 群内用户总数 包括管理与群主
     * **/ 
    members_total: number;
    /**
     * 创群时间
     * **/ 
    create_time: number;
    /**
     * 创建者id
     * **/ 
    create_user_id: string;
    /**
     * 群状态 1 有效 2解散
     * **/ 
    status: number;
    /**
     * 群管理总数量 包括群主
     * **/ 
    admins_total: number;
    /**
     * 群信息的版本号
     * **/ 
    last_version: number;
    /**
     * 群成员的变化最后版本号
     * **/ 
    last_member_version: number;
    /**
     * 机器人数量
     * **/ 
    robot_total: number;
}

export interface GroupDetail extends Group {
    role: GroupMemberRole;
}

export enum GroupMemberRole {
    Owner = 'owner',
    Admin = 'admin',
    User = 'user',
}

export interface GroupMember {
    nick_name:string
    big_face_url: string
    face_url:string
    /**
     ** 通过[group_id]_[user_id]组装生成
     ** 307 ws 未推member_id
     * **/ 
    member_id: string;
    /**
     * 群id
     * **/ 
    group_id: string;
    /**
     * 用户id
     * **/ 
    user_id: string;
    /**
     * 冗余字段 暂无用
     * **/ 
    id: string;
    /**
     * 用户群内备注
     * **/ 
    group_nick_name: string;
    /**
     * 用户在群内角色 owner 群主 admin 管理员 user 普通成员
     * **/ 
    role: GroupMemberRole;
    /**
     * 禁言时间
     * **/ 
    mute_end_time: number;
    /**
     * 群成员的变化版本号
     * **/ 
    version: number;
    /**
     * 用户在群状态 1 有效 2被踢
     * **/ 
    status: string;
}

export enum JoinGroupApplyState {
    WaitHandle = 0,
    Accepted,
    Refused,
}

export interface JoinGroupApplication {
    id: number;
    group_id: string;
    user_id: string;
    remark: string;
    create_time: number;
    status: JoinGroupApplyState;
    operation_time: number;
    operator_user_id: string;
    nick_name: string;
    face_url: string;
}
