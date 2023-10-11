import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeGenerator = ({ value, size = 200 }: { value: string | undefined, size?: number}) => {
  return (
    <View>
      <QRCode
        value={value}
        size={size}
      />
    </View>
  );
};

export default QRCodeGenerator;