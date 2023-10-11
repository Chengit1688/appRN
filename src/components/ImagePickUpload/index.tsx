import {uploadV2} from '@/api/user';
import {pt} from '@/utils/dimension';
import React from 'react';
import GlobalLoading from '../Loading/globalLoading';
import {StorageFactory} from '@/utils/storage';

import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';

import {checkIsImgType, checkIsVideoType} from '@/utils/common';
import modalPermission from '@/utils/modalPermission';

/**
 * 添加图片弹框
 *
 * return 数据展示
 * const source = {uri: response.uri}
 */
export type props = {
  type: 'photo' | 'video' | 'mixed';
  isShow: any;
  limit: number;
  onSelect: (res: any) => void;
  onCancel: () => void;
};

export type PhotoQuality =
  | 0
  | 0.1
  | 0.2
  | 0.3
  | 0.4
  | 0.5
  | 0.6
  | 0.7
  | 0.8
  | 0.9
  | 1;
export type cameraType = 'back' | 'front';

// type imgItem= {
//     fileName: string,
//     uri:string,
//     type:string,
//     height: number,
//     width:number,
//     [key:string]: string | number
// }

// const checkIsImgType = (file: any) => {
//   if (
//     !/\.('bmp|jpg|jpeg|png|tif|gif|pcx|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|ai|raw|wmf|webp|avif|apng')$/.test(
//       file?.toLocaleLowerCase(),
//     )
//   ) {
//     return false;
//   } else {
//     return true;
//   }
// };

// const checkIsVideoType = (file: any) => {
//   if (
//     !/\.(wmv|asf|asx|rm|rmvb|mp4|3gp|mov|m4v|avi|dat|mkv|flv|vob)$/.test(
//       file?.toLocaleLowerCase(),
//     )
//   ) {
//     return false;
//   } else {
//     return true;
//   }
// };

const uploadType: any = {
  6: 1,
  3: 3,
  5: 4,
};

export const handleUpload = (
  file: any[] = [],
  onUploadProgress = (...args: any) => {},
  loadText = false,
  type?: any,
) => {
  let fileType = 6;
  if (loadText) {
    GlobalLoading.startLoading({text: '上传中'});
  }

  let imgData: any = [],
    state = 0;
  return new Promise((resolve, reject) => {
    for (let i = 0; i < file.length; i++) {
      let source = file[i]?.uri;
      if (Platform.OS === 'android') {
        source = file[i]?.uri;
      } else {
        source = file[i]?.uri.replace('file://', '');
      }

      let _file = {uri: source, type: file[i].type, name: file[i].fileName};
      console.log('source', source);
      if (checkIsImgType(source)) {
        fileType = 3;
      }
      if (checkIsVideoType(source)) {
        fileType = 5;
      }
      const fromData = new FormData();
      fromData.append('operation_id', Date.now() + '');
      fromData.append('file', _file);
      fromData.append('file_type', type ? type : uploadType[fileType]);
      uploadV2(fromData, {
        onUploadProgress,
      })
        .then(async (res: any) => {
          const domain = await StorageFactory.getSession('SSO_DOMAIN');
          const obj = {
            ...res,
            thumbnail: `${domain}${res.thumbnail}`,
            url: `${domain}${res.url}`,
          };
          imgData.push(obj);
        })
        .catch(err => {
          console.log(err, 'err');
        })
        .finally(() => {
          state++;
          if (state === file.length) {
            resolve(imgData);
            loadText && GlobalLoading.endLoading();
          }
        });
    }
  });
};

export const ImagePickerUpload = ({
  type,
  isShow,
  limit,
  onSelect,
  onCancel,
}: props) => {
  const options = {
    mediaType: type,
    maxWidth: 1500,
    maxHeight: 2000,
    quality: 1 as PhotoQuality,
    cameraType: 'back' as cameraType,
    includeBase64: true,
    saveToPhotos: false,
    selectionLimit: limit || 9,
  };

  const dealImage = (response: any) => {
    onCancel();
    console.log('dealImages => ', response);
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('mage picker Error: ', response.errorCode);
      modalPermission({});
      return;
    } else if (response.errorMessage) {
      console.log('User tapped errorMessage: ', response.errorMessage);
    } else if (response.assets) {
      console.log(response.assets, '111');
      //上传图片
      //uploadV2()
      handleUpload(response.assets, () => {}, true).then(res => {
        onSelect(res);
      });
      // onSelect(response.assets)
    } else {
      console.log('other data');
    }
  };

  const selectPhotoTapped = (config?: any) => {
    try {
      launchImageLibrary(
        {
          ...options,
          ...config,
        },
        response => dealImage(response),
      );
    } catch (err) {
      modalPermission({});
    }
  };
  const takePhotoTapped = (type = 'mixed') => {
    let config: any = {
      ...options,
      mediaType: type,
    };
    try {
      launchCamera(config, response => dealImage(response));
    } catch (err) {
      console.debug(err);
      modalPermission({});
    }
  };
  let buttons: any = [];

  if (Platform.OS === 'android') {
    buttons = [
      {
        label: '拍摄照片',

        onClick: () => takePhotoTapped('photo'),
      },
      {
        label: '拍摄视频',

        onClick: () => takePhotoTapped('video'),
      },
    ];
  } else {
    buttons = [
      {
        label: '拍摄',
        tips: '照片或视频',
        onClick: () => takePhotoTapped(),
      },
    ];
  }

  const newButtons = [
    ...buttons,
    {
      label: '选择相片',
      onClick: () => selectPhotoTapped(),
    },
    {
      label: '选择视频',
      onClick: () =>
        selectPhotoTapped({
          mediaType: 'video',
          selectionLimit: 1,
        }),
    },
    {
      label: '取消',
      textStyle: {borderTopWidth: pt(5), borderTopColor: '#F6F7F9'},
      onClick: () => onCancel(),
    },
  ];

  return isShow ? (
    <View style={styles.showMain}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.outSideView}
        onPress={onCancel}
      />
      <Modal
        animationType={'slide'}
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={onCancel}>
        <View style={styles.container}>
          {newButtons.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.openButton}
              onPress={item.onClick}
              activeOpacity={1}>
              <View style={[styles.textItem, item.textStyle]}>
                <Text style={[styles.buttonTitle]}>{item.label}</Text>
                {item.tips ? (
                  <Text style={styles.tips}>{item.tips}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  showMain: {
    ...StyleSheet.absoluteFillObject,
  },
  outSideView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.4)',
    height: Dimensions.get('window').height,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: pt(-20),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 30,
    overflow: 'hidden',
  },
  openButton: {
    width: '100%',
    height: pt(60),
    lineHeight: pt(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textItem: {
    paddingTop: pt(14),
    paddingBottom: pt(14),
    width: '100%',
  },
  buttonTitle: {
    fontSize: pt(16),
    color: '#000000',

    textAlign: 'center',
  },
  tips: {
    fontSize: pt(12),
    color: '#666666',
    textAlign: 'center',
  },
});
