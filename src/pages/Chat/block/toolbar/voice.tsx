import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import {View, Text, Image, Toast} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';

import {handleUpload} from '@/components/ImagePickUpload';

import {useEffect, useRef, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import uuid from 'react-native-uuid';
import moment from 'moment';
import * as toast from '@/utils/toast';
import modalPermission from '@/utils/modalPermission';
import {insertCurrentMessageList} from '@/store/reducers/conversation';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import type {
  AudioSet,
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';

import RNFetchBlob from 'rn-fetch-blob';
import {checkRecordAudio} from '@/utils/permission';
import GlobalLoading from '@/components/Loading/globalLoading';
import Modal from '@/components/Modal';
import {upload} from '@/api/user';

export default function Voice({
  setShowVoiceModal,
  showVoiceModal,
  setCancelRecording,
  cancelRecording,
}: {
  setShowVoiceModal: any;
  cancelRecording: boolean;
  showVoiceModal: any;
  setCancelRecording: any;
}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [permission, setPermission] = useState(true);
  const {token, selfInfo} = useSelector(
    (state: RootState) => state.user,
    shallowEqual,
  );
  const currentConversation = useSelector<RootState, any>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );
  const dirs = RNFetchBlob.fs.dirs;

  // const uri = Platform.select({
  //   ios: 'https://firebasestorage.googleapis.com/v0/b/cooni-ebee8.appspot.com/o/test-audio.mp3?alt=media&token=d05a2150-2e52-4a2e-9c8c-d906450be20b',
  //   android: `${dirs.CacheDir}/hello.mp3`,
  // });
  let time: any;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => {
      return true;
    },
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      time = setTimeout(() => {
        // 手势被识别为长按

        // 按下时启用录音
        handleStartAudio();
      }, 500); // 设置长按的时间阈值（以毫秒为单位）
    },

    onPanResponderMove: (evt, gestureState) => {
      // 计算垂直移动的距离
      const verticalDistance = gestureState.dy;

      if (!cancelRecording && showVoiceModal && verticalDistance < -20) {
        // 如果垂直移动距离小于-20，表示上滑，启用取消发送
        setCancelRecording(true);
      }
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: async () => {
      // 用户释放手指时根据 cancelRecording 的状态来执行相应操作
      clearTimeout(time); // 清除定时器
      if (showVoiceModal) {
        if (cancelRecording) {
          // 取消发送
          // 在这里可以添加取消录音或其他操作的逻辑

          setShowVoiceModal(false);
          await audioRecorderPlayer?.stopRecorder();
          audioRecorderPlayer?.removeRecordBackListener();

          setState(prev => ({...prev, recordSecs: 0}));
        } else {
          // 正常操作
          // 在这里可以添加正常录音或其他操作的逻辑
          // console.log('正常操作');
          handleStopAudio();
          setShowVoiceModal(false);
        }
      }
      // 重置 cancelRecording 状态
      setCancelRecording(false);
    },
  });
  const [state, setState] = useState({
    recordSecs: 0,
    recordTime: '00:00:00',
    currentPositionSec: 0,
    currentDurationSec: 0,
    duration: '00:00:00',
  });
  // const fileName = `recording${Date.now()}.mp4`;
  const fileName = Platform.select({
    ios: `recording${Date.now()}.mp4`,
    android: `recording${Date.now()}.mp3`,
  });

  let audioRecorderPlayer = useRef<AudioRecorderPlayer>(
    new AudioRecorderPlayer(),
  ).current;

  //录音是否开始
  const [audioStart, setAudioStart] = useState(false);

  //开始录音
  const handleStartAudio = async () => {
    // checkRecordAudio();
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    const path = Platform.select({
      ios: fileName,
      android: dirs.CacheDir + fileName,
    });
    try {
      await audioRecorderPlayer.startRecorder(path, audioSet);
      setAudioStart(true);
      // GlobalLoading.startLoading({
      //   text: '正在讲话',
      // });
      setShowVoiceModal(true);
      audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
        setState(prev => ({
          ...prev,
          recordSecs: e.currentPosition,
          recordTime:
            audioRecorderPlayer?.mmssss(Math.floor(e.currentPosition)) ??
            '00:00:00',
        }));
      });
    } catch (error) {
      setAudioStart(false);
      setShowVoiceModal(false);
      // GlobalLoading.endLoading();
      modalPermission({});
      //setPermission(false);
      // setTimeout(() => {
      //   setPermission(true);
      // }, 1200);
      console.error('Error starting recording:', error);
    }
  };

  // 停止录音
  const handleStopAudio = async () => {
    setAudioStart(false);

    try {
      // await AudioRecorder.stopRecording();

      const result = await audioRecorderPlayer?.stopRecorder();
      audioRecorderPlayer?.removeRecordBackListener();

      setState(prev => ({...prev, recordSecs: 0}));

      uploadVoice(result);
    } catch (error) {
      GlobalLoading.endLoading();
      modalPermission({});
    }
  };

  //上传语音
  const uploadVoice = (path: string) => {
    GlobalLoading.startLoading({
      text: '正在发送',
    });
    //开始发送录音
    handleUpload(
      [
        {
          uri: path,
          type: 'audio/mpeg',
          fileName: fileName,
        },
      ],
      () => {},
      false,
      1,
    )
      .then((res: any) => {
        const duration = Math.ceil(state.recordSecs / 1000);
        if (res[0]) {
          voiceSend(res[0], duration);
        } else {
          toast.error(`语音发送失败`);
        }
      })
      .catch((err: any) => {
        toast.error(err);
      })
      .finally(() => {
        GlobalLoading.endLoading();
      });
  };

  //发送语音消息
  const voiceSend = (result: any, duration = 0) => {
    console.log(duration, 'duration');
    const client_msg_id = uuid.v4();
    //组装语音消息
    const msgContent = {
      client_msg_id: client_msg_id,
      content: JSON.stringify({
        audio_info: {
          file_url: result?.url,
          file_name: result?.old_name,
          new_name: result?.new_name,
          duration: duration,
          uuid: uuid.v4(),
        },
      }),
      conversation_id: '',
      send_nickname: selfInfo.nick_name,
      status: IMSDK.MessageStatus.SENDING,
      type: 4,
      send_id: selfInfo.user_id,
    };

    const msgText = imsdk.createMessage({
      recv_id:
        currentConversation.type === 1
          ? currentConversation.user.user_id
          : currentConversation.group.group_id,
      conversation_type: currentConversation.type,
      type: 4,
      content: msgContent.content,
    });
    const updateConv = {
      ...currentConversation,
      unread_count: IMSDK.MessageStatus.UNREAD,
      max_seq: currentConversation.max_seq + 1,
    };
    const insertMsg = {...msgContent, send_time: Date.now()};
    dispatch(
      insertCurrentMessageList({
        data: [insertMsg],
      }),
    );
    imsdk.sendMessage(
      msgText,
      {
        conversation_id: currentConversation.conversation_id,
        content: msgContent.content,
        status: IMSDK.MessageStatus.SENDING,
        type: 4,
        send_nickname: selfInfo.nick_name,
        file_name: result?.new_name,
        client_msg_id: client_msg_id as string,
      },
      updateConv,
    );
  };

  return (
    <>
      <View
        center
        style={{
          marginTop: pt(27),
          marginBottom: pt(27),
        }}
        {...panResponder.panHandlers}>
        {/* <Pressable onPressIn={handleStartAudio} onPressOut={handleStopAudio}> */}

        <View
          center
          style={{
            width: pt(112),
            height: pt(112),
            borderRadius: pt(100),
            backgroundColor: '#7581FF',
          }}>
          <Image assetName="mic" assetGroup="page.chat.toolbar" />
        </View>

        <Text
          style={{
            marginTop: pt(16),
            fontSize: pt(16),
            color: '#727785',
          }}>
          {t('按住说话')}
        </Text>
        {!permission ? (
          <Text
            style={{
              marginTop: pt(10),
              fontSize: pt(12),
              color: '#727785',
            }}>
            {t('当前无权限，请去设置中开启麦克风权限')}
          </Text>
        ) : null}
      </View>
    </>
  );
}
