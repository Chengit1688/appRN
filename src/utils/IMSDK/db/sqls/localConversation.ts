import squel from 'squel';
import {IMSDK} from '../../types';
import {checkDatabaseVersion} from './databaseVersion';
import {formatData} from '../utils';

export async function localConversation(db: any) {
  if (!(await checkDatabaseVersion(db))) {
    db.exec('drop table if exists conversation_list');
  }
  //type 会话类型 1 单聊 2 群聊 3频道
  return db.exec(`
    create table if not exists 'conversation_list' (
        'conversation_id' varchar(64),
        'type' INTEGER DEFAULT 0,
        'version' INTEGER DEFAULT 0,
        'ack_seq' INTEGER DEFAULT 0,
        'max_seq' INTEGER DEFAULT 0,
        'friend' varchar(64),
        'group_id' varchar(64),
        'latest_message' varchar(64),
        'status' INTEGER DEFAULT 0,
        'is_topchat' INTEGER DEFAULT 2,
        'is_disturb' INTEGER DEFAULT 2,
        'unread_count' INTEGER DEFAULT 0,
        'update_time' INTEGER DEFAULT 0,
        'deleted_at' INTEGER DEFAULT 0,
        'face_url' varchar(255),
        'name' varchar(64),
        'clean_seq' INTEGER DEFAULT 0,
        'read_seq' INTEGER DEFAULT 0,
        'at' INTEGER DEFAULT 0,
        'draft' varchar(255),
      primary key ('conversation_id')
    ) 
  `);
}

export function getConversationList(db: any, type: number) {
  let sql = '';
  if (type == 1) {
    sql = `
      select conversation_list.type,
        conversation_list.conversation_id,
        conversation_list.deleted_at,
        conversation_list.face_url,
        conversation_list.name,
        conversation_list.version,
        conversation_list.ack_seq,
        conversation_list.max_seq,
        conversation_list.status,
        conversation_list.latest_message,
        conversation_list.unread_count,
        conversation_list.is_topchat,
        conversation_list.is_disturb,
        conversation_list.update_time,
        conversation_list.clean_seq,
        conversation_list.read_seq,
        user_list.user_id as user_id_user,
        user_list.face_url as face_url_user,
        user_list.big_face_url as big_face_url_user,
        user_list.nick_name as nick_name_user,
        user_list.age as age_user,
        user_list.account as account_user,
        user_list.phone_number as phone_number_user,
        user_list.login_ip as login_ip_user,
        user_list.gender as gender_user,
        user_list.signatures as signatures_user,
        friend_list.remark as remark_user,
        friend_list.create_time as create_time_user,
        friend_list.friend_status as friend_status_user,
        friend_list.online_status as online_status_user,
        friend_list.black_status as black_status_user
        from (
          friend_list left join user_list on
          friend_list.user_id = user_list.user_id
        ) left join conversation_list on 
        conversation_list.friend == user_list.user_id 
      where conversation_list.type = 1 and conversation_list.status <> 0 and conversation_list.deleted_at = 0
    `;
  } else {
    sql = `
      select conversation_list.type,
        conversation_list.conversation_id,
        conversation_list.deleted_at,
        conversation_list.face_url,
        conversation_list.name,
        conversation_list.version,
        conversation_list.ack_seq,
        conversation_list.max_seq,
        conversation_list.status,
        conversation_list.latest_message,
        conversation_list.unread_count,
        conversation_list.is_topchat,
        conversation_list.is_disturb,
        conversation_list.update_time,
        conversation_list.clean_seq,
        conversation_list.read_seq,
        group_list.group_id as group_id_group,
        group_list.conversation_id as conversation_id_group,
        group_list.name as name_group,
        group_list.role as role_group,
        group_list.face_url as face_url_group,
        group_list.members_total as members_total_group,
        group_list.notification as notification_group,
        group_list.introduction as introduction_group,
        group_list.create_time as create_time_group,
        group_list.create_user_id as create_user_id_group,
        group_list.status as status_group,
        group_list.no_show_normal_member as no_show_normal_member_group,
        group_list.no_show_all_member as no_show_all_member_group,
        group_list.show_qrcode_by_normal as show_qrcode_by_normal_group,
        group_list.join_need_apply as join_need_apply_group,
        group_list.ban_remove_by_normal as ban_remove_by_normal_group,
        group_list.mute_all_member as mute_all_member_group,
        group_list.admins_total as admins_total_group,
        group_list.last_version as last_version_group,
        group_list.last_member_version as last_member_version_group,
        group_list.is_default as is_default_group,
        group_list.is_topchat as is_topchat_group,
        group_list.is_disturb as is_disturb_group,
        group_list.is_topannocuncement as is_topannocuncement_group,
        group_list.is_open_admin_list as is_open_admin_list_group,
        group_list.is_open_admin_icon as is_open_admin_icon_group,
        group_list.is_open_group_id as is_open_group_id_group,
		    group_list.is_display_nickname_open as is_display_nickname_open_group,
        group_list.group_send_limit as group_send_limit_group,
        group_list.robot_total as robot_total_group
        from conversation_list left join group_list on 
        conversation_list.group_id == group_list.group_id 
      where conversation_list.type <> 1 and conversation_list.status <> 0 and conversation_list.deleted_at = 0
    `;
  }
  let data = db.exec(sql);
  return data;
}

