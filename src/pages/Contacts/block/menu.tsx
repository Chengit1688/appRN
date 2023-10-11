import {View, Text, Icon, ListItem, Image} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';

export default function Menu() {
  const {t} = useTranslation();
  const {navigate} = useNavigation();

  return (
    <View>
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(90)}
        onPress={() => {
          navigate({name: 'GroupChatList'} as never);
        }}
        style={{
          borderTopColor: '#F1F1F1',
          borderTopWidth: pt(0.5),
          borderBottomColor: '#F1F1F1',
          borderBottomWidth: pt(0.5),
        }}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <View
            style={{
              width: pt(40),
              height: pt(40),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#7581FF',
              borderRadius: 50,
            }}>
            <Icon
              assetName="groupchat"
              assetGroup="page.contact"
              size={pt(22)}
            />
          </View>
        </ListItem.Part>

        <ListItem.Part middle row>
          <ListItem.Part
            middle
            column
            containerStyle={{
              marginLeft: pt(14),
              marginRight: pt(14),
            }}>
            <Text
              style={{
                color: '#222222',
                fontSize: pt(14),
                fontWeight: 'bold',
              }}>
              {t('已保存的群聊')}
            </Text>
          </ListItem.Part>
          <ListItem.Part
            containerStyle={{
              marginRight: pt(34),
            }}>
            <Image
              assetName="next"
              assetGroup="icons.app"
              style={{
                width: pt(6.5),
                height: pt(10),
              }}
            />
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    </View>
  );
}
