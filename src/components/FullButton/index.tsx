import React, {ReactNode} from 'react';
import {StyleProp, ViewStyle, Animated} from 'react-native';
import {View, Text, TouchableOpacity, Colors, Icon} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';

const FullButton = ({
  text,
  label,
  onPress,
  primary,
  outline,
  danger,
  style,
  icon,
  disabled = false,
}: {
  text?: string;
  label?: string; // 替代text
  onPress: () => void;
  primary?: boolean;
  outline?: boolean;
  danger?: boolean;
  style?: ViewStyle;
  icon?: ReactNode | string;
  disabled?: boolean;
}) => {
  let _style: StyleProp<ViewStyle | Animated.AnimatedProps<ViewStyle>> = {
    opacity: disabled ? 0.5 : 1,
  };

  if (outline) {
    _style = {
      marginLeft: pt(16),
      marginRight: pt(16),
      marginTop: pt(24),
      marginBottom: pt(24),
      height: pt(50),
      borderRadius: pt(8),
      borderWidth: pt(1),
      borderColor: '#7581FF',
    };
    if (danger) {
      _style = {
        ..._style,
        ...{
          borderColor: '#F53C3C',
        },
      };
    }
    if (style) {
      _style = {..._style, ...style};
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (disabled) {
            return;
          }
          onPress?.();
        }}>
        <View row center style={_style}>
          <View
            style={{
              marginRight: pt(5),
            }}>
            {typeof icon === 'string' ? (
              <Icon
                style={{marginRight: pt(10)}}
                size={pt(20)}
                assetName={icon}
                assetGroup="icons.app"
              />
            ) : (
              icon
            )}
          </View>
          <Text
            style={{
              fontSize: pt(16),
              fontWeight: 'bold',
              color: danger ? '#F53C3C' : '#7581FF',
            }}>
            {label ?? text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  _style = {
    ..._style,
    marginLeft: pt(16),
    marginRight: pt(16),
    marginTop: pt(24),
    marginBottom: pt(24),
    height: pt(50),
    borderRadius: pt(8),
    backgroundColor: '#7581FF',
  };
  if (danger) {
    _style = {
      ..._style,
      ...{
        backgroundColor: '#F53C3C',
      },
    };
  }
  if (style) {
    _style = {..._style, ...style};
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View row center style={_style}>
        <View
          style={{
            marginRight: pt(5),
          }}>
          {typeof icon === 'string' ? (
            <Icon
              style={{marginRight: pt(10)}}
              size={pt(20)}
              assetName={icon}
              assetGroup="icons.app"
            />
          ) : (
            icon
          )}
        </View>
        <Text
          style={{
            fontSize: pt(16),
            fontWeight: 'bold',
            color: Colors.white,
          }}>
          {label ?? text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FullButton;
