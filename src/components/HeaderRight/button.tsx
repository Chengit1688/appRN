import {Text, TouchableOpacity} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';

export default function Button({
  onPress,
  text,
  disabled,
}: {
  onPress: () => void;
  text?: string;
  disabled?: boolean;
}) {
  const {t} = useTranslation();
  return (
    <TouchableOpacity
      center
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        marginRight: pt(0),
        paddingLeft: pt(10),
        paddingRight: pt(10),
        minWidth: pt(60),
        minHeight: pt(30),
        borderRadius: pt(4),
        backgroundColor: '#7581FF',
        opacity: disabled ? 0.5 : 1,
      }}>
      <Text
        style={{
          fontSize: pt(14),
          color: '#FFFFFF',
        }}>
        {text ? text : t('完成')}
      </Text>
    </TouchableOpacity>
  );
}
