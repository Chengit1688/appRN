import React from 'react';
import {View} from 'react-native-ui-lib';
import type {ViewProps} from 'react-native-ui-lib';
import SvgIcon, {SvgIconType} from '@/assets/svg';

export type IconProps = {
  name: keyof SvgIconType;
  size?: number;
  style?: any;
} & ViewProps;

const Icon: React.FC<IconProps> = props => {
  const {name, style, size} = props;
  const IconComponents = SvgIcon[name];

  const extraStyle = {
    width: size || style?.width,
    height: size || style?.height,
  };

  return (
    <View
      style={{
        ...style,
        ...extraStyle,
      }}>
      {IconComponents ? <IconComponents {...extraStyle} /> : ''}
    </View>
  );
};

export default Icon;
