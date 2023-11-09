import {useEffect, useState} from 'react';
import {ConnectionStatusBar} from 'react-native-ui-lib';
import FlashMessage from 'react-native-flash-message';
import Toast from 'react-native-toast-message';
import Loading from '@/components/Loading';
import {toastConfig} from '@/utils/toastConfig';
import Provider from './provider';
import Navigation from './navigation';
import {useCodePush} from './useCodePush';
import AppRoutes from './router/AppRoutes';
import {t} from 'i18next';
import GlobalToUserAudio from './components/AgoraRTC/GlobalToUserAudio';
import GlobalAudioVideo from './components/AgoraRTC/GlobalAudioVideo';
import BootSplash from 'react-native-bootsplash';
import codePush from "react-native-code-push";


// 4b189ae2f55310096eb58c02e75c647a60492fd2      appcenter

// android
// │ Production │ XJTEZHV-apoCQek7xdQz1pQZiLX88JwJCIgTu │
// │ Staging    │ kudy4IXhoP2UUxjSk7HRtXpAs8JliQh9g89fW │

// ios
// │ Production │ 4DLMpxAlmkRZYtq5HUvKqlW_g7BjCSGM3Ls_4 │
// │ Staging    │ CUlVKKrmOBDz7T-ZSh3-qcn46yuvu_wlZ6y82 │

// 发布
// appcenter codepush release-react -a 13612858466-163.com/myapp-ios -t 1.0.0 -o ./build -d Staging
// appcenter codepush release-react -a 13612858466-163.com/myapp-android -t 1.0.0 -o ./build -d Staging

// 发布结果
// appcenter codepush deployment list -a 13612858466-163.com/myapp-ios
// appcenter codepush deployment list -a 13612858466-163.com/myapp-android

// appcenter codepush deployment list -k -a 13612858466-163.com/zhizhengAndroid-android
// appcenter codepush deployment add -a 13612858466-163.com/zhizhengAndroid-android Production

global.isConnected = true;
// console.info('set network status to true');
ConnectionStatusBar.registerGlobalOnConnectionLost(() => {
  // TODO: 无法获取网络状态
  // console.warn('what what?!? network connection has been lost');
  global.isConnected = false;
});

// import { init, setAllowsBackgroundLocationUpdates } from 'react-native-amap-geolocation';

// await init({
//   android:'',
//   ios:'833bac0f2d158354a81db9ad1a477672'
// })

// // 设置ios设备后台运行
// setAllowsBackgroundLocationUpdates(true)

function App({ sceneId }: InjectedProps) {

  useCodePush(sceneId)

  useEffect(() => {
  
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
    });

  }, []);




  return (
    <Provider>
      <Navigation />
      <ConnectionStatusBar
        label={t('当前无网络，请检查。')}
        onConnectionChange={(isConnected: boolean, isInitial: boolean) => {
          global.isConnected = isConnected;
          // Alert.alert('提示', isConnected ? '网络连接成功' : '网络连接失败');
          // console.info('network status----', isConnected);
        }}
      />
      {/*全局音视频组件 */}
      <GlobalAudioVideo />
      <GlobalToUserAudio />

      <FlashMessage position="top" />
      <Toast config={toastConfig} />

      {/* <Loading /> */}
    </Provider>
  );
}

export default codePush(App);