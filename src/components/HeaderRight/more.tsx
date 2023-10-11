import {Text, TouchableOpacity} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import IconMore from '@/components/Icon/more';

export default function More({
  onPress,
  white,
}: {
  onPress: () => void;
  white?: boolean;
}) {
  const {t} = useTranslation();
  return (
    <TouchableOpacity
      center
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        paddingLeft: pt(16),
        paddingRight: pt(16),
        minHeight: pt(30),
      }}>
      <IconMore />
    </TouchableOpacity>
  );
}
