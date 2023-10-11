import React, {useState, useEffect} from 'react';
import {View, Colors} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import Menu from './block/menu';
import FullButton from '@/components/FullButton';
import {Toast} from '@ant-design/react-native';
import imsdk from '@/utils/IMSDK';
import {getUserInfo} from '@/store/actions';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';

export default function UserProfile() {
  const {t} = useTranslation();
  const [userInfo, setUserInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const selfInfo = useSelector(
    (state: RootState) => state.user.selfInfo,
    shallowEqual,
  );

  useEffect(() => {
    setUserInfo(selfInfo || {});
  }, [selfInfo]);

  const updateInfo = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    imsdk
      .updateMyProfile({
        ...userInfo,
      })
      .then(info => {
        Toast.info('保存成功');
        setLoading(false);
        dispatch(getUserInfo());
      })
      .catch(ret => {
        setLoading(false);
      });
  };

  return (
    <>
      <View flex>
        <Menu userInfo={userInfo} setUserInfo={setUserInfo} />
        <FullButton text={t('确定')} onPress={updateInfo} />
      </View>
    </>
  );
}
