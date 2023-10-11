/* eslint-disable */
import {Events} from './Events';
import {Message as _Message} from './Message';
import * as GRP from './Group';
import {UserProfile as _UserProfile} from './User';
import {EventKey} from './MessageDataType';
import * as MessageDataType from './MessageDataType';
export * from './MessageDataType';
export * from './User';
export * from './Friend';
export * from './Features';
export * from './Group';

export namespace IMSDK {
  export enum ConnectState {
    CONNECTING = 1,
    CONNECTED,
    RECONNECTING,
    LOSTCONNECT,
    CLOSED,
    NETWORKERROR,
    CONNECTERROR,
  }

  export const dataType = MessageDataType;

  export const Event = Events;

  export enum ConversationType {
    C2C = 1,
    GROUP = 2,
    CHANNEL = 3,
  }
  export interface Conversation {
    /**
     * 会话ID
     * **/
    conversation_id: string;
    /**
     * 会话类型 1 单聊 2 群聊 3 频道
     * **/
    type: ConversationType;
    /**
     * 版本
     * **/
    version: string;
    /**
     * 消息同步版本标记
     * **/
    ack_seq: string;
    /**
     * 最新的消息版本标记
     * **/
    max_seq: string;
    /**
     * 当事人用户
     * **/
    friend: string;
    /**
     * 当事的群id
     * **/
    group_id: string;
    /**
     * 最新的消息id
     * **/
    latest_message: string;
    /**
     * 主题会话激活状态 active 0不显示 1显示
     * **/
    status: number;
    /**
     * 是否置顶聊天(1 打开 2关闭)
     * **/
    is_topchat: number;
    /**
     * 未读数
     * **/
    unread_count: number;
    /**
     * 否开启消息免打扰(1 打开 2关闭)
     * **/
    is_disturb: 1 | 2;
    /**
     * 更新时间
     * **/
    update_time: number;
    /**
     * 关联用户
     * **/
    user: _UserProfile;
    /**
     * 关联群聊
     * **/
    group: Group;
    /** 关联消息 **/
    msg?: Message;

    remark: string;

    /** 当前会话是否有@消息  【前端新增，后续备用】**/
    at: 0 | 1;

    /**草稿 */
    draft: string;
  }

  export interface Message extends _Message {}

  export enum MessageType {
    UNKNOWN = 0,
    TEXT = 1,
    FACE = 2,
    PIC = 3,
    VOICE = 4,
    VIDEO = 5,
    FILE = 6,
    QUOTE_INFO = 9,
    LINK = 10,
    READED = 101,
    REVOKE = 102,
    DELETE = 103,
    FRIEND_ADD_NOTIFY = 201,
    GROUP_CREATE_NOTIFY = 301,
    GROUP_ADD_MEMBER_NOTIFY = 302,
    GROUP_DELETE_NOTIFY = 303,
    GROUP_SET_ADMIN_NOTIFY = 304,
    GROUP_UNSET_ADMIN_NOTIFY = 305,
    GROUP_ONE_MUTE_NOTIFY = 306,
    GROUP_ONE_UNMUTE_NOTIFY = 307,
    GROUP_ALL_MUTE_NOTIFY = 308,
    GROUP_ALL_UNMUTE_NOTIFY = 309,
    GROUP_TRANSFER_NOTIFY = 310,
    GROUP_NOTIFICATION_NOTIFY = 311,
    VIDEO_AUDIO = 404,
  }

  export enum MessageStatus {
    SENDING = -1,
    UNREAD,
    READED,
    REVOKED,
    DELETED,
  }

  export interface SearchMessageGroup {
    length: number;
    conversation_id: Message['conversation_id'];
    conversation_type: Message['conversation_type'];
    data: Message[];
    name: string;
    face_url: string;
  }

  export interface BaseMessageBody<T = unknown> {
    type: EventKey;
    data: T;
  }

  export type Group = GRP.Group;
  export type GroupDetail = GRP.GroupDetail;
  export type GroupAttribute = GRP.GroupAttribute;
  export type GroupMember = GRP.GroupMember;
  export type GroupMemberRole = GRP.GroupMemberRole;
  export type JoinGroupApplication = GRP.JoinGroupApplication;
  export type JoinGroupApplyState = GRP.JoinGroupApplyState;

  export type UserProfile = _UserProfile;
}
