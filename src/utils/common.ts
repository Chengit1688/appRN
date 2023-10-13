import {pinyin} from 'pinyin-pro';
import {IMSDK} from './IMSDK';
import store from '../store';
import dayjs from 'dayjs';
export const pySegSort = (arr: any[]) => {
  if (arr.length == 0) return;
  if (!String.prototype.localeCompare) return null;
  var letters = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var pattern = new RegExp(
    "[`\\-~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？12345678990]|(\ud83c[\udf00-\udfff])|(\uD83D[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]",
  ); //特殊符号
  var lettersArray = letters.map(item => {
    return {
      initial: item,
      data: [],
    };
  });

  function truncated(str, num) {
    let index =
      Array.from(str)[num - 1].codePointAt(0) > 0xffff ? num + 1 : num;
    return str.slice(0, index);
  }

  arr.forEach((v, index) => {
    if (!v.nick_name) return;
    // 特殊字符
    if (pattern.test(truncated(v?.nick_name, 1))) {
      //@ts-ignore
      lettersArray[0].data.push(v);
      return;
    }

    const findIndex = lettersArray.findIndex(
      item => item.initial === v?.nick_name[0].toUpperCase(),
    );
    if (findIndex !== -1) {
      //@ts-ignore
      lettersArray[findIndex].data.push(v);
      return;
    }
    const py = pinyin(v?.nick_name, {pattern: 'first', toneType: 'none'});
    const findIndexZh = lettersArray.findIndex(
      item => item.initial === py[0].toUpperCase(),
    );
    if (findIndexZh !== -1) {
      //@ts-ignore
      lettersArray[findIndexZh].data.push(v);
    }
  });

  lettersArray = lettersArray.map(item => {
    item.data = item.data.sort((v: any, v1: any) => {
      return v?.userID - v1?.userID;
    });
    return item;
  });
  return lettersArray.filter(item => {
    return item.data.length > 0;
  });
};

export const downloadFile = (path, name) => {
  // 将 \ 转换为 /
  let _path = path.replace(/\\/g, '/');

  //获取文件的内容
  let xhr = new XMLHttpRequest();
  xhr.open('get', _path);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    if (this.status === 200 || this.status === 304) {
      // 将文件的内容转换为 URL
      let url = URL.createObjectURL(this.response);
      //使用 a 标签下载文件
      let aLink = document.createElement('a');
      aLink.style.display = 'none';
      aLink.href = url;
      //设置下载文件名
      let _urlName = _path.substring(_path.lastIndexOf('/') + 1);
      _urlName && (_urlName = _urlName.split('?')[0]);
      aLink.download = name || _urlName || 'undefined';

      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
      URL.revokeObjectURL(url);
    }
  };
  xhr.send();
};

export const copyTextToClipboard = async (text: string) => {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
};

export const handleScroll = () => {
  let res =
    this.myRef.scrollHeight - this.myRef.clientHeight - this.myRef.scrollTop;
  //>0 || >1
  if (res > 1) {
    //未到底
  } else {
    //已到底部
    this.loadMoreDataFn();
  }
};

export const getMsgContent = (msg: Pick<IMSDK.Message, 'content' | 'type'>) => {
  try {
    if (!msg) return;
    const content = JSON.parse(
      msg.content as unknown as string,
    ) as IMSDK.Message['content'];
    switch (msg.type) {
      case 1:
      case 2:
        if (content.at_info?.length) {
          content.at_info?.forEach(i => {
            content.text = content.text?.replace(
              `@${i.user_id}`,
              `@${i.group_nick_name}`,
            );
          });
        }
        return content.text;
      case 3:
        return formatUrl(content.image_info.image_url);
      // return '[图片]'
      case 4:
        return formatUrl(content.audio_info.file_url);
      // return '[语音]'
      case 5:
        return formatUrl(content.video_info.file_url);
      // return '[视频]'
      case 6:
        return content.file_info;
      // return '[文件]'
      case 9:
        let {text} = content;
        if (content?.at_info?.length) {
          content.at_info.map(i => {
            text = text.replace(`@${i.user_id}`, `@${i.group_nick_name}`);
          });
        }
        return {
          quote_info: content.quote_info,
          text,
        };
      // return '引用'
      case 10:
        return content.text;
      case 400:
        return content.content;
      default:
        return JSON.stringify(content);
    }
  } catch (e) {
    return JSON.stringify(e);
  }
};

