import {View, Text, Colors} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import {getMsgContent} from '@/utils/common';
import {MessageItem, VIDEOCALL, OWNID} from '../../demo/data';
import {useMemo} from 'react';

export default function ChatQuote({row, isOwn}: {row: any; isOwn: boolean}) {
  const {isMine = false, content = '', type, read_seq, seq} = row;
  const result = getMsgContent({content, type});
  const quoteMg =
    typeof result.quote_info === 'object'
      ? result.quote_info
      : JSON.parse(result.quote_info);
  const quoteContent = getMsgContent({
    content: quoteMg.content,
    type: quoteMg.type,
  });
  const text = useMemo(() => {
    return result.text;
  }, []);
  const parseQuoteContent = (quoteContent: any) => {
    const content = JSON.parse(quoteMg.content);
    switch (quoteMg.type) {
      case 1:
      case 2:
      case 9:
        if (typeof quoteContent !== 'string' && quoteContent.text) {
          // todo移除脏数据
          quoteContent = quoteContent.text;
        }
        if (quoteContent.at_info?.length) {
          quoteContent.at_info?.forEach(i => {
            quoteContent.text = quoteContent.text?.replace(
              `@${i.user_id}`,
              `@${i.group_nick_name}`,
            );
          });
        }
        return quoteContent;
      case 3:
        return '图片';
      case 4:
        return '语音';
      case 5:
        return '视频';
      case 6:
        return content.file_info.file_name;
      case 7:
        return `【个人名片】${content.card_info.nick_name}`;
      default:
        return quoteContent;
    }
  };

  const viewDiffStyle = isOwn
    ? {
        borderTopEndRadius: 0,
        backgroundColor: '#7581FF',
      }
    : {
        backgroundColor: '#F6F7FB',
        borderTopStartRadius: 0,
      };
  const textDiffStyle = isOwn
    ? {
        color: Colors.white,
      }
    : {};

  const viewMainDiffStyle: any = isOwn
    ? {
        alignItems: 'flex-end',
      }
    : {
        alignItems: 'flex-start',
      };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        ...viewMainDiffStyle,
      }}>
      <View
        style={{
          padding: pt(12),
          borderRadius: pt(7),
          ...viewDiffStyle,
        }}>
        <Text style={{...textDiffStyle}}>{text}</Text>
      </View>

      <Text
        style={{
          backgroundColor: 'rgba(0,0,0,.05)',
          color: '#888',
          padding: pt(12),
          marginTop: pt(5),
          paddingTop: pt(8),
          paddingBottom: pt(8),
          borderRadius: pt(6),
          overflow: 'hidden',
        }}>{`${quoteMg.send_nickname}:${parseQuoteContent(
        quoteContent,
      )}`}</Text>
    </View>
  );
}
