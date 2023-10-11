import React from 'react';
import {Icon, View} from 'react-native-ui-lib';
import {opacity, pt} from '@/utils/dimension';

export default function Avatar({
  size,
  bgColor,
  iconSize,
  assetName,
  assetGroup,
}: {
  size: number;
  bgColor?: string;
  iconSize: number;
  assetName: string;
  assetGroup: string;
}) {
  return (
    <View
      center
      style={{
        width: size,
        height: size,
        borderRadius: pt(50),
        backgroundColor: bgColor ?? opacity('#7581FF', 0.1),
      }}>
      <Icon size={iconSize} assetName={assetName} assetGroup={assetGroup} />
    </View>
  );
}
