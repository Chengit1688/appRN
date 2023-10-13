import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaxVideoView from './MaxVideoView';
import MinVideoView from './MinVideoView';
import {MinUidConsumer} from '../Contexts/MinUidContext';
import {MaxUidConsumer} from '../Contexts/MaxUidContext';
import PropsContext from '../Contexts/PropsContext';
import {ClientRoleType} from 'react-native-agora';
import {pt} from '@/utils/dimension';

function updateTimer() {
  var currentTime = new Date().getTime();
  var startTime = new Date().getTime();

  function formatTime(time: any) {
    var hours = Math.floor(time / 3600000);
    var minutes = Math.floor((time % 3600000) / 60000);
    var seconds = Math.floor((time % 60000) / 1000);

    var hoursStr = hours.toString().padStart(2, '0');
    var minutesStr = minutes.toString().padStart(2, '0');
    var secondsStr = seconds.toString().padStart(2, '0');

    return hoursStr + ':' + minutesStr + ':' + secondsStr;
  }
}

const AudioView: React.FC = () => {
  const {rtcProps, styleProps} = useContext(PropsContext);
  const [width, setWidth] = useState(Dimensions.get('screen').width);
  const {videoPlaceholder} = rtcProps;
  const [time, setTime] = useState(0);
  const formatTime = (timeInSeconds: any) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  };

  useEffect(() => {
    Dimensions.addEventListener('change', () => {
      setWidth(Dimensions.get('screen').width);
    });
    const startTime = new Date().getTime();
    //初始化开始计算时间
    const time = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    return () => {
      clearInterval(time);
    };
  });
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View>
        <View style={styles.avatarName}>
          {/* <Image style={styles.avatar} source={{uri:videoPlaceholder?.avatar }}/> */}
          <Image style={styles.avatar} source={videoPlaceholder?.avatar} />
          <Text style={styles.name}>{videoPlaceholder?.username}</Text>
          <Text style={{...styles.name, marginTop: pt(80)}}>
            {formatTime(time)}
          </Text>
          {/* <span  className={classes.dot}></span> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AudioView;

const styles = StyleSheet.create({
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
});
