import {
  View,
  Text,
  Image,
  GridList,
  TouchableOpacity,
} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {setAudioVideoObjStatus} from '@/store/reducers/global';
import {useMemo} from 'react';
import {Platform} from 'react-native';
// import {pickSingFile} from '@/utils/pickFile';
import DocumentPicker from 'react-native-document-picker';
import {sendFileMessage} from './handleUpload';
import {RootState} from '@/store';
import GlobalLoading from '@/components/Loading/globalLoading';

const DATA = [
  // {
  //   key: 'more_photo',
  //   label: '相册',
  // },
  // {
  //   key: 'more_transfer',
  //   label: '转账',
  // },
  {
    key: 'more_video',
    label: '视频通话',
  },
  {
    key: 'more_collect',
    label: '文件',
  },
  // {
  //   key: 'more_red_packet',
  //   label: '发红包',
  // },
  {
    key: 'more_card',
    label: '名片',
  },
  {
    key: 'more_phone',
    label: '语音通话',
  },
  // {
  //   key: 'more_contact',
  //   label: '联系人',
  // },
];

export default function More({
  clearType,
  user_id,
  isGroup,
}: {
  clearType?: () => void;
  user_id: string;
  isGroup: boolean;
}) {
  const dispatch = useDispatch();

  const {token, selfInfo} = useSelector(
    (state: RootState) => state.user,
    shallowEqual,
  );
  const currentConversation = useSelector<RootState, any>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );
  const List = useMemo(() => {
    if (isGroup) {
      return DATA.filter(
        item => item.key !== 'more_video' && item.key !== 'more_phone',
      );
    }
    return DATA;
  }, [isGroup]);
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const onPress = async (key: string) => {
    switch (key) {
      case 'more_red_packet':
        setTimeout(() => {
          clearType && clearType();
        }, 100);
        navigate({name: 'RedPacket'} as never);
        break;
      case 'more_phone':
        dispatch(
          setAudioVideoObjStatus({
            open: true,
            conversation_type: 1,
            type: 1, // 1 语音  2视频
            user_id: user_id,
          }),
        );
        break;
      case 'more_video':
        dispatch(
          setAudioVideoObjStatus({
            open: true,
            conversation_type: 1,
            type: 2, // 1 语音  2视频
            user_id: user_id,
          }),
        );
        break;
      case 'more_card':
        navigate('contactBusiness' as never);
        break;
      //文件
      case 'more_collect':
        //这里要区分下ios和安卓
        // if (Platform.OS === 'ios') {
        //   navigate('filesIndex' as never);
        // } else {
        // }
        try {
          const res = await DocumentPicker.pick({
            type: DocumentPicker.types.allFiles,
          });
          GlobalLoading.startLoading('正在发送文件...');
          sendFileMessage(
            res[0],
            selfInfo,
            dispatch,
            currentConversation,
            'more',
          );
          GlobalLoading.endLoading();
        } catch (error) {}
    }
  };
  return (
    <GridList
      data={List}
      renderItem={({item}) => (
        <View
          center
          style={{
            paddingTop: pt(15),
            paddingBottom: pt(15),
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              onPress(item.key);
            }}>
            <Image assetName={item.key} assetGroup="page.chat.toolbar" />
            <Text>{t(item.label)}</Text>
          </TouchableOpacity>
        </View>
      )}
      numColumns={4}
      itemSpacing={pt(0)}
      listPadding={pt(0)}
      contentContainerStyle={{
        paddingTop: pt(15),
        paddingBottom: pt(15),
      }}
    />
  );
}
