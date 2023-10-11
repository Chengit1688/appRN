import {Dispatch, SetStateAction, useState} from 'react';
import {View, TouchableOpacity, Icon, Assets} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import Voice from './voice';
import Photo from './photo';
import Camera from './camera';
import RedPacket from './redPacket';
import Emoji from './emoji';
import More from './more';
import {
  selectPhotoTapped,
  takePhotoTapped,
} from '@/components/ImagePickUpload/photoCamera';
import {ActionSheet} from '@/components';
import {sendFileMessage} from './handleUpload';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {Image, Platform} from 'react-native';

const DATA = ['voice', 'photo', 'camera', 'red_packet', 'emoji', 'more'];

interface AtInfo {
  group_nick_name: string;
  user_id: string;
}

type ComposeMessage =
  | Partial<{
      quote_info: IMSDK.Message;
      text: string;
      at_info: AtInfo[];
    }>
  | string;

export default function Toolbar({
  inputVal,
  setInputVal,
  toolType,
  setToolType,
  onViewShow,
  sendMessage,
  userInfo,
  isGroup,
  groupInfo,
  setShowVoiceModal,
  cancelRecording,
  showVoiceModal,
  setCancelRecording,
  hidekeyBoard,
}: {
  inputVal: string;
  setInputVal: Dispatch<SetStateAction<string>>;
  toolType: string;
  setToolType: Dispatch<SetStateAction<string>>;
  setShowVoiceModal?: any;
  showVoiceModal?: boolean;
  groupInfo?: any;
  onViewShow: () => void;
  userInfo: any;
  isGroup: boolean;
  setCancelRecording: Dispatch<SetStateAction<boolean>>;
  cancelRecording: boolean;
  hidekeyBoard: () => void;
  sendMessage: (
    message: ComposeMessage,
    data: string[],
    type: IMSDK.MessageType,
  ) => void;
}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {token, selfInfo} = useSelector(
    (state: RootState) => state.user,
    shallowEqual,
  );

  const currentConversation = useSelector<RootState, any>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );
  const [isShowType, setIsShow] = useState(false);
  const onPress = (type: string) => {
    hidekeyBoard();
    switch (type) {
      case 'photo':
        //打开相册
        selectPhotoTapped(false).then((res: any) => {
          for (let i = 0; i < res.length; i++) {
            setTimeout(() => {
              sendFileMessage(res[i], selfInfo, dispatch, currentConversation);
            }, i * 2000);
          }
        });
        break;
      case 'camera':
        //如果是安卓
        if (Platform.OS === 'android') {
          //显示选择拍照还是录像
          setIsShow(true);
          return;
        }
        //打开照相机
        takePhotoTapped(false).then((res: any) => {
          sendFileMessage(res[0], selfInfo, dispatch, currentConversation);
        });
        break;
    }

    setToolType(type == toolType ? '' : type);
  };

  const renderContent = (name: string) => {
    let content = null;
    switch (name) {
      case 'voice':
        content = (
          <Voice
            setShowVoiceModal={setShowVoiceModal}
            cancelRecording={cancelRecording}
            showVoiceModal={showVoiceModal}
            setCancelRecording={setCancelRecording}
          />
        );
        break;
      // case 'photo':
      //   setToolType('');
      //   content = <Photo />;
      //   break;
      // case 'camera':
      //   setToolType('');
      //   content = <Camera />;
      //   break;
      case 'red_packet':
        setTimeout(() => setToolType(''), 100);
        content = (
          <RedPacket
            userInfo={userInfo}
            isGroup={isGroup}
            groupInfo={groupInfo || {}}
          />
        );
        break;
      case 'emoji':
        content = <Emoji inputVal={inputVal} setInputVal={setInputVal} />;
        break;
      case 'more':
        content = (
          <More
            clearType={() => {
              setToolType('');
            }}
            user_id={userInfo?.user_id}
            isGroup={isGroup}
          />
        );
        break;
    }

    if (content) {
      onViewShow();
    }

    return content;
  };

  return (
    <View>
      <View
        row
        spread
        style={{
          padding: pt(16),
          paddingTop: pt(10),
          paddingBottom: pt(10),
        }}>
        {DATA.map((item, idx) => {
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={1}
              onPress={() => onPress(item)}>
              <Icon
                assetName={toolType == item ? item + '_active' : item}
                assetGroup="page.chat.toolbar"
                size={pt(24)}
              />
              {/* <Image source={Assets.page.chat.toolbar[item]}></Image> */}
            </TouchableOpacity>
          );
        })}
      </View>
      <View>{renderContent(toolType)}</View>
      <ActionSheet
        isShow={isShowType}
        onCancel={() => setIsShow(false)}
        buttons={[
          {
            label: t('拍照'),
            onClick: () => {
              setIsShow(false);
              takePhotoTapped(false, {
                mediaType: 'photo',
              }).then((res: any) => {
                sendFileMessage(
                  res[0],
                  selfInfo,
                  dispatch,
                  currentConversation,
                );
              });
            },
          },
          {
            label: t('录像'),
            onClick: () => {
              setIsShow(false);
              takePhotoTapped(false, {
                mediaType: 'video',
              }).then((res: any) => {
                sendFileMessage(
                  res[0],
                  selfInfo,
                  dispatch,
                  currentConversation,
                );
              });
            },
          },
        ]}
      />
    </View>
  );
}
