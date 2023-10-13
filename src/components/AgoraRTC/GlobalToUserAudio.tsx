import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import AudioAndVideoToUser from './AudioAndVideoToUser';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {setRtc} from '@/api/rtc';
import {setVideoAndAudio} from '@/store/reducers/global';
import DeviceInfo from 'react-native-device-info';
import AgoraUIKit from '../Agora';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default function GlobalToUserAudio() {
  const [openAudioAndVideo, setOpenAudioAndVideo] = useState(false);
  const receivedData = useSelector<RootState, any>(
    state => state.global.userObj,
  );
  const selfInfo = useSelector(
    (state: RootState) => state.user.selfInfo,
    shallowEqual,
  );
  const [user, setUser] = useState({});
  useEffect(() => {
    if (
      Object.keys(receivedData).length > 0 &&
      selfInfo.user_id != receivedData.send_id &&
      receivedData.rtc_status == 1 &&
      !openAudioAndVideo
    ) {
      setUser(receivedData);
      setOpenAudioAndVideo(true);
    } else if (
      [4, 5, 6, 7, 8].includes(receivedData.rtc_status) ||
      !receivedData.send_id
    ) {
      setOpenAudioAndVideo(false);
    }
  }, [receivedData]);
  return (
    <>
      {/* <View style={{
         position:'absolute',
         height:'100%',
         width:'100%',
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
              rtcToken:'007eJxTYGgtVWzu6XSRmNFxWHW30619+5NC6nuvxU9oXXc66yPLleUKDJaJlhaWKWlJaamGiSaGFhYWBobGSZZGyYkGBqkGyalpv+bfSGkIZGRYNWctKyMDBIL4LAwlqcUlDAwA0WkiZg==',
        }} 
        ></AgoraUIKit>
        </View> */}
      {openAudioAndVideo ? (
        <AudioAndVideoToUser open={false} setOpen={() => {}} user={user} />
      ) : null}
    </>
  );
}
