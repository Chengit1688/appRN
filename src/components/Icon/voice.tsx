import {ViewStyle} from 'react-native';
import {View, Icon, TextField, Image} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import {useEffect, useMemo, useRef, useState} from 'react';
import * as Animatable from 'react-native-animatable';

export default function Voice({
  white,
  isPlay,
}: {
  white?: boolean;
  isPlay?: boolean;
}) {
  // const imagePath = white
  //   ? require('@/assets/icons/voice.png')
  //   : require('@/assets/icons/voice.png');
  const imagePath = require('@/assets/icons/voice.png');
  const imagePathAct = require('@/assets/icons/voice_act.gif');
  const [imgUri, setImgUri] = useState(imagePath);

  useEffect(() => {
    const url = isPlay ? imagePathAct : imagePath;
    setImgUri(url);
  }, [isPlay]);

  // const imgUri = useMemo(() => {
  //   console.log(isPlay, 'isPlay===>123');
  //   return isPlay ? imagePathAct : imagePath;
  // }, [isPlay]);

  // if (white) {
  //   return (
  //     <View row>
  //       <Image
  //         source={imgUri}
  //         style={{
  //           width: pt(20),
  //           height: pt(20),
  //         }}
  //       />
  //     </View>
  //   );
  // }
  // return (
  //   <View row>
  //     <Image
  //       source={imagePath}
  //       style={{
  //         width: pt(18),
  //         height: pt(18),
  //       }}
  //     />
  //   </View>
  // );

  return (
    <View row>
      <Image
        source={imgUri}
        style={{
          width: pt(18),
          height: pt(18),
        }}
      />
    </View>
  );
}
