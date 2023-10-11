import {useState} from 'react';
import {View, Text, Icon, Image, Avatar} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';

import ListMenuItem from '@/components/ListMenuItem';

export default function Menu() {
  const {t} = useTranslation();

  const {navigate} = useNavigation();

  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <View
        style={{
          marginTop: pt(10),
          borderTopWidth: pt(5),
          borderTopColor: '#F7F8FC',
        }}>
        <ListMenuItem
          label={t('设置备注和标签')}
          onPress={() => {
            navigate('ContactTag');
          }}
        />
      </View>
      <View
        style={{
          borderTopWidth: pt(5),
          borderTopColor: '#F7F8FC',
        }}>
        <ListMenuItem
          border="none"
          label={t('朋友圈')}
          onPress={() => {}}
          rightContent={
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/748837/pexels-photo-748837.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
              }}
              width={pt(44)}
              height={pt(44)}
            />
          }
        />
      </View>
    </>
  );
}
