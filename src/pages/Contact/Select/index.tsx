import {useState} from 'react';
import {View} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {pt} from '@/utils/dimension';
import * as toast from '@/utils/toast';

import Header from '@/components/Header';
import HeaderRightButton from '@/components/HeaderRight/button';
import SearchInput from '@/components/SearchInput';
import ContactIndexList from '@/components/ContactIndexList';

export default function Select() {
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const [selecteds, setSelecteds] = useState<{[key: string]: boolean}>({});

  return (
    <>
      <Header
        right={(selecteds => {
          const len = Object.keys(selecteds).length;

          return (
            <HeaderRightButton
              text={t(`完成(${len})`)}
              onPress={() => {
                // TODO: 处理选择的数据
                if (!len) {
                  toast.error('请选择联系人');
                  return;
                }
                navigate('GroupChatInfo');
              }}
            />
          );
        })(selecteds)}
      />
      <View flex>
        <SearchInput
          placeholder={t('搜索')}
          style={{
            margin: pt(16),
            marginBottom: 0,
          }}
        />
        <ContactIndexList
          selecteds={selecteds}
          onSelected={val => setSelecteds(val)}
        />
      </View>
    </>
  );
}
