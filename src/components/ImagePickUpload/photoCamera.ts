import {
  PhotoQuality,
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {cameraType, handleUpload} from '.';
import modalPermission from '@/utils/modalPermission';
type type = 'photo' | 'video' | 'mixed';
const options = {
  mediaType: 'mixed' as MediaType,
  maxWidth: 1500,
  maxHeight: 2000,
  quality: 1 as PhotoQuality,
  cameraType: 'back' as cameraType,
  includeBase64: false,
  saveToPhotos: false,
  selectionLimit: 9,
};

//打开相册
export const selectPhotoTapped = (
  isUpload = true,
  config?: {type?: MediaType; selectionLimit?: number},
) => {
  return new Promise((resolve, reject) => {
    try {
      launchImageLibrary(
        {
          ...options,
          ...config,
        },
        response => {
          if (response.errorCode) {
            modalPermission({});
            return;
          }
          if (response.assets) {
            if (isUpload) {
              handleUpload(response.assets, () => {}, true).then(res => {
                resolve(res);
              });
            } else {
              resolve(response.assets);
            }
          } else {
            reject(response);
          }
        },
      );
    } catch (err) {
      console.debug(err);
      modalPermission({});
      reject(err);
    }
  });
};

//打开相机
export const takePhotoTapped = (
  isUpload = true,
  config?: {mediaType: MediaType},
) => {
  return new Promise((resolve, reject) => {
    try {
      launchCamera(
        {
          ...options,
          ...config,
        },
        response => {
          if (response.errorCode) {
            modalPermission({});
            return;
          }
          if (response.assets) {
            if (isUpload) {
              handleUpload(response.assets, () => {}, true).then(res => {
                resolve(res);
              });
            } else {
              resolve(response.assets);
            }
          } else {
            reject(response);
          }
        },
      );
    } catch (err) {
      console.debug(err);
      modalPermission({});
      reject(err);
    }
  });
};

// //打开相机（兼容安卓版，需要同时显示拍照和录像）
// export const takePhotoTappedAll = (
//   isUpload = true,
//   config?: {cameraType: cameraType},
// ) => {
//   return new Promise((resolve, reject) => {
//     try {
//       ImagePicker.openCamera({
//         mediaType: 'any',
//       }).then(response => {
//         console.log('response', response);
//         // if (response.assets) {
//         //   if (isUpload) {
//         //     handleUpload(response.assets, () => {}, true).then(res => {
//         //       resolve(res);
//         //     });
//         //   } else {
//         //     resolve(response.assets);
//         //   }
//         // } else {
//         //   reject(response);
//         // }
//       });
//     } catch (err) {
//       console.debug(err);
//       reject(err);
//     }
//   });
// };
