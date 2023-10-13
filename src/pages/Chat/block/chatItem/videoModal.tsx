import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {pt} from '@/utils/dimension';
import Video from 'react-native-video';
import {Colors, Slider} from 'react-native-ui-lib';
import {Svg} from 'react-native-svg';
import {SvgIcon} from '@/components';

export default function VideoModal({
  uri,
  showViewVideo,
  setShowViewVideo,
}: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0.1);
  const handleLoad = (data: any) => {
    if (!isLoading) return;
    setIsLoading(false);
    setDuration(Math.floor(data.duration));
  };
  return (
    <Modal
      style={styles.viewModal}
      visible={showViewVideo.videView}
      transparent={true}
      onDismiss={() => {}}>
      <TouchableOpacity
        onPress={() => {
          setShowViewVideo({
            ...showViewVideo,
            videView: false,
            videoPasue: true,
          });
        }}
        activeOpacity={1}
        style={styles.videoMask}>
        {isLoading && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              ...StyleSheet.absoluteFillObject,
              backgroundColor: '#000',
              zIndex: 999,
            }}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
        <Video
          resizeMode={'cover'}
          paused={showViewVideo.videoPasue}
          source={{uri: showViewVideo.videoSrc}}
          style={styles.modalVideo}
          onProgress={data => {
            if (!isLoading) {
              // handleSetCurrentTime(data);
              setCurrentTime(data.currentTime);
            }
          }}
          progressUpdateInterval={1000}
          onBuffer={() => {
            // setIsLoading(false);
          }}
          onError={() => {}}
          cache={true} // 启用视频缓存
          onLoad={handleLoad}></Video>
        {duration > 0 ? (
          <View
            style={{
              position: 'absolute',
              bottom: pt(26),
              width: pt(320),
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,.4)',
              borderRadius: pt(5),
            }}>
            <Slider
              value={currentTime}
              minimumValue={0}
              maximumValue={duration}
              step={1}
              containerStyle={styles.slider}
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
              activeThumbStyle={styles.activeThumb}
              thumbTintColor={Colors.violet70}
              minimumTrackTintColor={Colors.violet40}
              maximumTrackTintColor={Colors.violet70}
            />
          </View>
        ) : null}
        {/**关闭 */}
        {/* <TouchableOpacity
          style={{
            position: 'absolute',
            top: pt(20),
            right: pt(20),
            backgroundColor: 'rgba(0,0,0,.4)',
            zIndex: 99999,
          }}
          onPress={() => {
            console.log('点击了吗');
            setShowViewVideo({
              ...showViewVideo,
              videView: false,
              videoPasue: true,
            });
          }}>
          <SvgIcon
            name="close"
            size={pt(30)}
            style={{width: pt(30), height: pt(30)}}></SvgIcon>
        </TouchableOpacity> */}
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  videoStyle: {
    flex: 1,
    width: pt(100),
    height: pt(150),
    borderRadius: pt(7),
    backgroundColor: '#000',
  },
  videoMain: {
    position: 'relative',
    flex: 1,
    width: pt(100),
    height: pt(150),
  },
  play: {
    position: 'absolute',
    left: pt(40),
    top: pt(65),
  },
  viewModal: {
    position: 'absolute',
    height: pt(200),
    width: pt(1000),
    backgroundColor: 'rgba(0,0,0,.4)',
    zIndex: 999,
  },
  videoMask: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#000',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalVideo: {
    position: 'absolute',

    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  slider: {
    width: pt(300),
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor: '#7581FF',
    borderWidth: 1,
    shadowColor: Colors.white,
  },
  track: {
    height: 2,
  },
  activeThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: '#7581FF',
    borderWidth: 2,
  },
});