export const parseContent = data => {
  if (!data) return;
  let content = data?.content;
  const user_id = store.getState().user.selfInfo.user_id;
  let cnt, operator_nickname, be_operator_list, operator_id, send_id;
  try {
    cnt = JSON.parse(data.content);
    operator_id = cnt.operator_id;
    send_id = data.send_id;
    operator_nickname = cnt.operator_nickname;
    be_operator_list = cnt.be_operator_list;
  } catch (e) {}
  data.be_operator_list = be_operator_list;
  switch (data.type) {
    case IMSDK.MessageType.REVOKE:
      if (!data.send_id) {
        data.send_id = send_id || operator_id;
      }
      const friendList = store.getState().contacts.friendList;
      const friendId = send_id || operator_id;
      let temp = friendList.filter(item => item.user_id === friendId);
      let nick_name = operator_nickname || '';
      if (user_id === operator_id) {
        nick_name = '你';
      } else if (temp.length > 0) {
        nick_name = temp[0].remark || operator_nickname;
      }
      content = `${nick_name}撤回了一条消息`;
      break;
    case IMSDK.MessageType.DELETE:
      if (!operator_id) {
        content = '管理员删除了一条信息';
      }
      break;
    case IMSDK.MessageType.FRIEND_ADD_NOTIFY:
      content = '我们已经成为好友了，可以开始聊天啦';
      break;
    case IMSDK.MessageType.GROUP_CREATE_NOTIFY:
      content = '已成功创建群聊${groupName}，快邀请好友进来吧';
      break;
    case IMSDK.MessageType.GROUP_ADD_MEMBER_NOTIFY:
      if (!data.send_id) {
        data.send_id = operator_id;
      }
      content = '';
      const members = be_operator_list.map(i => i.be_operator_nickname);
      content = members.join(',') + '通过邀请加入群聊';
      break;
    case IMSDK.MessageType.GROUP_SET_ADMIN_NOTIFY:
      content = be_operator_list[0]?.be_operator_nickname + '已被设置为管理员';
      break;
    case IMSDK.MessageType.GROUP_UNSET_ADMIN_NOTIFY:
      content = be_operator_list[0]?.be_operator_nickname + '已被取消管理员';
      break;
    case IMSDK.MessageType.GROUP_ONE_MUTE_NOTIFY:
      const time_type = cnt?.time_type;
      data.time_type = time_type;
      let str = '禁言1小时';
      if (Number(time_type) === 2) {
        str = '禁言24小时';
      } else if (Number(time_type) === 3) {
        str = '永久禁言';
      }
      content = be_operator_list[0]?.be_operator_nickname + '被' + str;
      break;
    case IMSDK.MessageType.GROUP_ONE_UNMUTE_NOTIFY:
      content = be_operator_list[0]?.be_operator_nickname + '已解除禁言';
      break;
    case IMSDK.MessageType.GROUP_ALL_MUTE_NOTIFY:
      content = '已开启全体禁言';
      break;
    case IMSDK.MessageType.GROUP_ALL_UNMUTE_NOTIFY:
      content = '已取消全体禁言';
      break;
    case IMSDK.MessageType.GROUP_DELETE_NOTIFY:
      const members1 = be_operator_list
        .slice(0, 2)
        .map(i => i.be_operator_nickname);
      content =
        members1.join(',') +
        `${be_operator_list.length > 2 ? '等' : ''}已退出群聊`;
      break;
    case IMSDK.MessageType.GROUP_TRANSFER_NOTIFY:
      content =
        '该群已转让，新的群主是' + be_operator_list[0]?.be_operator_nickname;
      break;
    default:
      break;
  }
  return content;
};

/**
 * 将311群公告的content转换为文本消息
 * @param {Object} 转换的content
 */
export const transfer311ToText = data => {
  const {operator_id, content, operator_nickname} = JSON.parse(data.content);
  data.send_id = operator_id;
  data.send_nickname = operator_nickname;
  data.type = 1;
  data.content = JSON.stringify({
    at_info: [{group_nick_name: '所有人', user_id: 'all'}],
    text: `@all ${content}`,
  });
  return data;
};

/**
 * 格式化文件大小, 输出成带单位的字符串
 * @param {Number} size 文件大小
 * @param {Number} [pointLength=2] 精确到的小数点数。
 * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] 单位数组。从字节，到千字节，一直往上指定。
 *    如果单位数组里面只指定了到了K(千字节)，同时文件大小大于M, 此方法的输出将还是显示成多少K.
 */
export const formatSize = function (size, pointLength, units) {
  if (!size) {
    return '0';
  }

  var initsize = size;

  var unit;
  units = units.concat() || ['B', 'K', 'M', 'G', 'TB'];
  while ((unit = units.shift()) && size > 1024) {
    size = size / 1024;
  }
  return (
    /*initsize + "_" + */ (unit === 'B'
      ? size
      : size.toFixed(pointLength === undefined ? 2 : pointLength)) + unit
  );
};

/**
 * 格式化文件大小, 输出成带单位的字符串，譬如2K、3M等
 */
export const formatSize1 = function (size) {
  return formatSize(size, 2, ['B', 'K', 'M', 'G', 'TB']);
};

export const getPicInfo = (file: Blob): Promise<HTMLImageElement> => {
  throw new Error('only web -----------');
  return new Promise((resolve, reject) => {
    const _URL = window.URL || window.webkitURL;
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.src = _URL.createObjectURL(file);
  });
};

