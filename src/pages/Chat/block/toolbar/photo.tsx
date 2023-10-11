import {VirtualizedList} from 'react-native';
import {View, Text, RadioButton, Button} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import { useEffect } from 'react';

// export default function Photo() {
//   const {t} = useTranslation();
//   return (
//     <View>
//       <View>
//         <VirtualizedList
//           horizontal
//           initialNumToRender={4}
//           renderItem={({item}) => (
//             <View
//               style={{
//                 marginLeft: pt(15),
//                 width: pt(115),
//                 height: pt(190),
//                 backgroundColor: 'gray',
//               }}>
//               <View
//                 top
//                 right
//                 style={{
//                   marginTop: pt(10),
//                   marginRight: pt(10),
//                 }}>
//                 <RadioButton value={null} color="#BCBCBC" />
//               </View>
//             </View>
//           )}
//           keyExtractor={item => item.id}
//           getItemCount={(_data: unknown) => 50}
//           getItem={(
//             _data: unknown,
//             index: number,
//           ): {id: string; title: string} => ({
//             id: Math.random().toString(12).substring(0),
//             title: `Item ${index + 1}`,
//           })}
//         />
//       </View>
//       <View row>
//         <View
//           flex
//           row
//           centerV
//           spread
//           style={{
//             paddingLeft: pt(16),
//             paddingRight: pt(50),
//           }}>
//           <Text
//             style={{
//               fontSize: pt(16),
//               color: '#222222',
//             }}>
//             {t('相册')}
//           </Text>
//           <Text
//             style={{
//               fontSize: pt(16),
//               color: '#999999',
//             }}>
//             {t('编辑')}
//           </Text>
//           <RadioButton
//             value={null}
//             label={t('原图')}
//             color="#BCBCBC"
//             labelStyle={{
//               marginLeft: pt(5),
//               fontSize: pt(16),
//               color: '#222222',
//             }}
//           />
//         </View>
//         <Button
//           label={t('确定')}
//           borderRadius={0}
//           backgroundColor="#7581FF"
//           style={{
//             width: pt(133),
//             height: pt(50),
//           }}
//         />
//       </View>
//     </View>
//   );
// }


/**
 * 直接获取相册图片
 */


export default function Photo() {
  useEffect(() => {
    
  },[])
}




