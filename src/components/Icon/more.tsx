import {ViewStyle} from 'react-native';
import {View, Icon, TextField, Image} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';

export default function More({white}: {white?: boolean}) {
  if (white) {
    return (
      <View
        row
        style={{
          width: pt(20),
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Image
          assetName="voice_w_1"
          assetGroup="icons.app"
          style={{
            width: pt(4),
            height: pt(18),
          }}
        />
        <Image
          assetName="voice_w_1"
          assetGroup="icons.app"
          style={{
            width: pt(4),
            height: pt(18),
          }}
        />
        <Image
          assetName="voice_w_1"
          assetGroup="icons.app"
          style={{
            width: pt(4),
            height: pt(18),
          }}
        />
      </View>
    );
  }

  return (
    <View
      row
      style={{
        width: pt(20),
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      <Image
        assetName="voice_1"
        assetGroup="icons.app"
        style={{
          width: pt(4),
          height: pt(18),
        }}
      />
      <Image
        assetName="voice_1"
        assetGroup="icons.app"
        style={{
          width: pt(4),
          height: pt(18),
        }}
      />
      <Image
        assetName="voice_1"
        assetGroup="icons.app"
        style={{
          width: pt(4),
          height: pt(18),
        }}
      />
    </View>
  );
}
