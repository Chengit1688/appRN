import {Platform, PermissionsAndroid, Alert} from 'react-native';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  request,
  RESULTS,
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import modalPermission from './modalPermission';
import {StorageFactory} from '@/utils/storage';

export const checkMultiplePermissions = async () => {
  if (Platform.OS === 'ios') {
    checkMultiple([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.IOS.MICROPHONE,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ]).then(statuses => {
      //相机权限
      if (statuses[PERMISSIONS.IOS.CAMERA] !== RESULTS.GRANTED) {
        request(PERMISSIONS.IOS.CAMERA).then(statuses => {
        });
      }

      if (statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] !== RESULTS.GRANTED) {
        request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(statuses => {
        });
      }
      if (statuses[PERMISSIONS.IOS.MICROPHONE] !== RESULTS.GRANTED) {
        request(PERMISSIONS.IOS.MICROPHONE).then(statuses => {
        });
      }
      if (statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] !== RESULTS.GRANTED) {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(statuses => {
        });
      }
    });
  } else if (Platform.OS === 'android') {
    // checkNotifications().then(({status, settings}) => {
    //   console.log(status, settings, '检查通知====>');
    //   if (status === 'denied') {
    //     requestNotifications(['alert', 'badge', 'sound']).then(
    //       ({status, settings}) => {
    //         // …
    //         if (status === 'blocked') {
    //           modalPermission({tipContent: '悬浮窗、后台弹窗'});
    //           return;
    //         }
    //         console.log('是否发起了请求====》', status, settings);
    //       },
    //     );
    //   }
    // });

    checkMultiple([
      PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
    ]).then(async statuses => {
      // Alert.alert('提示', '请在设置->止正 Talk->权限打开后台弹窗和悬浮窗');
      // const falg = await StorageFactory.getLocal(
      //   'PERMISSION.ANDROID.SYSTEM_ALERT_WINDOW',
      // );
      // if (!falg) {
      //   modalPermission({tipContent: '悬浮窗、后台弹窗'});
      //   StorageFactory.setLocal('PERMISSION.ANDROID.SYSTEM_ALERT_WINDOW', true);
      // }

      requestMultiple([
        PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      ]).then(statuses => {
      });

      // PermissionsAndroid.request(
      //   PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW,
      // ).then(statuses => {
      //   console.debug(statuses);
      // });
      //相机权限
      //   if (statuses[PERMISSIONS.ANDROID.CAMERA] !== RESULTS.GRANTED) {
      //     request(PERMISSIONS.ANDROID.CAMERA).then(statuses => {
      //       console.log(statuses);
      //     });
      //   }

      //   if (
      //     statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] !== RESULTS.GRANTED
      //   ) {
      //     request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(statuses => {
      //       console.log(statuses);
      //     });
      //   }
      //   if (
      //     statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !== RESULTS.GRANTED
      //   ) {
      //     request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(statuses => {
      //       console.log(statuses);
      //     });
      //   }
      //   if (statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] !== RESULTS.GRANTED) {
      //     request(PERMISSIONS.ANDROID.RECORD_AUDIO).then(statuses => {
      //       console.log(statuses);
      //     });
      //   }
      //   if (
      //     statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] !== RESULTS.GRANTED
      //   ) {
      //     request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(statuses => {
      //       console.log(statuses);
      //     });
      //   }
      //   if (statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] !== RESULTS.GRANTED) {
      //     request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES).then(statuses => {
      //       console.log(statuses);
      //     });
      //   }
      //   if (statuses[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] !== RESULTS.GRANTED) {
      //     request(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO).then(statuses => {
      //       console.log(statuses);
      //     });
      //   }
    });
  }
};
