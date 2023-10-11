import {View, Text, Colors, Image, TouchableOpacity} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import {MessageItem, REDPACKET, OWNID} from '../../demo/data';
import {shallowEqual, useSelector} from 'react-redux';
import {Toast} from '@ant-design/react-native';

export default function ChatRedPacket({
  row,
  isOwn,
  isGroup,
  setShowRedPacket,
  groupInfo,
}: {
  row: any;
  isOwn: boolean;
  isGroup: boolean;
  setShowRedPacket: any;
  groupInfo?: any;
}) {
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const cont = JSON.parse(row.content);

  const {send_face_url, send_nickname} = row;

  const {redpack_id, redpack_group_id, remark, status, type, receive_user_id} =
    cont;
  const selfInfo = useSelector(
    (state: any) => state.user.selfInfo,
    shallowEqual,
  );

  const unreceived = status === 1;
  const received = status === 2;
  const expired = status === 3;

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
  const handleModal = () => {};

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (status === 1 && !isOwn) {
          if (type === 3 && receive_user_id === selfInfo.user_id) {
            setShowRedPacket({
              show: true,
              isGroup,
              group_id: groupInfo.group_id || '',
              redpack_id: redpack_id || redpack_group_id,
              send_face_url,
              send_nickname,
              remark,
              message: row,
            });
            return;
          } else if (type === 3 && receive_user_id !== selfInfo.user_id) {
            Toast.info('该红包仅限专属领取');
            return;
          }
          setShowRedPacket({
            show: true,
            isGroup,
            group_id: groupInfo.group_id || '',
            redpack_id: redpack_id || redpack_group_id,
            send_face_url,
            send_nickname,
            remark,
            message: row,
          });
        } else {
          navigate('RedPacketDetail', {
            redpack_id: redpack_id || redpack_group_id,
            isGroup,
            remark,
            group_id: groupInfo.group_id || '',
            send_face_url,
            send_nickname,
          });
        }
      }}>
      <View
        row
        centerV
        style={{
          padding: pt(15),
          width: pt(180),
          borderRadius: pt(7),

          ...viewDiffStyle,
          ...viewDiffStyleByReceived,
        }}>
        <Image
          assetName="red_packet"
          assetGroup="page.chat"
          style={{
            marginRight: pt(10),
            width: pt(23),
            height: pt(31),
          }}
        />
        <View>
          <Text
            numberOfLines={1}
            style={{
              fontSize: pt(13),
              fontweight: 'bold',
              color: Colors.white,
            }}>
            {remark || '恭喜发财,大吉大利'}
          </Text>
          <Text
            style={{
              fontSize: pt(12),
              color: Colors.white,
            }}>
            {isOwn
              ? received
                ? t('已被领取')
                : expired
                ? t('已过期')
                : null
              : unreceived
              ? ''
              : received
              ? t('已领取')
              : expired
              ? t('已过期')
              : null}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
