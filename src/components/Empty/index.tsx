import React from 'react';
import {Image, View, Text} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';

type EmptyProps = {
  tip?: JSX.Element | string;
};

const Empty = (props: EmptyProps) => {
  const {tip} = props;
  const {t} = useTranslation();
  return (
    <View
      flex
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image assetName="empty" assetGroup="imgs.app" />
      <Text>{tip || t('暂无数据')}</Text>
    </View>
  );
};
export default Empty;
