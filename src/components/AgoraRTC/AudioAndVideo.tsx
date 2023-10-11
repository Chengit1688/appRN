import React, {
  CSSProperties,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {RootState} from '@/store';
import {operateRtc, upRtc} from '@/api/rtc';
import {
  setAudioVideoObjStatus,
  setVideoAndAudio,
} from '@/store/reducers/global';
import {useRafInterval} from 'ahooks';
import {v4 as uuid} from 'uuid';
import {StorageFactory} from '@/utils/storage';
import {formatUrl} from '@/utils/common';
import {IMSDK} from '@/utils/IMSDK';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {pt} from '@/utils/dimension';
import SvgIcon from '../SvgIcon';
import DeviceInfo from 'react-native-device-info';
import AgoraUIKit from '../Agora';
import Sound from 'react-native-sound';

const callMp3 = require('@/assets/media/call.mp3');
const off = require('@/assets/media/off.mp3');
Sound.setCategory('Playback'); // 设置音频播放类型

const soundCall = new Sound(callMp3, error => {
  if (error) {
    console.log('Error loading sound:', error);
  } else {
    soundCall.setNumberOfLoops(-1); // 设置循环播放
  }
});

const soundEnd = new Sound(off, error => {
  if (error) {
    console.log('Error loading sound:', error);
  }
});

interface addContactProps {
  open: boolean;
  setOpen: Function;
  user: any;
  info: any;
}

const defalut_avatar = require('@/assets/imgs/defalut_avatar.png');

const AudioAndVideo = (props: any) => {
  const [isFull, setFull] = useState(false);
  const currentConversation = useSelector<RootState, any>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );
  const receivedData = useSelector<RootState, any>(
    state => state.global.userObj,
  );
  const dispatch = useDispatch();
  const [videocall, setVideocall] = useState(false);
  const [isHost, setHost] = useState(true);
  const [isPinned, setPinned] = useState(true);
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [face, setFace] = useState('');
  const [open, setOpen] = useState(props.open);
  const [channelName, setChannelName] = useState('');
  const [token, setToken] = useState('');
  const [type, setType] = useState(props.info.rtc_type);
  //   const [ringBell] = useState(new Audio(callMp3));
  //   const [hang] = useState(new Audio(off));

  const [bounds, setBounds] = useState({left: 0, top: 0, bottom: 0, right: 0});
  // 定时器
  const [count, setCount] = useState(0);
  //定时器结束
  const draggleRef = useRef<HTMLDivElement>(null);
  //   ringBell.loop = true; // 设置循环播放
  const onClose = () => {
    dispatch(setAudioVideoObjStatus({}));
    soundCall.pause();
    soundEnd.play();
  };
  const hangUp = async (value: any) => {
    let params = {
      operation_id: Date.now().toString(),
      operation_type: value, // 1 取消 2 接听 3 拒绝 4 挂断 5 rtc切换
      rtc_type: props.info.rtc_type,
      device_id: await DeviceInfo.getUniqueId(),
    };
    try {
      operateRtc(params);
    } catch (error: any) {
      setVideocall(false);
      onClose();
    }
    setVideocall(false);
    soundCall.pause();
    soundEnd.play();
    dispatch(setAudioVideoObjStatus({}));

    // if([1,3,4].includes(value)){
    //   currentConversation.co
    // }

    // ringBell.pause()
    // hang.play()
    // setVideocall(false)
    // dispatch(setAudioVideoObjStatus({}))
  };
  // 定时器
  useRafInterval(() => {
    //如果接通 直接走保活接口
    if (receivedData.rtc_status == 3) {
      up();
    }
    if (receivedData.rtc_status == 1) {
      setCount(count + 1);
      if (count == 60) {
        onClose();
      }
    }
  }, 1000);
  useEffect(() => {
    console.log(props.info, 'props.info');
    soundCall.play();

    setUsername(currentConversation?.user?.remark || props?.user?.nick_name);
    setFace(props.user?.face_url);
    setContent('正在等待对方接受邀请...');
    // 推入频道 token
    setChannelName(props.info?.rtc_channel);
    setToken(props.info?.rtc_token);
    setType(props.info?.rtc_type);

    // console.error(props.info)
  }, [open]);
  // rtc_status 状态 1 请求通话 2 取消通话 3 接听 4 拒绝 5 结束通话
  useEffect(() => {
    console.debug(receivedData.rtc_status, '====语音状态===');
    if (receivedData.rtc_status == 3) {
      // 对方接听
      setVideocall(true);
      soundCall.pause();
      // RTCStatusTypeDisagree    RTCStatusType = 4 // 拒绝
      // RTCStatusTypeFinish      RTCStatusType = 5 // 结束通话
      // RTCStatusTypeNotResponse RTCStatusType = 6 // 未应答
      // RTCStatusTypeBusy        RTCStatusType = 7 // 对方忙线中
      // RTCStatusTypeAbort       RTCStatusType = 8 // 通话中断
    } else if ([4, 5, 6, 7, 8].includes(receivedData.rtc_status)) {
      setVideocall(false);
      dispatch(setAudioVideoObjStatus({}));
      onClose();
      setChannelName('');
      setToken('' as never);
      // 需要在会话列表里增加一条消息
    }
  }, [receivedData]);

  //保活
  const up = async () => {
    try {
      await upRtc({
        operation_id: Date.now().toString(),
        device_id: await DeviceInfo.getUniqueId(),
      });
    } catch (error: any) {
      if (error.message != '通话网络不佳') {
        setVideocall(false);
        props.setOpen(false);
        // ringBell.pause()
        dispatch(setAudioVideoObjStatus({}));
        setChannelName('');
        setToken('' as never);
      }
      // else if(error.message != "通话不存在"){
      //   message.error(error.message)
      // }
    }
  };
  const rtcCallbacks = {
    EndCall: () => {
      hangUp(4);
      onClose();
    },
  };
  return (
    <View style={[styles.box, isFull ? styles.smailbox : null]}>
      <StatusBar barStyle={'light-content'} />
      {!isFull ? (
        <TouchableOpacity
          activeOpacity={1}
          style={{...styles.scale, top: pt(44 + 10)}}
          onPress={() => {
            setFull(true);
          }}>
          <SvgIcon
            name="scale"
            size={30}
            style={{
              width: pt(20),
              height: pt(26),
            }}
          />
        </TouchableOpacity>
      ) : null}
      {isFull ? (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: pt(70),
            width: pt(70),
            zIndex: 999,
          }}
          activeOpacity={1}
          onPress={() => {
            console.log('点击了');
            setFull(false);
          }}>
          <Image
            style={{...styles.avatar, width: pt(45), height: pt(45)}}
            source={face ? {uri: formatUrl(face)} : defalut_avatar}
          />
        </TouchableOpacity>
      ) : null}
      <View
        style={{
          opacity: isFull ? 0 : 1,
        }}>
        {videocall ? (
          <View style={styles.wrap}>
            <AgoraUIKit
              settings={{
                mode: 1,
                role: 1, // 1 主播，可以接受和发送
                disableRtm: true,
                enableVideo: type === 1 ? false : true,
                videoPlaceholder: {
                  avatar: face ? {uri: formatUrl(face)} : defalut_avatar,
                  username: username,
                },
              }}
              connectionData={{
                appId: '956af9b7836e43ed86a6bea966bf64f0',
                channel: channelName,
                rtcToken: token,
              }}
              rtcCallbacks={rtcCallbacks}></AgoraUIKit>
          </View>
        ) : (
          <View style={styles.wrap}>
            <View style={styles.avatarName}>
              <Image
                style={styles.avatar}
                source={face ? {uri: formatUrl(face)} : defalut_avatar}
              />
              <Text style={styles.name}>{username}</Text>
              <Text style={styles.name}>{content}</Text>
              {/* <span  className={classes.dot}></span> */}
            </View>
            <View style={styles.icon}>
              <View>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={(e: any) => {
                    hangUp(1);
                  }}>
                  <SvgIcon
                    name="callCencal"
                    style={{
                      width: pt(45),
                      height: pt(45),
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.btnTxt}>取消</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#000',
    height: Dimensions.get('window').height,
    position: 'absolute',
    width: '100%',
  },
  smailbox: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.8)',
    height: pt(70),
    width: pt(70),
    right: pt(0),
    top: pt(300),
    borderRadius: pt(10),
    borderTopRightRadius: pt(0),
    borderBottomRightRadius: pt(0),
    overflow: 'hidden',
    zIndex: 999,
  },

  wrap: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
  avatarName: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    top: Dimensions.get('window').height * 0.2,
    width: '100%',
  },
  avatar: {
    width: pt(80),
    height: pt(80),
    // backgroundColor:'#fff',
    borderRadius: pt(8),
    overflow: 'hidden',
  },
  name: {
    fontSize: pt(16),
    color: '#fff',
    fontWeight: 'bold',
    marginTop: pt(30),
    textAlign: 'center',
  },
  icon: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: pt(100),
  },
  btnTxt: {
    color: '#fff',
    fontSize: pt(15),
    marginTop: pt(10),
    textAlign: 'center',
    fontWeight: '500',
  },

  scale: {
    position: 'absolute',
    left: pt(20),
    zIndex: 999,
    width: pt(50),
    height: pt(50),
    backgroundColor: '#000',
    borderRadius: pt(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioAndVideo;
