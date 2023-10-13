import {useEffect} from 'react';
import {ConnectionStatusBar} from 'react-native-ui-lib';
import FlashMessage from 'react-native-flash-message';
import Toast from 'react-native-toast-message';
import Loading from '@/components/Loading';
import {toastConfig} from '@/utils/toastConfig';

import Provider from './provider';
import Navigation from './navigation';
import AppRoutes from './router/AppRoutes';
import {t} from 'i18next';
import GlobalToUserAudio from './components/AgoraRTC/GlobalToUserAudio';
import GlobalAudioVideo from './components/AgoraRTC/GlobalAudioVideo';

import BootSplash from 'react-native-bootsplash';
import {Alert} from 'react-native';

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

export default function App(): JSX.Element {
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
