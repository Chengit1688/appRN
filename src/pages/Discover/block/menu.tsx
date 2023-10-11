import {View, Text, Icon, ListItem, Image, Badge} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '@/store';

export default function Menu(props: any) {
  const {navigation} = props;
  const remindCircle = useSelector(
    (state: RootState) => state.global.remindCiircle,
    shallowEqual,
  );
  const {t} = useTranslation();
  return (
    <View>
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(60)}
        onPress={() => navigation.navigate('circleFirends')}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <Icon assetName="friends" assetGroup="page.discover" size={pt(20)} />
        </ListItem.Part>

        <ListItem.Part middle row>
          <ListItem.Part
            middle
            row
            containerStyle={{
              marginLeft: pt(14),
              marginRight: pt(14),
            }}>
            <View row>
              <Text
                style={{
                  color: '#222222',
                  fontSize: pt(16),
                  fontWeight: 'bold',
                }}>
                {t('朋友圈')}
              </Text>
              {remindCircle.length > 0 ? (
                <Badge
                  style={{marginLeft: pt(10)}}
                  label={remindCircle.length}
                  size={16}
                  backgroundColor="red"
                />
              ) : null}
            </View>
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
      <View
        style={{
          height: pt(10),
          backgroundColor: '#F7F8FC',
        }}
      />

      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(60)}
        onPress={() => navigation.navigate('news')}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <Icon assetName="news" assetGroup="page.discover" size={pt(20)} />
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
              {t('新闻')}
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
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(60)}
        onPress={() => navigation.navigate('signIn')}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <Icon assetName="signin" assetGroup="page.discover" size={pt(20)} />
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
              {t('签到')}
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
      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(60)}
        onPress={() => navigation.navigate('party')}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <Icon assetName="eatplay" assetGroup="page.discover" size={pt(20)} />
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
              {t('吃喝玩乐')}
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
      <View
        style={{
          height: pt(10),
          backgroundColor: '#F7F8FC',
        }}
      />

      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(60)}
        onPress={() => {
          navigation.navigate('operator');
        }}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <Icon assetName="operator" assetGroup="page.discover" size={pt(20)} />
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
              {t('运营商')}
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

      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(60)}
        onPress={() => navigation.navigate('frandchisee')}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <Icon
            assetName="franchisee"
            assetGroup="page.discover"
            size={pt(20)}
          />
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
              {t('加盟商')}
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

      <ListItem
        activeBackgroundColor={'#F8F9FF'}
        activeOpacity={1}
        height={pt(60)}
        onPress={() => navigation.navigate('scanQRcode')}>
        <ListItem.Part
          left
          containerStyle={{
            marginLeft: pt(34),
          }}>
          <Icon assetName="scan" assetGroup="page.discover" size={pt(20)} />
        </ListItem.Part>

        <ListItem.Part
          middle
          row
          onPress={() => navigation.navigate('scanQRcode')}>
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
              {t('扫一扫')}
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
