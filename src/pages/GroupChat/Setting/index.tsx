import React from 'react';
import {View, Colors} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';

import FullButton from '@/components/FullButton';
import Header from '@/components/Header';

export default function Setting() {
  const {t} = useTranslation();

  return (
    <>
      <Header />
      <View flex>
        <FullButton outline text={t('退出账号')} onPress={() => {}} />
      </View>
    </>
  );
}