export const parseTime = time => {
  const todayStart = dayjs().startOf('date').unix() * 1000;
  const yesterday = dayjs().subtract(1, 'days');
  const yesterdayStart = yesterday.startOf('date').unix() * 1000;
  const firstDayOfYear = dayjs().startOf('year').unix() * 1000;
  if (time) {
    if (time >= todayStart) {
      time = dayjs(time).format('HH:mm');
    } else if (time >= yesterdayStart && time < todayStart) {
      time = '昨天';
    } else if (time >= firstDayOfYear && time < yesterdayStart) {
      time = dayjs(time).format('MM/DD');
    } else {
      time = dayjs(time).format('YYYY/MM/DD');
    }
  }
  return time;
};

export const formatUrl = url => {
  if (!url) return url;
  const domain = global.minio;
  if (
    url.startsWith('http') ||
    url.startsWith('blob') ||
    url.startsWith('data:image/png;base64,')
  )
    return url;
  return domain + url;
};

/**
 * 时间格式化
 * @param time
 * @returns
 */
export function formatTime(time: any) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d: any = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else {
    return Math.ceil(diff / 3600 / 24) + '天前';
  }
}

//检测是视频还是图片
export const checkIsImgType = (file: any) => {
  if (
    !/\.('bmp|jpg|jpeg|png|tif|gif|pcx|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|ai|raw|wmf|webp|avif|apng')$/.test(
      file?.toLocaleLowerCase(),
    )
  ) {
    return false;
  } else {
    return true;
  }
};

export const checkIsVideoType = (file: any) => {
  if (
    !/\.(wmv|asf|asx|rm|rmvb|mp4|3gp|mov|m4v|avi|dat|mkv|flv|vob)$/.test(
      file?.toLocaleLowerCase(),
    )
  ) {
    return false;
  } else {
    return true;
  }
};

//调用相册
export const chooseImage = (type: any) => {};

export const isUrl = (url: string) => {
  const strRegex =
    '^((https|http|ftp)://)?' + //(https或http或ftp):// 可有可无
    "(([\\w_!~*'()\\.&=+$%-]+: )?[\\w_!~*'()\\.&=+$%-]+@)?" + //ftp的user@ 可有可无
    '(([0-9]{1,3}\\.){3}[0-9]{1,3}' + // IP形式的URL- 3位数字.3位数字.3位数字.3位数字
    '|' + // 允许IP和DOMAIN（域名）
    '(localhost)|' + //匹配localhost
    "([\\w_!~*'()-]+\\.)*" + // 域名- 至少一个[英文或数字_!~*\'()-]加上.
    '\\w+\\.' + // 一级域名 -英文或数字 加上.
    '[a-zA-Z]{1,6})' + // 顶级域名- 1-6位英文
    '(:[0-9]{1,5})?' + // 端口- :80 ,1-5位数字
    '((/?)|' + // url无参数结尾 - 斜杆或这没有
    "(/[\\w_!~*'()\\.;?:@&=+$,%#-]+)+/?)$"; //请求参数结尾- 英文或数字和[]内的各种字符
  const re = new RegExp(strRegex, 'i'); // 大小写不敏感
  if (re.test(encodeURI(url))) {
    return true;
  }
  return false;
};

export const getConvMsgContent = msg => {
  try {
    if (!msg) return;
    const content = JSON.parse(msg.content);

    // console.log(content, msg.content, 'content=====>');
    switch (msg.type) {
      case 1:
      case 2:
      case 9:
      case 10:
        if (typeof content.text !== 'string') {
          // todo移除脏数据
          return '';
        }
        if (content.at_info?.length) {
          content.at_info?.forEach(i => {
            content.text = content.text?.replace(
              `@${i.user_id}`,
              `@${i.group_nick_name}`,
            );
          });
        }
        return content.text;
      case 3:
        return '[图片]';
      case 4:
        return '[语音]';
      case 5:
        return '[视频]';
      case 6:
        return '[文件]';
      case 7:
        return '[名片]';
      case 11:
        return '[红包]';

      default:
        return JSON.stringify(content);
    }
  } catch (e) {
    return JSON.stringify(e);
  }
};


// 字符串转base64
export const encode = (str) => {
  const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out; let i; let
    len;
  let c1; let c2; let
    c3;
  len = str.length;
  i = 0;
  out = '';
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += '==';
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += base64EncodeChars.charAt((c2 & 0xF) << 2);
      out += '=';
      break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3F);
  }
  return out;
};

export const decode = (input) => {
  const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let chr1; let chr2; let
    chr3 = '';
  let enc1; let enc2; let enc3; let
    enc4 = '';
  let i = 0;

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  const base64test = /[^A-Za-z0-9\+\/\=]/g;
  if (base64test.exec(input)) {
    throw new Error('There were invalid base64 characters in the input text.\n'
        + "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n"
        + 'Expect errors in decoding.');
  }
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output += String.fromCharCode(chr1);

    if (enc3 != 64) {
      output += String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output += String.fromCharCode(chr3);
    }

    chr1 = chr2 = chr3 = '';
    enc1 = enc2 = enc3 = enc4 = '';
  } while (i < input.length);

  return output;
};

