import React from 'react';
import {View, Colors} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import Menu from './block/menu';
import FullButton from '@/components/FullButton';

export default function Security() {
  const {t} = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}>
      <Menu />
    </View>
  );
}
