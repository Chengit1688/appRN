import {useEffect, useState, useMemo} from 'react';
import {View, Text, TouchableOpacity, Icon} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {useSelector, shallowEqual} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {pt} from '@/utils/dimension';
import {Navbar} from '@/components';
import SearchInput from '@/components/SearchInput';
import ContactIndexList from '@/components/ContactIndexList';
import Cards from './block/cards';
import Menu from './block/menu';
import store from '@/store';

export default function Contacts() {
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const [searchKey, setSearchKey] = useState('');

  const ContactList = useSelector((state: any) => state.contacts.friendList, shallowEqual,);
  const selfInfo = useSelector((state: any) => state.user.selfInfo, shallowEqual,);

  const pureList = useMemo(() => {
	const list = ContactList.filter(item => {
		return item.user_id != selfInfo.user_id;
    });
	return list;
  }, [ContactList])

  const list = useMemo(() => {
    if (searchKey.length) {
      const list = pureList.filter(item => {
        const name = item.nick_name;
        return name.toLowerCase().includes(searchKey.toLowerCase());
      });
      return list;
    } else {
      return pureList;
    }
  }, [pureList, searchKey]);
  
  return (
    <>
      <Navbar
        left={
          <Text
            style={{
              fontSize: pt(18),
              color: '#222222',
              marginLeft: pt(16),
              fontWeight: 500,
            }}>
            联系人
          </Text>
        }
        right={
          <TouchableOpacity
            onPress={() => {
              navigate('AddFriends');
            }}>
            <Icon
              size={pt(18)}
              assetName="addFriend"
              assetGroup="page.contact"
            />
          </TouchableOpacity>
        }
        back={false}
      />
      <View flex>
        <SearchInput
          placeholder={t('搜索联系人')}
          style={{
            margin: pt(16),
            marginBottom: 0,
          }}
          onChange={(keyword: string) => {
            setSearchKey(keyword);
          }}
        />
        <Cards
          onPress={{
            newfriend: () => {
              //navigation.navigate('InviteContact');
            },
            tag: () => {},
            blacklist: () => {},
          }}
        />
        <Menu />
        <ContactIndexList
          source={list}
          onPress={(_, info) => {
            navigate('ContactInfo', {info});
          }}
        />
      </View>
    </>
  );
}
