import {useState} from 'react';
import {View, Text, Icon, Image, ListItem, Switch} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';

import ListMenuItem from '@/components/ListMenuItem';

export default function Menu({selecteds}: any) {
  const {t} = useTranslation();

  const {navigate} = useNavigation();

  return (
    <View
      style={{
        marginTop: pt(10),
        borderBottomWidth: pt(10),
        borderBottomColor: '#F7F8FC',
      }}>
      <ListMenuItem
        label={t('创建群聊')}
        onPress={() => {
          navigate('GroupChatCreate', {
            selecteds,
          });
        }}
      />
      <ListMenuItem
        label={t('面对面创建群')}
        onPress={() => {
          navigate('GroupChatCreateByCode');
        }}
        border="none"
      />
    </View>
  );
}
