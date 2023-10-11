import {Avatar, AvatarProps, Colors} from 'react-native-ui-lib';
import FastImage from 'react-native-fast-image';
import {pt} from '@/utils/dimension';
import {Image} from 'react-native';

export type Props = {
  name: string;
  avatar?: any;
  status?: string;
};

const MessageAvatar = ({name, avatar, status}: Props) => {
  const statusColor =
    status === 'online'
      ? '#51C296'
      : status === 'offline'
      ? '#A5A5A5'
      : status === 'busy'
      ? '#CF2525'
      : '';
  const badge = statusColor
    ? {
        badgePosition: 'BOTTOM_RIGHT' as AvatarProps['badgePosition'],
        badgeProps: {
          borderWidth: pt(1),
          borderColor: '#ffffff',
          backgroundColor: statusColor,
        },
      }
    : {};

  return (
    // <Image
    //   style={{
    //     width: pt(47),
    //     height: pt(47),
    //     borderRadius: pt(50),
    //     backgroundColor: Colors.grey60,
    //   }}
    //   source={avatar}
    // />
    <FastImage
      style={{
        width: pt(47),
        height: pt(47),
        borderRadius: pt(50),
        backgroundColor: Colors.grey60,
      }}
      resizeMode="cover"
      source={avatar}
    />
    // <Avatar
    //   {...{
    //     name,
    //     size: pt(47),
    //     source: avatar,
    //     useAutoColors: true,
    //     labelColor: '#ffffff',
    //     ...badge,
    //   }}
    //   onPress={() => {}}
    // />
  );
};

export default MessageAvatar;
