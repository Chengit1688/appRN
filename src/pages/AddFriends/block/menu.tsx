import {useState} from 'react';
import {View, Text, Icon, Image, ListItem, Switch} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import ListMenuItem from '@/components/ListMenuItem';

export default function Menu() {
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
        label={t('面对面发起群聊')}
        itemIcon={
          <Icon assetName="mdm" assetGroup="page.message" size={pt(32)} />
        }
        onPress={() => {
          navigate('GroupChatCreateByCode');
        }}
      />
      <ListMenuItem
        label={t('扫一扫')}
        itemIcon={
          <Icon assetName="sys" assetGroup="page.message" size={pt(32)} />
        }
        onPress={() => navigate('scanQRcode')}
        border="none"
      />
    </View>
  );
}
