import {useEffect, useState, useMemo} from 'react';
import {View, Colors, Icon} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import HeaderMore from '@/components/HeaderRight/more';
import {pt} from '@/utils/dimension';
import {Modal, Toast} from '@ant-design/react-native';
import {Navbar, ActionSheet} from '@/components';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import Menu from './block/menu';
import FullButton from '@/components/FullButton';
import {shallowEqual, useSelector} from 'react-redux';

export default function Info(props) {
  const {navigation} = props;
  const {info} = props.route.params;
  const [userInfo, setUserInfo] = useState(info || {});
  const {t} = useTranslation();
  const [isShow, setIsShow] = useState(false);

  const selfInfo = useSelector(
    (state: any) => state.user.selfInfo,
    shallowEqual,
  );

  const init = () => {
    imsdk.getUserProfile(info.user_id).then(res => {
      setUserInfo(res);
    });
  };

  useEffect(() => {
    init();
  }, [info]);

  return (
    <>
      <Navbar title="资料设置" />
      <View flex>
        <Menu
          userInfo={userInfo}
          reload={init}
          selfInfo={selfInfo}
          setUserInfo={setUserInfo}
        />
      </View>
      <FullButton
        outline
        danger
        label={t('删除好友')}
        onPress={() => {
          Modal.alert(t('删除好友'), t('确认删除此好友？'), [
            {
              text: t('取消'),
            },
            {
              text: t('删除'),
              style: {
                color: '#F53C3C',
              },
              onPress: () => {
                // 删除会话记录
                // const user_id_1 =
                //   Number(userInfo.user_id) > Number(selfInfo.user_id)
                //     ? selfInfo.user_id
                //     : userInfo.user_id;
                // const user_id_2 =
                //   Number(userInfo.user_id) > Number(selfInfo.user_id)
                //     ? userInfo.user_id
                //     : selfInfo.user_id;
                // imsdk.deleteConversation(`${user_id_1}_${user_id_2}`);
                imsdk.deleteFriend(userInfo.user_id).then(res => {
                  Toast.info('好友已删除');
                  // navigation.goBack();
                  navigation.navigate('Contacts');
                });
              },
            },
          ]);
        }}
        style={{
          marginTop: pt(0),
        }}
      />
    </>
  );
}
