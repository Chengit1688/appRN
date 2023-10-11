import {View} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';

import SearchInput from '@/components/SearchInput';
import ContactIndexList from '@/components/ContactIndexList';
import FullButton from '@/components/FullButton';
import Header from '@/components/Header';

export default function InviteContact() {
  const {t} = useTranslation();

  return (
    <>
      <Header />
      <View flex>
        <SearchInput
          placeholder={t('搜索')}
          style={{
            margin: pt(16),
            marginBottom: 0,
          }}
        />
        <ContactIndexList />
        <FullButton text={t('立即邀请')} onPress={() => {}} />
      </View>
    </>
  );
}