export function getConversationById(db: any, id: string) {
  return db.exec(`
    select * from conversation_list where conversation_id = "${id}" and status <> 0 and deleted_at = 0;
  `);
}

export function getDisabledConversation(db: any) {
  return db.exec(`
    select conversation_id, group_id from conversation_list where status = 0;
  `);
}

export function getConversationByType(db: any, type: number) {
  return db.exec(`
    select * from conversation_list where type = "${type}" and status <> 0 and deleted_at = 0;
  `);
}

export function getConversationByIdAndType(db: any, id: string, type: number) {
  let sql = '';
  if (type == 1) {
    sql = `
          select conversation_list.type,
            conversation_list.conversation_id,
            conversation_list.deleted_at,
            conversation_list.face_url,
            conversation_list.name,
            conversation_list.version,
            conversation_list.ack_seq,
            conversation_list.max_seq,
            conversation_list.status,
            conversation_list.latest_message,
            conversation_list.unread_count,
            conversation_list.is_topchat,
            conversation_list.is_disturb,
            conversation_list.update_time,
            conversation_list.clean_seq,
            conversation_list.read_seq,
            user_list.user_id as user_id_user,
            user_list.face_url as face_url_user,
            user_list.big_face_url as big_face_url_user,
            user_list.nick_name as nick_name_user,
            user_list.age as age_user,
            user_list.account as account_user,
            user_list.phone_number as phone_number_user,
            user_list.login_ip as login_ip_user,
            user_list.gender as gender_user,
            user_list.signatures as signatures_user,
            friend_list.remark as remark_user,
            friend_list.create_time as create_time_user,
            friend_list.friend_status as friend_status_user,
            friend_list.online_status as online_status_user,
            friend_list.black_status as black_status_user
            from (
              friend_list left join user_list on
              friend_list.user_id = user_list.user_id
            ) left join conversation_list on 
            conversation_list.friend == user_list.user_id 
          where conversation_list.conversation_id = "${id}"
        `;
  } else {
    sql = `
        select conversation_list.type,
          conversation_list.conversation_id,
          conversation_list.deleted_at,
          conversation_list.face_url,
          conversation_list.name,
          conversation_list.version,
          conversation_list.ack_seq,
          conversation_list.max_seq,
          conversation_list.status,
          conversation_list.latest_message,
          conversation_list.unread_count,
          conversation_list.is_topchat,
          conversation_list.is_disturb,
          conversation_list.update_time,
          conversation_list.clean_seq,
          conversation_list.read_seq,
          group_list.group_id as group_id_group,
          group_list.conversation_id as conversation_id_group,
          group_list.name as name_group,
          group_list.role as role_group,
          group_list.face_url as face_url_group,
          group_list.members_total as members_total_group,
          group_list.notification as notification_group,
          group_list.introduction as introduction_group,
          group_list.create_time as create_time_group,
          group_list.create_user_id as create_user_id_group,
          group_list.status as status_group,
          group_list.no_show_normal_member as no_show_normal_member_group,
          group_list.no_show_all_member as no_show_all_member_group,
          group_list.show_qrcode_by_normal as show_qrcode_by_normal_group,
          group_list.join_need_apply as join_need_apply_group,
          group_list.ban_remove_by_normal as ban_remove_by_normal_group,
          group_list.mute_all_member as mute_all_member_group,
          group_list.admins_total as admins_total_group,
          group_list.last_version as last_version_group,
          group_list.last_member_version as last_member_version_group,
          group_list.is_default as is_default_group,
          group_list.is_topchat as is_topchat_group,
          group_list.is_disturb as is_disturb_group,
          group_list.is_topannocuncement as is_topannocuncement_group,
          group_list.is_open_admin_list as is_open_admin_list_group,
          group_list.is_open_admin_icon as is_open_admin_icon_group,
          group_list.is_open_group_id as is_open_group_id_group,
		  group_list.is_display_nickname_open as is_display_nickname_open_group,
          group_list.group_send_limit as group_send_limit_group,
          group_list.robot_total as robot_total_group
          from conversation_list left join group_list on 
          conversation_list.group_id == group_list.group_id 
        where conversation_list.conversation_id = "${id}"
      `;
  }
  return db.exec(sql);
}

