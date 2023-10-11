import {useState} from 'react';
import {ScrollView} from 'react-native';
import {Text, Icon, ListItem, Colors, Image} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import {ConfirmModal} from '@/components';

export default function Menu() {
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const [visible, setVisible] = useState(false);

  return (
    <ScrollView
      style={{
        backgroundColor: Colors.white,
      }}>
      {/* <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(54)}
        onPress={() => {
          navigate({name: 'ChatFont'} as never);
        }}
        containerStyle={{}}
        style={{
          borderTopWidth: pt(1),
          borderTopColor: '#F7F7F7',
        }}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(17),
          }}>
          <Text
            style={{
              color: '#222222',
              fontSize: pt(15),
              fontWeight: 'bold',
            }}>
            {t('聊天字体')}
          </Text>
        </ListItem.Part>

        <ListItem.Part middle row>
          <ListItem.Part
            middle
            column
            containerStyle={{
              marginLeft: pt(14),
              marginRight: pt(14),
            }}
          />
          <ListItem.Part
            containerStyle={{
              marginRight: pt(16),
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
      </ListItem> */}

      {/* <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(54)}
        onPress={() => {
          setVisible(true);
        }}
        containerStyle={{}}
        style={{
          borderTopWidth: pt(1),
          borderTopColor: '#F7F7F7',
        }}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(17),
          }}>
          <Text
            style={{
              color: '#222222',
              fontSize: pt(15),
              fontWeight: 'bold',
            }}>
            {t('清除缓存')}
          </Text>
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
                textAlign: 'right',
                color: '#999999',
                fontSize: pt(14),
              }}>
              {t('461.15MB')}
            </Text>
          </ListItem.Part>
          <ListItem.Part
            containerStyle={{
              marginRight: pt(16),
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
      </ListItem> */}

      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(54)}
        onPress={() => {
          navigate({name: 'AboutUs'} as never);
        }}
        containerStyle={{}}
        style={{
          borderTopWidth: pt(1),
          borderTopColor: '#F7F7F7',
        }}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(17),
          }}>
          <Text
            style={{
              color: '#222222',
              fontSize: pt(15),
              fontWeight: 'bold',
            }}>
            {t('关于我们')}
          </Text>
        </ListItem.Part>

        <ListItem.Part middle row>
          <ListItem.Part
            middle
            column
            containerStyle={{
              marginLeft: pt(14),
              marginRight: pt(14),
            }}
          />
          <ListItem.Part
            containerStyle={{
              marginRight: pt(16),
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

      <ConfirmModal
        title={t('清空缓存')}
        content={t('确定清空所有缓存吗?')}
        showClose
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onConfirm={() => {
          setVisible(false);
        }}
      />
    </ScrollView>
  );
}
