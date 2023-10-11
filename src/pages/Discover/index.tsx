import {ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '@/components/Header';
import Menu from './block/menu';

export default function Discover(props: any) {
  const {t} = useTranslation();

  return (
    <>
      <Header titleLeft title={t('发现')} />
      <ScrollView>
        <Menu navigation={props.navigation} />
      </ScrollView>
    </>
  );
}
