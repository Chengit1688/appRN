import moment from 'moment';

export const OWNID = 1001; //用户id

export const TYPE = [
  'text', //文本
  'image', //图片
  'voice', //语音
  'video', //视频
  'file', //文件
  'card', //名片
  'redPacket', //红包
  'transfer', //转账
  'voiceCall', //语音电话
  'videoCall', //视频电话
];

export type TEXT = {
  message: string;
};

export type IMAGE = {};

export type VOICE = {};

export type VIDEO = {};
export type FILE = {};

export type CARD = {
  uid: number;
  nickname: string;
  avatar: string;
};

export type REDPACKET = {
  greeting: string;
  state: number; // 0:未领取|1:已领取|2:超时未领取|3:超时不可查看
};
export type TRANSFER = {
  amount: number;
  state: number; // 0:未领取|1:已领取|2:超时未领取|3:超时不可查看
};

export type VOICECALL = {};
export type VIDEOCALL = {};

export type MessageItem = {
  id: string;
  time: string;
  type: string;
  unread: boolean;
  user: {
    uid: number;
    nickname: string;
    avatar: string;
  };
  msg: {
    type: string;
    content:
      | TEXT
      | IMAGE
      | VOICE
      | VIDEO
      | FILE
      | CARD
      | REDPACKET
      | TRANSFER
      | VOICECALL
      | VIDEOCALL;
  };
};

export const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba1',
    time: moment('2023-06-01 12:22:42').format('YYYY-MM-DD hh:mm:ss'),
    type: 'chat',
    unread: true,
    user: {
      uid: 1000,
      nickname: '张三',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    },
    msg: {
      type: 'text',
      content: {message: '你好'},
    },
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f631',
    time: moment('2023-06-05 12:22:42').format('YYYY-MM-DD hh:mm:ss'),
    type: 'chat',
    unread: true,
    user: {
      uid: 1001,
      nickname: '李四',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    },
    msg: {
      type: 'text',
      content: {message: '你好'},
    },
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d721',
    time: moment('2023-06-05 12:25:42').format('YYYY-MM-DD hh:mm:ss'),
    type: 'chat',
    unread: true,
    user: {
      uid: 1001,
      nickname: '李四',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    },
    msg: {
      type: 'text',
      content: {message: '有什么事吗？'},
    },
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d722',
    time: moment().format('YYYY-MM-DD hh:mm:ss'),
    type: 'chat',
    unread: true,
    user: {
      uid: 1001,
      nickname: '李四',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    },
    msg: {
      type: 'text',
      content: {
        message:
          '我是平台官方客服，请问有什么可以帮到您的吗？我是平台官方客服，请问有什么可以帮到您的吗？',
      },
    },
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d723',
    time: moment().format('YYYY-MM-DD hh:mm:ss'),
    type: 'chat',
    unread: true,
    user: {
      uid: 1001,
      nickname: '李四',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    },
    msg: {
      type: 'card',
      content: {
        uid: 1002,
        nickname: '王五',
        avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
      },
    },
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d724',
    time: moment().format('YYYY-MM-DD hh:mm:ss'),
    type: 'chat',
    unread: true,
    user: {
      uid: 1000,
      nickname: '张三',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    },
    msg: {
      type: 'card',
      content: {
        uid: 1002,
        nickname: '王五',
        avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
      },
    },
  },

  {
    id: '58694a0f-3da1-471f-bd96-145571e29d725',
    time: moment().format('YYYY-MM-DD hh:mm:ss'),
    type: 'chat',
    unread: true,
    user: {
      uid: 1000,
      nickname: '张三',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    },
    msg: {
      type: 'redPacket',
      content: {
        greeting: '恭喜发财，大吉大利！',
        state: 0,
      },
    },
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d726',
    time: moment().format('YYYY-MM-DD hh:mm:ss'),
    type: 'chat',
    unread: false,
    user: {
      uid: 1000,
      nickname: '张三',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    },
    msg: {
      type: 'redPacket',
      content: {
        greeting: '双喜临门！',
        state: 1,
      },
    },
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d727',
    time: moment().format('YYYY-MM-DD hh:mm:ss'),
    type: 'chat',
    unread: false,
    user: {
      uid: 1001,
      nickname: '李四',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    },
    msg: {
      type: 'redPacket',
      content: {
        greeting: '双喜临门！',
        state: 1,
      },
    },
  },

  {
    id: '58694a0f-3da1-471f-bd96-145571e29d728',
    time: moment().format('YYYY-MM-DD hh:mm:ss'),
    type: 'chat',
    unread: true,
    user: {
      uid: 1000,
      nickname: '张三',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    },
    msg: {
      type: 'transfer',
      content: {
        amount: 100.0,
        state: 0,
      },
    },
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d729',
    time: moment().format('YYYY-MM-DD hh:mm:ss'),
    type: 'chat',
    unread: false,
    user: {
      uid: 1000,
      nickname: '张三',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    },
    msg: {
      type: 'transfer',
      content: {
        amount: 100.0,
        state: 1,
      },
    },
  },

  {
    id: '58694a0f-3da1-471f-bd96-145571e29d730',
    time: moment().format('YYYY-MM-DD hh:mm:ss'),
    type: 'chat',
    unread: false,
    user: {
      uid: 1001,
      nickname: '李四',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    },
    msg: {
      type: 'transfer',
      content: {
        amount: 100.0,
        state: 1,
      },
    },
  },
];
