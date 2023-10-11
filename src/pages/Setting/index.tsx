import React, {useState} from 'react';
import {View, Colors} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import FullButton from '@/components/FullButton';
import {ConfirmModal, Navbar} from '@/components';
import {setFriendList, setGroupList, setUserToken} from '@/store/actions';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {AppDispatch} from '@/store';
import Menu from './block/menu';
import {updateConversationList} from '@/store/reducers/conversation';
import imsdk from '@/utils/IMSDK';

export default function Setting() {
  const {t} = useTranslation();
  const [visible, setVisible] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const {navigate} = useNavigation();

  return (
    <>
      <Navbar title="设置" />
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
        }}>
        <Menu />
        <FullButton
          outline
          text={t('退出账号')}
          onPress={() => {
            setVisible(true);
          }}
        />
        <ConfirmModal
          title={t('退出账号')}
          content={t('确定退出账号吗?')}
          showClose
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          onConfirm={() => {
            setVisible(false);
            dispatch(setUserToken(''));
            dispatch(updateConversationList([]));
            dispatch(setGroupList([]));
            dispatch(setFriendList([]));
            //重置本地数据库
            imsdk.logout();
            imsdk.comlink.close();

            // navigate({name: 'login'} as never);
          }}
        />
      </View>
    </>
  );
}
