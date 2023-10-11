import {IMSDK, AddFriendNotify, FirendListItem} from './';

/** 视频流推送 **/
export const Videootify = 404;

/** 聊天消息推送 **/
export const MessageNotify = 400;

/** 新的好友申请通知 **/
export const MessageFriendNotify = 200;
/** 新增好友通知 **/
export const MessageFniendAddNotify = 201;

/** 用户更新通知 **/
export const MessageFniendSetRemarkNotify = 204;

/** 新增群 **/
export const MessageGroupNotify = 300;

/** 移除群 **/
export const MessageGroupDeleteNotify = 301;

/** 群配置 **/
export const MessageGroupInfoUpdate = 302;

/** 群成员有变化 **/
export const MessageGroupMemberChange = 307;

export interface EventsMap extends Record<keyof typeof IMSDK.Event, unknown> {
  [MessageGroupNotify]: IMSDK.GroupDetail;
  [MessageGroupDeleteNotify]: unknown;
  [MessageGroupInfoUpdate]: IMSDK.GroupAttribute;
  [MessageNotify]: IMSDK.Message;
  [MessageFriendNotify]: FirendListItem;
  [MessageFniendAddNotify]: AddFriendNotify;
  [MessageGroupMemberChange]: IMSDK.GroupMember[];
  [MessageFniendSetRemarkNotify]: AddFriendNotify;
}

export type EventKey = keyof EventsMap;
