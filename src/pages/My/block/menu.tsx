import {useState} from 'react';
import {View, Text, Icon, Image, ListItem, Switch} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import {SvgIcon} from '@/components';
import {useSelector, shallowEqual} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import {Toast} from '@ant-design/react-native';

export default function Menu() {
  const {t} = useTranslation();

  const {navigate} = useNavigation();

  const [darkMode, setDarkMode] = useState(false);

  const selfInfo = useSelector(
    (state: any) => state.user.selfInfo,
    shallowEqual,
  );

  return (
    <View>
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(60)}
        onPress={() => {
          if (!selfInfo?.self_invite_code) return;
          Clipboard.setString(selfInfo?.self_invite_code || '');
          Toast.info(t('复制成功'));
        }}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <SvgIcon name="invite" size={pt(20)} />
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
                fontSize: pt(16),
                fontWeight: 'bold',
              }}>
              {t('个人邀请码')}
            </Text>
          </ListItem.Part>
          <ListItem.Part
            containerStyle={{
              marginRight: pt(34),
            }}>
            <Text>{selfInfo?.self_invite_code || ''}</Text>
            <SvgIcon name="copy" size={pt(20)} />
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(60)}
        onPress={() => navigate({name: 'UserCollect'} as never)}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <Icon assetName="collect" assetGroup="page.my" size={pt(20)} />
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
                fontSize: pt(16),
                fontWeight: 'bold',
              }}>
              {t('我的收藏')}
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
      {/* <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(60)}
        onPress={() => navigate({name: 'UserPrivacy'} as never)}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <Icon assetName="privacy" assetGroup="page.my" size={pt(20)} />
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
                fontSize: pt(16),
                fontWeight: 'bold',
              }}>
              {t('隐私管理')}
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
      </ListItem> */}
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(60)}
        onPress={() => navigate({name: 'Security'} as never)}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <Icon assetName="security" assetGroup="page.my" size={pt(20)} />
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
                fontSize: pt(16),
                fontWeight: 'bold',
              }}>
              {t('安全中心')}
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
      {/* <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(80)}
        onPress={() => {}}
        style={{
          borderWidth: pt(1),
          borderColor: '#F7F7F7',
        }}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <Icon assetName="colorscheme" assetGroup="page.my" size={pt(20)} />
        </ListItem.Part> */}

        {/* <ListItem.Part middle row> */}
          {/* <ListItem.Part
            middle
            column
            containerStyle={{
              marginLeft: pt(14),
              marginRight: pt(14),
            }}>
            <Text
              style={{
                color: '#222222',
                fontSize: pt(16),
                fontWeight: 'bold',
              }}>
              {t('深色模式')}
            </Text>
          </ListItem.Part> */}
          {/* <ListItem.Part
            containerStyle={{
              marginRight: pt(34),
            }}>
            <Switch
              value={darkMode}
              onValueChange={() => setDarkMode(!darkMode)}
            />
          </ListItem.Part> */}
        {/* </ListItem.Part> */}
      {/* </ListItem> */}
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(60)}
        onPress={() => navigate({name: 'Setting'} as never)}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <Icon assetName="setting" assetGroup="page.my" size={pt(20)} />
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
                fontSize: pt(16),
                fontWeight: 'bold',
              }}>
              {t('设置')}
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
