import React, {useEffect, useState} from 'react';
import {View, TextField} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {pt} from '@/utils/dimension';
import {Navbar} from '@/components';
import HeaderRightButton from '@/components/HeaderRight/button';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {Toast} from '@ant-design/react-native';

export default function Notice(props: any) {
  const {groupInfo} = props.route.params;
  const {t} = useTranslation();
  const [text, setText] = useState('');
  const {goBack} = useNavigation();

  useEffect(() => {
    setText(groupInfo?.notification || '');
  }, [groupInfo]);

  const updateNotice = () => {
    const updateInfo: any = {};
    if (!text) {
      updateInfo.notification = ' ';
    }
    if (text && text !== groupInfo?.notification) {
      updateInfo.notification = text;
    }
    updateGroupInfo(updateInfo);
  };

  const updateGroupInfo = (data: any) => {
    //更新群信息
    return imsdk
      .setGroupAttributes({
        group_id: groupInfo.group_id,
        attributes: {
          // ...props.info,
          ...data,
        },
      })
      .then(res => {
        imsdk.emit(IMSDK.Event.GROUP_NOTICE_UPDATE, data.notification);
        Toast.info(t('更新成功'));
        goBack();
        // closeOpen();
        // success(t('更新成功'));
        // if(props.info.notification!=data.notification){
        //     imsdk.emit(IMSDK.Event.GROUP_NOTICE_UPDATE,data.notification)
        // }
      })
      .catch(res => {});
  };

  return (
    <>
      <Navbar
        title="群公告"
        right={<HeaderRightButton onPress={updateNotice} />}
      />
      <View flex>
        <TextField
          multiline
          placeholder={t('这一刻的想法...')}
          onChangeText={e => {
            setText(e);
          }}
          style={{
            padding: pt(16),
            height: pt(400),
          }}
          value={text}
        />
      </View>
      {/* <View
        row
        centerV
        style={{
          justifyContent: 'space-around',
          height: pt(58),
          borderWidth: pt(0.5),
          borderColor: '#BFBFBF',
        }}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <Icon assetName="photo" assetGroup="page.groupchat" size={pt(24)} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <Icon assetName="file" assetGroup="page.groupchat" size={pt(24)} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <Icon
            assetName="location"
            assetGroup="page.groupchat"
            size={pt(24)}
          />
        </TouchableOpacity>
      </View> */}
    </>
  );
}
