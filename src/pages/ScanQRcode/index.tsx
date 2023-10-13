import {Navbar, SvgIcon} from '@/components';
import {pt} from '@/utils/dimension';
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  Image,
} from 'react-native';
import {Toast} from '@ant-design/react-native';
import {RNCamera} from 'react-native-camera';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RNQRGenerator from 'rn-qr-generator';
import ImagePicker from 'react-native-image-crop-picker';
import imsdk from '@/utils/IMSDK';
import {selectPhotoTapped} from '@/components/ImagePickUpload/photoCamera';
import { decode, encode } from '@/utils/common';

// class Base64 {
//   decode(str: string): string {
//     return atob(str);
//   }
// }

export default function QRCodeScanner({navigation}: any) {
  const [scanned, setScanned] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState<any>(null);
  const top = useSafeAreaInsets().top;
  const h = Dimensions.get('window').height;
  const [topY, setTopY] = useState(h * 0.2);

  useEffect(() => {
    let _topY = h * 0.2;
    const time = setInterval(() => {
      if (_topY > h * 0.8) {
        _topY = h * 0.2;
      } else {
        _topY += 3;
      }
      setTopY(_topY);
    });
    return () => {
      clearInterval(time);
    };
  }, []);

  //将参数（示例：name=1&source=qrcode）转换成json
  const formatURLParametersToJSON = (paramStr: string) => {
    let newParamStr: string = paramStr;
    if (paramStr.includes('?')) {
      newParamStr = paramStr.split('?')[1];
    }
    const params: any = {};
    const paramPairs = newParamStr.split('&');

    for (const pair of paramPairs) {
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value);
    }
    return params;
  };

  // 加入群聊
  const joinGroup = (group_id: string, group_name: string) => {
    return imsdk
      .joinGroup({
        group_id,
        remark: '',
      })
      .then(res => {
        // Toast.success('已申请加入');
        // navigation.goBack();
        navigation.replace('examine', {
          groupInfo: {
            id: group_id,
            name: group_name,
          },
        });
      });
  };

  const commonScan = result => {
    if (!scanned) {
      setScanned(true);
      const _d = formatURLParametersToJSON(result);
      if (_d.name && _d.name === 'frandchisee') {
        //跳转到加盟商
        navigation.replace(_d.name, {..._d});
      } else if (_d.name && _d.name === 'operator') {
        // 跳转到运营商
        navigation.replace(_d.name, {..._d});
      } else if (_d.type && _d.type === 'user') {
        //跳转到用户
        // `userId=${userInfo?.user_id}&type=user`
        navigation.replace('ContactAdd', {id: _d.userId});
      } else if (_d.type && +_d.type === 1) {
        // 加群
        // `${Config.VITE_APP_SITEID}://qrcode?type=1&id=${groupInfo.group_id}&name=${groupInfo.group_name}`
        joinGroup(_d.id, _d.name);
      } else {
        Alert.alert(`扫描结果:${data}`);
      }
    }
  };

  //扫码成功的回调函数
  const handleBarcodeScanned = ({data}: any) => {
    commonScan(data);
  };

  const resetScanner = () => {
    setScanned(false);
  };
  const _pickerImg = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: false,
      includeBase64: true,
    }).then(image => {
      _handleImage(image);
    });
  };

  const _handleImage = image => {
    if (image.data) {
      recoginze(image);
    }
  };

  const recoginze = async data => {
    RNQRGenerator.detect({uri:data.uri})
    .then((res) => {
      const arr = res.values;
      commonScan(arr[0]);
    })
    .catch((err) => {
      Toast.show('无效二维码')
    });
  };

  return (
    <>
      <View style={styles.container}>
        <>
          <TouchableOpacity
            activeOpacity={1}
            style={{...styles.back, top: pt(top + 10)}}
            onPress={() => {
              navigation.goBack();
            }}>
            <SvgIcon
              name="navBack"
              size={16}
              style={{
                width: pt(10),
                height: pt(16),
              }}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{...styles.btnView, top: pt(top + 10)}}
            activeOpacity={0.8}
            onPress={() => {
              selectPhotoTapped(false, {
                selectionLimit: 1,
              }).then(async (res: any) => {
                recoginze(res[0].base64);
              });
            }}>
            <Text style={styles.btnText}>相册</Text>
          </TouchableOpacity> */}
        </>
        <RNCamera
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          onBarCodeRead={handleBarcodeScanned}
        />
        {/* <Animated.View style={{...styles.line}}>
        </Animated.View> */}
        <View
          style={{
            position: 'absolute',
            top: topY,
            width: pt(340),
            left: '50%',
            marginLeft: pt(-170),
            height: pt(2),
            backgroundColor: '#37b44a',
          }}
        />
        <TouchableOpacity
          hitSlop={{right: 10, left: 10, top: 10, bottom: 10}}
          style={styles.btnView}
          // activeOpacity={0.8}
          onPress={() => {
            // _pickerImg();
            selectPhotoTapped(false, {
              selectionLimit: 1,
            }).then(async (res: any) => {
              recoginze(res[0]);
              // const dataStr = res[0].base64;
              // const baseStr = new Base64();
              // const str = baseStr.decode(dataStr);
            });
          }}>
          <Image
            source={require('../../assets/imgs/picIcon2.png')}
            style={{
              width: pt(50),
              height: pt(42),
            }}
          />
          <Text style={styles.btnText}>选择相册</Text>
        </TouchableOpacity>
        {/* <View style={{backgroundColor: 'red', pos}} /> */}

        {scanned && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText} />
            <Text style={styles.overlayButton} onPress={resetScanner}>
              扫描二维码
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  back: {
    position: 'absolute',
    left: pt(20),
    zIndex: 999,
    width: pt(30),
    height: pt(30),
    backgroundColor: '#fff',
    borderRadius: pt(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnView: {
    position: 'absolute',
    bottom: pt(60),
    right: 20,
    // width: '100%',
    flexDirection: 'column',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    marginTop: 10,
    color: '#fff',
    textAlign: 'right',
    fontSize: pt(16),
    fontWeight: 'bold',
    // borderBottomColor: '#fff',
    // borderBottomWidth: pt(1),
    paddingBottom: pt(5),
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  overlayButton: {
    color: '#3498db',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  line: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: pt(2),
    backgroundColor: '#37b44a',
  },
  imageOption: {
    width: 100,
    height: 100,
  },
});
