import {
  View,
  Constants,
  LoaderScreen,
  TouchableOpacity,
  Colors,
} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';

import Modal from '../Modal';

export default function Loading() {
  const {t} = useTranslation();

  const onPress = () => {
    console.debug(123123);
  };



  return (
    <Modal transparent>
      <View
        center
        style={{
          width: pt(100),
          height: pt(100),
          borderRadius: pt(10),
          backgroundColor: '#4C4C4C',
        }}>
        <LoaderScreen color={Colors.white} />
      </View>
    </Modal>
  );
}
