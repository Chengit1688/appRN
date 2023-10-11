import React, {ReactNode} from 'react';
import {StyleProp, ViewStyle, Animated} from 'react-native';
import {
  View,
  Text,
  ListItem,
  RadioButton,
  Avatar,
  Colors,
  Assets,
} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import FastImage from 'react-native-fast-image';
import {formatUrl} from '@/utils/common';

type contactType = {
  name: string;
  avatar: string;
  user_id: string;
};
type selectedType = {
  [key: string]: boolean;
};

const ContactItem = ({
  showRadio,
  selecteds,
  onLongPress,
  contact,
  onPress,
  onItemPress,
}: {
  showRadio?: boolean;
  selecteds?: selectedType;
  contact: contactType;
  onPress?: (e?: any) => void;
  onLongPress?: (e?: any) => void;
  onItemPress?: (contact: contactType) => void;
}) => {
  const nickName = contact.name;
  const avatar = contact.avatar
    ? {uri: formatUrl(contact.avatar), cache: FastImage.cacheControl.web}
    : Assets.imgs.avatar.defalut;

  return (
    <View>
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(60)}
        onLongPress={() => {
          onLongPress?.(contact);
        }}
        onPress={() => {
          showRadio
            ? onItemPress && onItemPress(contact)
            : onPress
            ? onPress()
            : null;
        }}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          {showRadio ? (
            <View
              style={{
                marginLeft: pt(-10),
                marginRight: pt(12),
              }}>
              <RadioButton
                selected={selecteds && selecteds[contact.user_id]}
                onPress={() => {
                  onItemPress && onItemPress(contact);
                }}
                label={''}
                size={20}
                color={
                  selecteds && selecteds[contact.user_id]
                    ? '#7581FE'
                    : '#BCBCBC'
                }
              />
            </View>
          ) : null}
          <FastImage
            style={{
              width: pt(40),
              height: pt(40),
              borderRadius: pt(20),
              backgroundColor: Colors.grey60,
            }}
            resizeMode="cover"
            source={avatar}
          />
          {/* <Avatar
            {...{
              name: nickName,
              size: pt(40),
              source: {
                uri: avatar,
              },
            }}
          /> */}
        </ListItem.Part>
        <ListItem.Part
          containerStyle={{
            // height: pt(70),
            marginLeft: pt(15.5),
            marginRight: pt(15.5),
          }}>
          <Text
            style={{
              color: '#222222',
              fontSize: pt(14),
              fontWeight: 'bold',
            }}>
            {nickName}
          </Text>
        </ListItem.Part>
      </ListItem>
    </View>
  );
};

export default ContactItem;
