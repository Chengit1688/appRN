import React from 'react';
import {View, Colors} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import Menu from './block/menu';
import FullButton from '@/components/FullButton';

const UserProfile = () => {
  const {t} = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}>
      <Menu />
      <FullButton text={t('确定')} onPress={() => {}} />
    </View>
  );
};

export default UserProfile;
