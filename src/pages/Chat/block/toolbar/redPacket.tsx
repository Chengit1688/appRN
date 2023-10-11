import {useEffect} from 'react';
import {View} from 'react-native-ui-lib';
import {useNavigation} from '@react-navigation/native';

export const showRedPacket = () => {};

export default function RedPacket({userInfo, isGroup, groupInfo}: any) {
  const {navigate} = useNavigation();
  useEffect(() => {
    if (isGroup) {
      navigate({
        name: 'GroupRedPacket',
        params: {
          group_id: groupInfo.group_id,
        },
      } as never);
      return;
    }
    navigate({
      name: 'RedPacket',
      params: {
        recv_id: userInfo.user_id,
      },
    } as never);
  }, []);
  return null;
}
