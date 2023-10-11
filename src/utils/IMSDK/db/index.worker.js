import Config from 'react-native-config'
import * as dbApi from './database'
import { getInstance, resetInstance } from './database/instance'
import { 
  localConversation, 
  localMessage, 
  localUser, 
  localGroup, 
  localGroupMember, 
  localFriend, 
  localGroupVersion, 
  localDatabaseVersion,
  localMassSendMsg,
  localCollectMessage
} from './sqls'
import * as Comlink from '../comlink'
import { converSqlExecResult, formatResponse } from './utils'

function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var obj = {
  async runQueries() {
    let db = await init();
  
    try {
      db.exec('CREATE TABLE kv (key TEXT PRIMARY KEY, value TEXT)');
    } catch (e) {}
  
    // db.exec('BEGIN TRANSACTION');
    // let stmt = db.prepare('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)');
    // for (let i = 0; i < 5; i++) {
    //   stmt.run([i, ((Math.random() * 100) | 0).toString()]);
    // }
    // stmt.free();
    // db.exec('COMMIT');
  
    // stmt = db.prepare(`SELECT SUM(value) FROM kv`);
    // stmt.step();
    // console.info('Result:', stmt.getAsObject());
    // stmt.free();
    db.exec(`INSERT OR REPLACE INTO kv (key, value) VALUES ('222', 3333)`)
    db.exec(`INSERT OR REPLACE INTO kv (key, value) VALUES ('aaaa', 3333)`)
    return await db.exec('SELECT * FROM kv')
  },
  //conversation
  async getConversationById(id) {
    return dbApi.getConversationById(id)
  },
  async insertConversationList(list) {
    return dbApi.insertConversationList(list)
  },
  async updateConversationName(id, name) {
    return dbApi.updateConversationName(id, name)
  },
  async insertConversation(conversation) {
    return dbApi.insertConversation(conversation)
  },
  async getConversationList() {
    return dbApi.getConversationList()
  },
  async getConversationCountByGroupId(id) {
    return dbApi.getConversationCountByGroupId(id)
  },
  async updateConversationList(list) {
    return dbApi.updateConversationList(list)
  },
  async updateConversationListNotFullValue(list) {
    return dbApi.updateConversationListNotFullValue(list)
  },
  async deleteConversationById(id) {
    return dbApi.deleteConversationById(id)
  },
  async getConversationByType(type) {
    return dbApi.getConversationByType(type)
  },
  async deleteAllConversation() {
    return dbApi.deleteAllConversation()
  },
  async deleteAllMessage() {
    return dbApi.deleteAllMessage()
  },
  async deleteMessageByUserId(user_ids, conv_id) {
    return dbApi.deleteMessageByUserId(user_ids, conv_id)
  },
  async deleteMessageByConvId(conv_id) {
    return dbApi.deleteMessageByConvId(conv_id)
  },
  async deleteConversationListByGroupId(group_ids) {
    return dbApi.deleteConversationListByGroupId(group_ids)
  },
  async updateConversationById(conversation) {
    return dbApi.updateConversationById(conversation)
  },
  async getConversationByIdAndType(id, type) {
    return dbApi.getConversationByIdAndType(id, type)
  },
  async getConversationCountByUserId(user_id) {
    return dbApi.getConversationCountByUserId(user_id)
  },
  async getDisabledConversation() {
    return dbApi.getDisabledConversation()
  },
  async clearMessageByConversationId(id) {
    return dbApi.clearMessageByConversationId(id)
  },
  //message
  async getMaxSeq(conversation_id){
    return dbApi.getMaxSeq(conversation_id)
  },
  async getMinSeq(conversation_id){
    return dbApi.getMinSeq(conversation_id)
  },

  async modifyMessageStatus(conversation_id){
    return dbApi.modifyMessageStatus(conversation_id)
  },

  async getMessage(pagesize, conversation_id, seq) {
    return dbApi.getMessage(pagesize, conversation_id, seq)
  },
  async getMessageAll(pagesize, conversation_id, seq) {
    return dbApi.getMessageAll(pagesize, conversation_id, seq)
  },
  
  async getMessageById(id) {
    return dbApi.getMessageById(id)
  },
  async getMessageByMsgId(id) {
    return dbApi.getMessageByMsgId(id)
  },
  async insertMessageList(list) {
    return dbApi.insertMessageList(list)
  },
  async updateMessageById(id) {
    return dbApi.updateMessageById(id)
  },
  async batchDeleteMessage(ids) {
    return dbApi.batchDeleteMessage(ids)
  },
  async insertMessage(message) {
    return dbApi.insertMessage(message)
  },
  async collectMessage(message, flag) {
	if(flag == false) {
		message.is_collect = 0;
	} else {
		message.is_collect = 1;
	}
    return dbApi.insertCollectMessage(message)
  },
  async searchMessageByContent(keyword, type, isFile) {
    return dbApi.searchMessageByContent(keyword, type, isFile)
  },
  async searchMessageByContentAndConversationId(keyword, type, conversation_id) {
    return dbApi.searchMessageByContentAndConversationId(keyword, type, conversation_id)
  },
  async searchCollectMessageByContent(keyword, type) {
    return dbApi.searchCollectMessageByContent(keyword, type)
  },
  //user
  async getUser(pagesize, pageNo) {
    return dbApi.getUser(pagesize, pageNo)
  },
  async getUserById(id) {
    return dbApi.getUserById(id)
  },
  async insertUser(user) {
    return dbApi.insertUser(user)
  },
  async insertUserList(userList) {
    return dbApi.insertUserList(userList)
  },
  //group
  async getGroupList() {
    return dbApi.getGroupList()
  },
  async getGroupById(id) {
    return dbApi.getGroupById(id)
  },
  async searchGroupById(keyword) {
    return dbApi.searchGroupById(keyword)
  },
  async searchGroupByName(keyword) {
    return dbApi.searchGroupByName(keyword)
  },
  async updateGroupById(group) {
    return dbApi.updateGroupById(group)
  },
  async insertGroupList(groupList) {
    return dbApi.insertGroupList(groupList)
  },
  async deleteGroups(ids) {
    return dbApi.deleteGroups(ids)
  },
  //groupMember
  async getGroupMember(pagesize, pageNo, groupId) {
    return dbApi.getGroupMemberList(pagesize, pageNo, groupId)
  },
  async getGroupMemberById(id) {
    return dbApi.getGroupMemberById(id)
  },
  async getGroupMemberAdminOrOwner(id) {
    return dbApi.getGroupMemberAdminOrOwner(id)
  },
  
  async insertGroupMember(groupMember) {
    return dbApi.insertGroupMember(groupMember)
  },
  async updateGroupMemberById(groupMember) {
    return dbApi.updateGroupMemberById(groupMember)
  },
  async insertGroupMemberList(groupMemberList) {
    return dbApi.insertGroupMemberList(groupMemberList)
  },
  async deleteGroupMembers(ids) {
    return dbApi.deleteGroupMembers(ids)
  },
  //friend
  async getFriendList() {
    return dbApi.getFriendList()
  },
  // async getFriends() {
  //   return dbApi.getFriendList()
  // },
  async getFriendById(id) {
    return dbApi.getFriendById(id)
  },
  async searchFriendByName(keyword) {
    return dbApi.searchFriendByName(keyword)
  },
  async updateFriendById(friend) {
    return dbApi.updateFriendById(friend)
  },
  async insertFriendList(friendList) {
    return dbApi.insertFriendList(friendList)
  },
  async deleteFriends(ids) {
    return dbApi.deleteFriends(ids)
  },
  //groupVersion
  async getGroupVersionList(pagesize, pageNo) {
    return dbApi.getGroupVersionList(pagesize, pageNo)
  },
  async getGroupVersionById(id) {
    return dbApi.getGroupVersionById(id)
  },
  async updateGroupVersionById(groupVersion) {
    return dbApi.updateGroupVersionById(groupVersion)
  },
  async insertGroupVersion(groupVersion) {
    return dbApi.insertGroupVersion(groupVersion)
  },
  async insertGroupVersionList(groupVersionList) {
    return dbApi.insertGroupVersionList(groupVersionList)
  },
  async deleteAllGroupVersion() {
    return dbApi.deleteAllGroupVersion()
  },
  async getMassSendMsgList() {
    return dbApi.getMassSendMsgList()
  },
  async insertMassSendMsg(message) {
    return dbApi.insertMassSendMsg(message)
  },
  async batchDeleteMassMessage(ids) {
    return dbApi.batchDeleteMassMessage(ids)
  },
  async init(userId, dir) {
    console.info(`=> (database api) invoke init with args ${JSON.stringify({userId,dir,})}`);
    try {
		// 建表
        const db = await getInstance(`${dir}${userId}.sqlite`);
        const results = [];
        const execResultLocalDatabaseVersion = await localDatabaseVersion(db)
        const execResultLocalConversation = await localConversation(db)
        const execResultLocalMessage = await localMessage(db)
        const execResultLocalUser = await localUser(db)
        const execResultLocalGroup = await localGroup(db)
        const execResultLocalGroupMember = await localGroupMember(db)
        const execResultLocalFriend = await localFriend(db)
        const execResultLocalMassSendMsg = await localMassSendMsg(db)
        const execResultLocalGroupVersion = await localGroupVersion(db)
		const execResultLocalCollectMessage = await localCollectMessage(db)
        results.push(...[
          execResultLocalDatabaseVersion,
          execResultLocalConversation,
          execResultLocalMessage,
          execResultLocalUser,
          execResultLocalGroup,
          execResultLocalGroupMember,
          execResultLocalFriend,
          execResultLocalMassSendMsg,
          execResultLocalGroupVersion,
		  execResultLocalCollectMessage
        ]);
		if(execResultLocalDatabaseVersion.version != Config.VITE_DATABSE_VERSION) {
			await dbApi.insertDatabaseVersion({id: 1, version: Config.VITE_DATABSE_VERSION})
		}
        obj.initData()
        
        return results;
    }
    catch (e) {
      console.error(e);
      throw new Error(e)
    }
  },
  async execsql(sql) {
    const db = await getInstance();
    console.info('execsql------', formatResponse(converSqlExecResult(await db.exec(sql)[0], 'SnakeCase', [], {})))
  },
  async initData() {
    // dbApi.insertUserList(user)
    // dbApi.insertGroupList(group)
    // dbApi.insertConversationList(conversationList)
    // dbApi.insertMessageList(messageList)
    // dbApi.insertGroupMemberList(groupMember)
    // dbApi.insertFriendList(friend)
    // console.info(await dbApi.getUserList(), await dbApi.getGroupList(), await dbApi.getGroupMemberList())
    // dbApi.batchDeleteMessage(['slaka','aslsak','asia'])
    // console.info(await dbApi.getConversationList(), '==============')
    // console.info(await dbApi.searchMessageByContent('d4325af4-9abd-4dca-904d-9d373e467da8', 6, true), '====================')
    // console.info(await dbApi.getMessage(100, '5593802898_8588337238', 1), '====================')
    
  },
  async close() {
    console.info('=> (database api) invoke close');
    try {
      await resetInstance();
      return '';
    }
    catch (e) {
      console.error(e);
    }
  }
}

Comlink.expose(obj)
export default obj