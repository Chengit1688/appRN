import React, {
  CSSProperties,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '@/store';
import {operateRtc, upRtc, getRtc} from '@/api/rtc';
import {setVideoAndAudio} from '@/store/reducers/global';

import {useRafInterval} from 'ahooks';
import {StorageFactory} from '@/utils/storage';
import imsdk from '../../utils/IMSDK';
import {formatUrl} from '@/utils/common';
import {View} from 'react-native-ui-lib';
import {
  Alert,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  AppState,
} from 'react-native';
import SvgIcon from '../SvgIcon';
import {pt} from '@/utils/dimension';
import * as toast from '@/utils/toast';
import DeviceInfo from 'react-native-device-info';
import AgoraUIKit from '../Agora';
interface addContactProps {
  open: boolean;
  setOpen: Function;
  user: any;
}
import Sound from 'react-native-sound';

const callMp3 = require('@/assets/media/call.mp3');
const off = require('@/assets/media/off.mp3');
Sound.setCategory('Playback'); // 设置音频播放类型

const soundCall = new Sound(callMp3, error => {
  if (error) {
  } else {
    soundCall.setNumberOfLoops(-1); // 设置循环播放
  }
});

const soundEnd = new Sound(off, error => {
  if (error) {
  }
});

const defalut_avatar = require('@/assets/imgs/defalut_avatar.png');

const AudioAndVideoToUser = (props: addContactProps) => {
  const [isFull, setFull] = useState(false);
  const receivedData = useSelector<RootState, any>(
    state => state.global.userObj,
  );
  const dispatch = useDispatch();
  const [videocall, setVideocall] = useState(false);
  const [isHost, setHost] = useState(true);
  const [isPinned, setPinned] = useState(true);
  const [username, setUsername] = useState(props.user.send_nickname);
  const [content, setContent] = useState('');
  const [face, setFace] = useState(props.user.send_face_url);
  const [open, setOpen] = useState(props.open);
  const [channelName, setChannelName] = useState('');
  const [token, setToken] = useState('');
  const [type, setType] = useState(null);
  //   const [ringBell] = useState(new Audio(callMp3));
  //   const [hang] = useState(new Audio(off));
  const [bounds, setBounds] = useState({left: 0, top: 0, bottom: 0, right: 0});
  const [deviceId, setDeviceId] = useState(null);
  const [remark, setRemark] = useState(null);

  // 定时器
  const [count, setCount] = useState(0);
  const draggleRef = useRef<HTMLDivElement>(null);
  const onClose = () => {
    soundCall.pause();
    soundEnd.play();
    dispatch(setVideoAndAudio({}));
  };
  const hangUp = async (value: any) => {
    // 拒绝 挂断
    let params = {
      operation_id: Date.now().toString(),
      operation_type: value, // 1 取消 2 接听 3 拒绝 4 挂断 5 rtc切换
      rtc_type: receivedData.rtc_type,
      device_id: await DeviceInfo.getUniqueId(),
    };
    try {
      operateRtc(params).then(res => {
        soundCall.pause();
        soundEnd.play();
        // setVideocall(false);
        dispatch(setVideoAndAudio({}));
      });
    } catch (error: any) {
      onClose();
    }

    // props.setOpen(false);
  };
  const answer = async (value: any) => {
    //接听
    let params = {
      operation_id: Date.now().toString(),
      operation_type: 2, // 1 取消 2 接听 3 拒绝 4 挂断 5 rtc切换
      rtc_type: receivedData.rtc_type,
      device_id: await DeviceInfo.getUniqueId(),
    };
    try {
      operateRtc(params).then(() => {
        soundCall.pause();
        setType(receivedData.rtc_type);
        setDeviceId(receivedData.recv_device_id);
        setVideocall(true);
      });
    } catch (error: any) {
      onClose();
    }
  };
  // 定时器
  useRafInterval(() => {
    if (receivedData.rtc_status == 3 && videocall) {
      up();
    }
    if (receivedData.rtc_status == 1) {
      setCount(count + 1);
      if (count == 60) {
        onClose();
      }
    }
  }, 1000);

  // // 监听 AppState 变化
  // useEffect(() => {
  //   const handleAppStateChange = (nextAppState: any) => {
  //     if (nextAppState === 'background') {
  //       // 应用程序进入后台，执行你的代码
  //       console.log(receivedData, 'receivedData===>');
  //       if (receivedData.rtc_status == 3 && videocall) {
  //         up();
  //       }
  //     }
  //   };

  //   AppState.addEventListener('change', handleAppStateChange);

  //   return () => {
  //     // AppState.removeEventListener('change', handleAppStateChange);
  //   };
  // }, []);

  // rtc_status 状态 1 请求通话 2 取消通话 3 接听 4 拒绝 5 结束通话
  useEffect(() => {
    const fn = async () => {
      if (receivedData.rtc_status == 1) {
        // 请求通话
        // 加入频道 token
        getFriend();
        soundCall.play();
        setChannelName(receivedData.rtc_channel);
        setToken(receivedData.rtc_token);
        setType(receivedData.rtc_type);
        setContent(
          `正在邀请您进行${
            receivedData.rtc_type == 1 ? '语音' : '视频'
          }通话...`,
        );
      } else if (receivedData.rtc_status == 3) {
        // 判断是否被自己接听 不是 关闭弹窗

        const device_id = await DeviceInfo.getUniqueId();
        if (
          receivedData.recv_device_id &&
          receivedData.recv_device_id != device_id
        ) {
          setVideocall(false);
          // props.setOpen(false);
          soundCall.pause();
          dispatch(setVideoAndAudio({}));
          setChannelName('' as never);
          setToken('' as never);
          toast.error('已被其他设备接听');
        }
      } else if ([2, 5, 8].includes(receivedData.rtc_status)) {
        onClose();
        setChannelName('' as never);
        setToken('' as never);
      }
    };
    fn();
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
        soundCall.pause();
        dispatch(setVideoAndAudio({}));
        setChannelName('' as never);
        setToken('' as never);
      }
      // else if(error.message != "通话不存在"){
      //   message.error(error.message)
      // }
    }
  };
  const getFriend = async () => {
    const {data} = await imsdk.comlink.getFriendById(receivedData.send_id);
    setRemark(data[0].remark);
  };

  const rtcCallbacks = {
    EndCall: () => {
      hangUp(4);
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
                  // avatar: face ? formatUrl(face) : defalut_avatar,
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
                    hangUp(3);
                  }}>
                  <SvgIcon
                    name="callCencal"
                    style={{
                      width: pt(50),
                      height: pt(50),
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.btnTxt}>拒绝</Text>
              </View>
              <View style={{marginLeft: pt(100)}}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={(e: any) => {
                    answer(true);
                  }}>
                  <SvgIcon
                    name="answer"
                    style={{
                      width: pt(50),
                      height: pt(50),
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.btnTxt}>接听</Text>
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
    zIndex: 9999,
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
    zIndex: 9999,
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
    bottom: Dimensions.get('window').height * 0.2,
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

export default AudioAndVideoToUser;
