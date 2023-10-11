import {ReactElement} from 'react';
import {View, Constants, TouchableOpacity} from 'react-native-ui-lib';
import {Portal} from '@gorhom/portal';

export default function Modal({
  children,
  transparent,
  onDismiss,
}: {
  children: ReactElement;
  transparent?: boolean;
  onDismiss?: () => void;
}) {
  const viewDiffStyle = transparent ? {} : {backgroundColor: 'rgba(0,0,0,0.4)'};

  const onPress = () => {
    onDismiss && onDismiss();
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: Constants.windowWidth,
        height: Constants.windowHeight,
        ...viewDiffStyle,
      }}>
      <TouchableOpacity activeOpacity={1} flex center onPress={onPress}>
        {children}
      </TouchableOpacity>
    </View>
  );
}
