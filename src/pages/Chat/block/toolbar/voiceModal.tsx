import {StyleSheet, PanResponder, ActivityIndicator} from 'react-native';
import {View, Text} from 'react-native-ui-lib';
import React, {useState} from 'react';
import {pt} from '@/utils/dimension';

export default function VoiceModal({
  setShowVoiceModal,
}: {
  setShowVoiceModal: any;
}) {
  const [cancelRecording, setCancelRecording] = useState(false);
  //   const panResponder = PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderMove: (evt, gestureState) => {
  //       // 计算垂直移动的距离
  //       const verticalDistance = gestureState.dy;

  //       if (!cancelRecording && verticalDistance < -10) {
  //         // 如果垂直移动距离小于-10，表示上滑，启用取消发送
  //         setCancelRecording(true);
  //       }
  //     },
  //     onPanResponderRelease: () => {
  //       // 用户释放手指时根据 cancelRecording 的状态来执行相应操作
  //       if (cancelRecording) {
  //         // 取消发送
  //         // 在这里可以添加取消录音或其他操作的逻辑
  //         console.log('取消发送');
  //         setShowVoiceModal(false);
  //       } else {
  //         // 正常操作
  //         // 在这里可以添加正常录音或其他操作的逻辑
  //         console.log('正常操作');
  //       }
  //       // 重置 cancelRecording 状态
  //       setCancelRecording(false);
  //     },
  //   });
  return (
    <View style={styles.main}>
      <View
        flex
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        // {...panResponder.panHandlers}>
      >
        <View
          flex
          center
          style={{
            height: '100%',
            width: '100%',
          }}>
          <View
            flex
            center
            style={{
              height: '100%',
              width: '100%',
            }}>
            <View row style={styles.voiceContent}>
              <Text style={styles.voiceText}>正在讲话</Text>
              <ActivityIndicator animating color={'#000'} />
            </View>
          </View>
          <Text style={styles.tips}>手指上滑松开即取消发送</Text>
        </View>
        {/* <Text style={{fontSize: 16}}>上滑取消</Text> */}
        <View
          style={{
            height: pt(300),
            width: '100%',
            borderTopRightRadius: pt(80),
            borderTopLeftRadius: pt(80),
            backgroundColor: 'rgba(117, 129, 255, 0.7)',
          }}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,.8)',
  },
  voiceContent: {
    padding: pt(20),
    paddingHorizontal: pt(40),
    borderRadius: pt(5),
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  voiceText: {
    color: '#000',
    marginRight: pt(5),
    fontSize: pt(16),
  },
  tips: {
    color: '#fff',
    marginBottom: pt(10),
  },
});
