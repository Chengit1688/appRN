import React, {ReactNode} from 'react';
import {View, Text, ListItem, Icon, Image} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {opacity, pt} from '@/utils/dimension';

type MenuType = ['normal', 'icon', 'subLabel'];

export default function ListMenuItem({
  itemIcon,
  label,
  text,
  onPress,
  border,
  rightText,
  rightContent,
  right,
  noActiveBg,
}: {
  itemIcon?: ReactNode;
  label: string;
  text?: string;
  onPress?: () => void;
  border?: string;
  rightText?: string;
  rightContent?: ReactNode;
  right?: ReactNode;
  noActiveBg?: boolean;
}) {
  const {t} = useTranslation();

  const wrapMargin = itemIcon ? 34 : 16;
  const labelMargin = itemIcon ? 14 : 0;

  let borderStyle = {};
  switch (border) {
    case 'top':
      borderStyle = {
        borderTopWidth: pt(0.5),
        borderTopColor: opacity('#BFBFBF', 0.2),
      };
      break;
    case 'none':
      break;
    default:
      borderStyle = {
        borderBottomWidth: pt(0.5),
        borderBottomColor: opacity('#BFBFBF', 0.2),
      };
  }

  return (
    <ListItem
      activeBackgroundColor={noActiveBg ? '' : '#F8F9FF'}
      activeOpacity={1}
      minHeight={pt(60)}
      onPress={() => {
        onPress ? onPress() : null;
      }}
      style={borderStyle}>
      <ListItem.Part
        left
        containerStyle={{
          marginLeft: pt(wrapMargin),
        }}>
        {typeof itemIcon === 'string' ? (
          <Icon assetName={itemIcon} size={pt(20)} />
        ) : (
          itemIcon || null
        )}
      </ListItem.Part>

      <ListItem.Part middle row>
        <ListItem.Part
          middle
          column
          containerStyle={{
            marginLeft: pt(labelMargin),
            marginRight: pt(14),
          }}>
          <Text
            style={{
              color: '#222222',
              fontSize: pt(16),
              fontWeight: 'bold',
            }}>
            {label}
          </Text>
          {text ? (
            <Text
              style={{
                marginTop: pt(3),
                fontSize: pt(12),
                color: '#999999',
              }}>
              {text}
            </Text>
          ) : null}
        </ListItem.Part>
        <ListItem.Part
          containerStyle={{
            marginRight: pt(wrapMargin),
          }}>
          {rightText ? (
            <View
              style={{
                marginRight: pt(10),
              }}>
              <Text
                style={{
                  fontSize: pt(14),
                  color: '#999999',
                }}>
                {rightText}
              </Text>
            </View>
          ) : rightContent ? (
            <View
              style={{
                marginRight: pt(10),
              }}>
              {rightContent}
            </View>
          ) : null}
          {right ?? (
            <Image
              assetName="next"
              assetGroup="icons.app"
              style={{
                width: pt(6.5),
                height: pt(10),
              }}
            />
          )}
        </ListItem.Part>
      </ListItem.Part>
    </ListItem>
  );
}
