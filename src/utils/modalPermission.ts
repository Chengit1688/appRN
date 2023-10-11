/**弹出提示权限设置 */
import {Modal} from '@ant-design/react-native';
import {t} from 'i18next';
import {Linking, Platform, NativeModules} from 'react-native';
import {Colors} from 'react-native-ui-lib';

export default function modalPermission({
  tipContent = '相机、麦克风、媒体',
}: {
  tipContent?: string;
}) {
  Modal.alert(
    t('提示'),
    t(`需要获取${tipContent}等权限，请前往设置->应用管理->止正Talk->权限设置`),
    [
      {
        text: '取消',
        onPress: () => {},
      },
      {
        text: '前去设置',
        onPress: () => {
          if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
          } else {
            NativeModules.OpenSettings.openNetworkSettings((data: any) => {
              console.log('_____call back data', data);
            });
          }
        },
        style: {
          color: Colors.red30,
        },
      },
    ],
  );
}
