import {View, Text} from 'react-native';
import React from 'react';
import {LoaderScreen} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import {useTranslation} from 'react-i18next';

export default function LoadFooter({
  loading = false,
  isEnd = false,
}: {
  loading: boolean;
  isEnd: boolean;
}) {
  const {t} = useTranslation();
  return (
    <>
      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <LoaderScreen
            messageStyle={{fontSize: pt(13)}}
            size={30}
            message={'加载中...'}
            color={'#000'}
          />
        </View>
      ) : isEnd ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: pt(20),
            marginTop: pt(10),
          }}>
          <Text style={{fontSize: pt(13), color: '#000'}}>
            {t('暂无更多内容')}
          </Text>
        </View>
      ) : null}
    </>
  );
}
