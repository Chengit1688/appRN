import {useEffect, useState} from 'react';
import {View, Colors} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import * as toast from '@/utils/toast';
import {Navbar} from '@/components';
import SearchInput from '@/components/SearchInput';
import ContactIndexList from '@/components/ContactIndexList';
import HeaderRightButton from '@/components/HeaderRight/button';
import {useSelector, shallowEqual} from 'react-redux';
import Menu from './block/menu';

export default function Start() {
  const {t} = useTranslation();
  const {setOptions, navigate} = useNavigation();

  const [showToast, setShowToast] = useState(false);
  const ContactList = useSelector(
    (state: any) => state.contacts.friendList,
    shallowEqual,
  );
  const [selecteds, setSelecteds] = useState<{[key: string]: boolean}>({});

  const greateGroup = () => {};

  return (
    <>
      <Navbar
        title="发起群聊"
        // right={
        //   <HeaderRightButton
        //     text={t(`完成(${Object.keys(selecteds).length})`)}
        //     onPress={() => {
        //       // TODO: 处理选择的数据
        //       if (!Object.keys(selecteds).length) {
        //         toast.error('请选择联系人');
        //         return;
        //       }
        //       navigate('GroupChat');
        //     }}
        //   />
        // }
      />
      <View flex>
        <SearchInput
          placeholder={t('搜索')}
          style={{
            margin: pt(16),
            marginBottom: 0,
          }}
        />
        <Menu selecteds={selecteds} />
        <ContactIndexList
          source={ContactList}
          selecteds={selecteds}
          onSelected={val => setSelecteds(val)}
        />
      </View>
    </>
  );
}
