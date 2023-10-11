import {View, Text, Colors} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import {getMsgContent} from '@/utils/common';
import {MessageItem, VIDEOCALL, OWNID} from '../../demo/data';
import {shallowEqual, useSelector} from 'react-redux';

export default function ChatCall(row: any, user: any) {
  const {content, type} = row;
  //不知道为啥user传过来是空的，所以这里自己取
  const selfInfo = useSelector(
    (state: any) => state.user.selfInfo,
    shallowEqual,
  );
  const isMine = selfInfo.user_id === row.send_id;
  let callMsg: any = {};
  try {
    callMsg = JSON.parse(content.content);
  } catch (e) {
    callMsg = {};
  }
  //秒转化成 时分秒
  function secondToDate(result) {
    var h: any = Math.floor(result / 3600).toString();
    var m: any = Math.floor((result / 60) % 60).toString();
    var s: any = Math.floor(result % 60).toString();
    if (s < 10) {
      s = '0' + s;
    }
    if (m < 10) {
      m = '0' + m;
    }
    if (h < 10) {
      h = '0' + h;
    }
    if (h == 0) {
      return (result = `${m + ':'}${s}`);
    } else {
      return (result = `${h + ':'}${m + ':'}${s}`);
    }
  }
  const parseQuoteContent = () => {
    switch (callMsg.rtc_status) {
      case 1:
        return `请求通话`;
      case 2:
        return `${isMine ? '已取消' : '对方已取消'}`;
      case 3:
        return `已接听`;
      case 4:
        return `${isMine ? '已拒绝' : '对方已拒绝'}`;
      case 5:
        return `通话时长  ${secondToDate(callMsg.rtc_duration)}`;
      case 6:
        return `${isMine ? '未应答' : '对方未应答'}`;
      case 7:
        return '对方忙线中';
      case 8:
        return '通话中断';
      default:
        return '';
    }
  };

  const viewDiffStyle = isMine
    ? {
        borderTopEndRadius: 0,
        backgroundColor: '#7581FF',
      }
    : {
        backgroundColor: '#F6F7FB',
        borderTopStartRadius: 0,
      };
  const textDiffStyle = isMine
    ? {
        color: Colors.white,
      }
    : {};

  return (
    <View
      style={{
        padding: pt(12),
        borderRadius: pt(7),
        ...viewDiffStyle,
      }}>
      <Text style={{...textDiffStyle}}>{parseQuoteContent()}</Text>
    </View>
  );
}
