import {IMSDK} from '../../utils/IMSDK';

export interface ConversationState {
  conversationList: IMSDK.Conversation[];
  currentConversation: IMSDK.Conversation | null;
  conversationAtList: any;
  currentMessageList: IMSDK.Message[];
  nextReqMessageID: string;
  settingInfo: any;
  unreadCount: number;
}
