import {Image, TouchableOpacity} from 'react-native-ui-lib';
import {useNavigation} from '@react-navigation/native';
import {pt} from '@/utils/dimension';

export default function HeaderLeft({onPress}: {onPress?: () => void}) {
  const {goBack} = useNavigation();
  return (
    <TouchableOpacity
      center
      activeOpacity={0.8}
      onPress={() => {
        onPress ? onPress() : goBack();
      }}
      style={{
        paddingLeft: pt(16),
        paddingRight: pt(16),
        minHeight: pt(30),
      }}>
      <Image
        assetName="back"
        assetGroup="icons.app"
        style={{
          width: pt(10),
          height: pt(16),
        }}
      />
    </TouchableOpacity>
  );
}
