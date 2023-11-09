import {groupBy, map} from 'lodash-es';
import {IMSDK} from '../types';
import {ConversationActionlet} from './ConversationActionlet';
import {MessageActionlet, MessagePayload} from './MessageActionlet';
import {GroupActionlet} from './GroupActionlet';
import {FriendActionlet} from './FriendActionlet';
import {UserActionlet} from './UserActionlet';
import {FeatureActionlet} from './FeatureActionlet';
export * from './FeatureActionlet';
import {LoginParams} from '../core/SdkBase';
import {initFriendData} from '../db/data/initFriend';
import {initGroupData} from '../db/data/initGroup';
import {initConversationData} from '../db/data/initConversation';
import {getVersion} from '../../../api/user';
import {BaseActionlet} from './BaseActionlet';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const localStorage = AsyncStorage;

export abstract class IMActionlet extends BaseActionlet {
  /* @ts-ignore */
  private async initComlink() {
	let inited = false;
    this.comlink.init(this.user_id, 'web_chat').then(async () => {
		if(inited) {
			return;
		}
		inited = true;
		let conv_version = '0';
		let friend_version = '0';
		let groups_version: Array<any> = [];
		await getVersion({operation_id: Date.now().toString()}).then(res => {
      // console.log('res===>>>',res)
			if (res?.conversation_version) {
				conv_version = res.conversation_version;
			}
			if (res?.friend_version) {
				friend_version = res.friend_version + '';
			}
			if (res?.groups_version) {
				groups_version = res.groups_version;
			}
		});
		//console.log('data verison==>', conv_version, friend_version, groups_version);

		const user_id = this.user_id;
		localStorage.setItem('conversation_last' + user_id, conv_version + '');
		localStorage.setItem('friendversion_last' + user_id, friend_version + '');
		groups_version.forEach(item => {
			localStorage.setItem('groupversion_last' + user_id + '_' + item.group_id, item.group_version + '');
			localStorage.setItem('groupmemberversion_last' + user_id + '_' + item.group_id, item.member_version + '');
		})

		await initFriendData(friend_version); //初始化好友列表
		await initConversationData(conv_version); //初始化会话列表
		await initGroupData(groups_version); //初始化群列表
    });
  }

  login(payload: LoginParams) {
    return super.login(payload).then(res => {
      // init local db
      this.initComlink();

      return res;
    });
  }
}

export interface IMActionlet
  extends MessageActionlet,
    GroupActionlet,
    FriendActionlet,
    FeatureActionlet {}

applyMixins(IMActionlet, [
  ConversationActionlet,
  MessageActionlet,
  GroupActionlet,
  FriendActionlet,
  UserActionlet,
  FeatureActionlet,
]);

function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null),
      );
    });
  });
}
