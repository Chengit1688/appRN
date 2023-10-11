import {ScrollView} from 'react-native';
import {Text, Icon, ListItem, Colors, Avatar} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';

export default function Menu() {
  const {t} = useTranslation();

  return (
    <ScrollView
      style={{
        backgroundColor: Colors.white,
      }}>
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(90)}
        onPress={() => {}}
        containerStyle={{}}
        style={{}}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(16),
          }}>
          <Text
            style={{
              color: '#222222',
              fontSize: pt(15),
              fontWeight: 'bold',
            }}>
            {t('头像')}
          </Text>
        </ListItem.Part>

        <ListItem.Part middle row>
          <ListItem.Part
            middle
            column
            containerStyle={{
              marginLeft: pt(14),
              marginRight: pt(14),
            }}></ListItem.Part>
          <ListItem.Part
            containerStyle={{
              marginRight: pt(16),
            }}>
            <Avatar
              containerStyle={{}}
              {...{
                name: '张三',
                size: pt(50),
                source: {
                  uri: 'https://randomuser.me/api/portraits/women/24.jpg',
                },
              }}
            />
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>

      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(54)}
        onPress={() => {}}
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
            {t('昵称')}
          </Text>
        </ListItem.Part>

        <ListItem.Part middle row>
          <ListItem.Part
            middle
            column
            containerStyle={{
              marginLeft: pt(14),
              marginRight: pt(14),
            }}></ListItem.Part>
          <ListItem.Part
            containerStyle={{
              marginRight: pt(16),
            }}>
            <Text
              style={{
                color: '#222222',
                fontSize: pt(14),
              }}>
              {t('王大强')}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>

      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(54)}
        onPress={() => {}}
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
            {t('性别')}
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
                color: '#222222',
                fontSize: pt(14),
              }}>
              {t('男')}
            </Text>
          </ListItem.Part>
          <ListItem.Part
            containerStyle={{
              marginRight: pt(16),
            }}>
            <Icon assetName="next" assetGroup="icons.app" size={pt(10)} />
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>

      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(54)}
        onPress={() => {}}
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
            {t('生日')}
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
              {t('完善信息')}
            </Text>
          </ListItem.Part>
          <ListItem.Part
            containerStyle={{
              marginRight: pt(16),
            }}>
            <Icon assetName="next" assetGroup="icons.app" size={pt(10)} />
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>

      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(54)}
        onPress={() => {}}
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
            {t('居住地')}
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
              {t('某某省某某市某某区')}
            </Text>
          </ListItem.Part>
          <ListItem.Part
            containerStyle={{
              marginRight: pt(16),
            }}>
            <Icon assetName="next" assetGroup="icons.app" size={pt(10)} />
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>

      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(54)}
        onPress={() => {}}
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
            {t('签名')}
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
              {t('还没有签名哦~')}
            </Text>
          </ListItem.Part>
          <ListItem.Part
            containerStyle={{
              marginRight: pt(16),
            }}>
            <Icon assetName="next" assetGroup="icons.app" size={pt(10)} />
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>

      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(54)}
        onPress={() => {}}
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
            {t('邀请码')}
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
                color: '#333333',
                fontSize: pt(14),
              }}>
              {t('w9eui36')}
            </Text>
          </ListItem.Part>
          <ListItem.Part
            containerStyle={{
              marginRight: pt(16),
            }}>
            <Icon assetName="copy" assetGroup="icons.app" size={pt(12)} />
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    </ScrollView>
  );
}
