import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import AudioAndVideo from './AudioAndVideo';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {setRtc} from '@/api/rtc';
import {setVideoAndAudio} from '@/store/reducers/global';
import DeviceInfo from 'react-native-device-info';
// import AgoraUIKit from 'agora-rn-uikit';
import AgoraUIKit from '../Agora';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {} from 'react-native-safe-area-context';
import SvgIcon from '../SvgIcon';
import {pt} from '@/utils/dimension';

export default function GlobalAudioVideo() {
  const [openAudioAndVideo, setOpenAudioAndVideo] = useState(false);
  const [isfull, setIsfull] = useState(false);
  const audioAndVideoObj = useSelector<RootState, any>(
    state => state.global.audioAndVideoObjStatus,
    shallowEqual,
  );
  const currentConversation = useSelector<RootState, any>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );

  const [info, setInfo] = useState({
    rtc_channel: null,
    rtc_token: null,
    rtc_type: null,
    face: null,
  });
  const dispatch = useDispatch();
  const user = useMemo(() => {
    return currentConversation?.user;
  }, [currentConversation]);
  useEffect(() => {
    if (audioAndVideoObj?.open) {
      DeviceInfo.getUniqueId().then(uniqueId => {
        let parmas = {
          operation_id: Date.now().toString(),
          conversation_type: audioAndVideoObj?.conversation_type || 1, //1 单聊 2群聊
          recv_id: audioAndVideoObj?.user_id,
          rtc_type: audioAndVideoObj?.type, //1 语音 2 视频
          device_id: uniqueId,
        };
        dispatch(setVideoAndAudio({}));
        setRtc(parmas)
          .then(async (res: any) => {
            setInfo({
              rtc_channel: res.rtc_channel,
              rtc_token: res.rtc_token,
              rtc_type: audioAndVideoObj?.type,
              face: res.send_face_url,
            });
            setOpenAudioAndVideo(true);
          })
          .finally(() => {
            //dispatch(setVideoAndAudio({open:false}))
          });
      });
    } else {
      setOpenAudioAndVideo(false);
    }
  }, [audioAndVideoObj]);

  return (
    <>
      {/* <View style={{
         position:'absolute',
         height:'100%',
         width:'100%'
      }}>
        <AgoraUIKit  settings={{
           role: 1,  // 1 主播，可以接受和发送
           disableRtm: true,
           enableAudio: true,
           videoPlaceholder:{
            avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F84754553-2610-437b-913e-09770cf40675%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1694412813&t=a471152eb23ac46f79e095965018854b' ,
            username:'test123',
          }
        }} connectionData={
          { 
             
              appId: 'ba849bc8600542eb859414d30e1318ea',
              channel: "test",
              rtcToken:'007eJxTYIji/r/LW/9A+8lZbZcXXLvZYaH4KsmC+X9xu16tkLB0sJcCg2WipYVlSlpSWqphoomhhYWFgaFxkqVRcqKBQapBcmpa/edrKQ2BjAx743IYmRgYwRDEZ2EoSS0uYWBgQhIxBAIAWMYhdQ==',
             
            
        }} 
        ></AgoraUIKit>
        </View> */}
      {/* <AudioAndVideo open={false} setOpen={()=>{}} user={{}} info={{}} ></AudioAndVideo> */}

      {openAudioAndVideo ? (
        <AudioAndVideo
          open={false}
          setOpen={() => {}}
          user={user}
          info={info}></AudioAndVideo>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
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
