import {ScrollView} from 'react-native';
import {Text, Icon, ListItem, Colors, Switch, Image} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Navbar} from '@/components';
import {useState} from 'react';
import {RootState} from '@/store';

export default function Menu() {
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const selfInfo = useSelector(
    (state: RootState) => state.user.selfInfo,
    shallowEqual,
  );

  return (
    <>
      <Navbar title="安全中心" />
      <ScrollView
        style={{
          backgroundColor: Colors.white,
        }}>
        <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(54)}
          onPress={() => {
            // navigate({name: 'ModifyPhone'} as never);
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
              {t('手机号')}
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
                {selfInfo.phone_number}
              </Text>
            </ListItem.Part>
            {/* <ListItem.Part
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
            </ListItem.Part> */}
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
              {t('ID')}
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
                {selfInfo.user_id}
              </Text>
            </ListItem.Part>
            {/* <ListItem.Part
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
            </ListItem.Part> */}
          </ListItem.Part>
        </ListItem>

        <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(54)}
          onPress={() => {
            navigate({name: 'ModifyPassword'} as never);
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
              {t('账号密码')}
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
        <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(54)}
          onPress={() => {
            navigate({name: 'realName'} as never);
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
              {t('实名认证')}
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
        <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(54)}
          onPress={() => {
            navigate({name: 'setPayPassword'} as never);
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
              {t('修改支付密码')}
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
      </ScrollView>
    </>
  );
}
