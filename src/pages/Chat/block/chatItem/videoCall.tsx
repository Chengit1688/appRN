import {View, Text, Colors} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import {MessageItem, VIDEOCALL, OWNID} from '../../demo/data';

export default function ChatVideoCall({user: {uid}, msg}: MessageItem) {
  const {message} = msg.content as VIDEOCALL;
  const viewDiffStyle =
    OWNID === uid
      ? {
          borderTopEndRadius: 0,
          backgroundColor: '#7581FF',
        }
      : {
          backgroundColor: '#F6F7FB',
          borderTopStartRadius: 0,
        };
  const textDiffStyle =
    OWNID === uid
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
      <Text style={{...textDiffStyle}}>{message}</Text>
    </View>
  );
}