export function getConversationCountByGroupId(db: any, id: string) {
  return db.exec(`
    select count(*) as total from conversation_list where group_id = "${id} and status <> 0 and deleted_at = 0";
  `);
}

export function getConversationCountByUserId(db: any, id: string) {
  return db.exec(`
    select conversation_id from conversation_list where friend = "${id}" and status <> 0 and deleted_at = 0;
  `);
}

// export function deleteConversationById(db: any, id: string) {
//   return db.exec(`
//     DELETE
//       FROM conversation_list
//       WHERE conversation_id = "${id}"
//   `);
// }
export async function deleteConversationById(db: any, id: string) {
  const sql = squel
    .update()
    .table('conversation_list')
    .set('status', 0)
    .where(`conversation_id = '${id}'`)
    .toString();
  return await db.exec(sql);
}

export async function deleteAllConversation(db: any) {
  return await db.exec(`
    DELETE FROM conversation_list
  `);
}

export async function updateConversationName(
  db: any,
  conversation_id: string,
  value: string,
) {
  // return await db.exec(`
  //   UPDATE conversation_list SET name = "${value}"
  // `);
  const sql = squel
    .update()
    .table('conversation_list')
    .set('name', value)
    .where(`conversation_id = '${conversation_id}'`)
    .toString();
  return await db.exec(sql);
}
export async function updateConversationById(
  db: any,
  conversation: IMSDK.Conversation,
) {
  delete conversation.group;
  delete conversation.user;
  formatData(conversation);
  const sql = squel
    .update()
    .table('conversation_list')
    .setFields(conversation)
    .where(`conversation_id = '${conversation.conversation_id}'`)
    .toString();
  return await db.exec(sql);
}

export function updateConversationList(
  db: any,
  conversationList: IMSDK.Conversation[],
) {
  if (conversationList.length > 0) {
    conversationList.forEach(async (item, index) => {
      let data = await getConversationById(db, item.conversation_id);
      if (data.length == 0) {
        insertConversation(db, item);
      }
    });
  }
  if (conversationList.length > 0) {
    conversationList.forEach(item => {
      delete item.group;
      delete item.user;
      updateConversationById(db, item);
    });
  }
  return [];
}

export function updateConversationListNotFullValue(
  db: any,
  conversationList: IMSDK.Conversation[],
) {
  formatData(conversationList);
  const sql = squel
    .insert()
    .into('conversation_list')
    .setFieldsRows(conversationList)
    .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}

export function insertConversation(db: any, conversation: IMSDK.Conversation) {
  delete conversation.group;
  delete conversation.user;

  try {
    formatData(conversation);
    const sql = squel
      .insert()
      .into('conversation_list')
      .setFields(conversation)
      .toString();
    return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
  } catch (e) {
    console.log(e);
    return;
  }
}

export function batchInsertConversationList(
  db: any,
  conversationList: IMSDK.Conversation[],
) {
  if (conversationList.length > 0) {
    conversationList.forEach(item => {
      delete item.group;
      delete item.user;
    });
  } else {
    return [];
  }
  formatData(conversationList);
  const sql = squel
    .insert()
    .into('conversation_list')
    .setFieldsRows(conversationList)
    .toString();
  return db.exec(sql.replace('INSERT', 'INSERT OR REPLACE'));
}

export function batchDeleteConversation(db: any, ids: string[]) {
  let str = ids.join('","');
  return db.exec(`
    DELETE FROM conversation_list WHERE group_id IN ("${str}")
  `);
}
