import {View, Text, Colors, Image} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {MessageItem, TRANSFER, OWNID} from '../../demo/data';

export default function ChatTransfer({
  user: {uid},
  msg: {content},
  unread,
}: MessageItem) {
  const {t} = useTranslation();

  const {amount, state} = content as TRANSFER;
  const isOwn = OWNID === uid;
  const unreceived = state === 0;
  const received = state === 1;
  const expired = state === 2;

  const viewDiffStyle = isOwn
    ? {
        borderTopEndRadius: 0,
      }
    : {
        borderTopStartRadius: 0,
      };
  const viewDiffStyleByReceived = unreceived
    ? {
        backgroundColor: '#F99F3E',
      }
    : {
        backgroundColor: '#FFBF7B',
      };

  return (
    <View
      row
      style={{
        padding: pt(15),
        width: pt(180),
        borderRadius: pt(7),
        ...viewDiffStyle,
        ...viewDiffStyleByReceived,
      }}>
      <Image
        assetName="transfer"
        assetGroup="page.chat"
        style={{
          marginRight: pt(10),
          width: pt(23),
          height: pt(31),
        }}
      />
      <View>
        <Text
          style={{
            fontSize: pt(15),
            color: Colors.white,
          }}>
          ￥{amount}
        </Text>

        <Text
          style={{
            fontSize: pt(12),
            color: Colors.white,
          }}>
          {isOwn
            ? received
              ? t('已被接收')
              : expired
              ? t('已过期')
              : t('你发起一笔转账')
            : unreceived
            ? t('请收款')
            : received
            ? t('已收款')
            : t('已过期')}
        </Text>
      </View>
    </View>
  );
}
