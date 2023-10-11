import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {View, ListItem, Text} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import MessageAvatar from '@/components/MessageAvatar';

export type MessageType = {
  type: string; // 用户类型：联系人、公告、客服等
  avatar: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'unknown' | undefined;
  lastMsgTime: string;
  lastMsgContent: string;
  lastMsgType: 'normal' | 'red_packet' | undefined;
  unreadcount: number;
};

const messages: Array<MessageType> = [
  {
    type: '',
    avatar: '',
    name: '张三',
    status: 'online',
    lastMsgTime: '9:32',
    lastMsgContent: 'Hi,你好。',
    lastMsgType: 'normal',
    unreadcount: 0,
  },
  {
    type: '',
    avatar: '',
    name: '李四',
    status: 'offline',
    lastMsgTime: '9:32',
    lastMsgContent: 'Hi,你好。',
    lastMsgType: 'normal',
    unreadcount: 0,
  },
  {
    type: '',
    avatar: '',
    name: '王五',
    status: 'busy',
    lastMsgTime: '9:32',
    lastMsgContent: 'Hi,你好。',
    lastMsgType: 'normal',
    unreadcount: 0,
  },
  {
    type: '',
    avatar: '',
    name: '赵六',
    status: 'unknown',
    lastMsgTime: '9:32',
    lastMsgContent: 'Hi,你好。',
    lastMsgType: 'normal',
    unreadcount: 0,
  },
  {
    type: '',
    avatar: '',
    name: '孙七',
    status: 'online',
    lastMsgTime: '9:32',
    lastMsgContent: 'Hi,你好。',
    lastMsgType: 'normal',
    unreadcount: 0,
  },
  {
    type: '',
    avatar: '',
    name: '周八',
    status: 'online',
    lastMsgTime: '9:32',
    lastMsgContent: 'Hi,你好。',
    lastMsgType: 'normal',
    unreadcount: 0,
  },
  {
    type: '',
    avatar: '',
    name: '吴九',
    status: 'online',
    lastMsgTime: '9:32',
    lastMsgContent: 'Hi,你好。',
    lastMsgType: 'normal',
    unreadcount: 0,
  },
  {
    type: '',
    avatar: '',
    name: '郑十',
    status: 'online',
    lastMsgTime: '9:32',
    lastMsgContent: 'Hi,你好。',
    lastMsgType: 'normal',
    unreadcount: 0,
  },
];

export default class MessageScreen extends Component {
  keyExtractor = (item: MessageType) => item.name;

  renderRow(row: MessageType, id: number) {
    return (
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(70)}
        onPress={() => {
          console.debug(`pressed on order #${id + 1}`);
        }}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(25),
          }}>
          <MessageAvatar
            {...{
              name: row.name,
              status: row.status,
            }}
          />
        </ListItem.Part>

        <ListItem.Part middle row>
          <ListItem.Part
            middle
            column
            containerStyle={{
              // height: pt(70),
              marginLeft: pt(15.5),
              marginRight: pt(15.5),
            }}>
            <Text
              style={{
                marginBottom: pt(13),
                color: '#222222',
                fontSize: pt(14),
                fontWeight: 'bold',
              }}>
              {row.name}
            </Text>
            <Text
              style={{
                color: '#959595',
                fontSize: pt(11),
              }}>
              {row.lastMsgContent}
            </Text>
          </ListItem.Part>
          <ListItem.Part
            containerStyle={{
              marginRight: pt(25),
            }}>
            <Text
              style={{
                color: '#999999',
                fontSize: pt(12),
              }}>
              {row.lastMsgTime}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    );
  }

  render() {
    return (
      <FlatList
        data={messages}
        renderItem={({item, index}) => this.renderRow(item, index)}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}
