import React from 'react';
import {View, Colors} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import Menu from './block/menu';

export default function UserPrivacy() {
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
