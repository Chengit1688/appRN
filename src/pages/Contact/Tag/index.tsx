import {View, Colors} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import Header from '@/components/Header';
import {pt} from '@/utils/dimension';

export default function Tag() {
  const {t} = useTranslation();
  return (
    <>
      <Header />
      <View flex></View>
    </>
  );
}
