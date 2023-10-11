import React, {useEffect, useState} from 'react';
import {View, Colors} from 'react-native-ui-lib';
import {DeviceEventEmitter} from 'react-native';
import {useTranslation} from 'react-i18next';
import SearchInput from '@/components/SearchInput';
import ContactIndexList from '@/components/ContactIndexList';
import FullButton from '@/components/FullButton';
import {Navbar} from '@/components';
import {useSelector, shallowEqual} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {pt} from '@/utils/dimension';

export default function SelectContact(props: any) {
  const selectData = props.route?.params?.selectData;
  const disabledSelecteds = props.route?.params?.disabledSelecteds || {};
  const {t} = useTranslation();

  const [selecteds, setSelecteds] = useState<any>(selectData || {});
  const {goBack} = useNavigation();

  const ContactList = useSelector(
    (state: any) => state.contacts.friendList,
    shallowEqual,
  );

  const onConfirm = () => {
    const data = ContactList.filter(item => {
      return selecteds[item.user_id];
    });
    DeviceEventEmitter.emit('setUserData', {data});
    goBack();
  };

  return (
    <>
      <Navbar title="选择好友" right={<View />} />
      <View
        flex
        style={{
          backgroundColor: Colors.white,
        }}>
        <SearchInput
          placeholder={t('搜索')}
          style={{
            margin: pt(16),
            marginBottom: 0,
          }}
        />
        <ContactIndexList
          source={ContactList}
          disabledSelecteds={disabledSelecteds}
          showSelect={true}
          onSelected={e => {
            console.log(e);

            setSelecteds(e);
          }}
          selecteds={selecteds}
        />
        <FullButton text={t('确定')} onPress={onConfirm} />
      </View>
    </>
  );
}
