import {ScrollView} from 'react-native';
import {Text, Image, ListItem, Colors, Switch} from 'react-native-ui-lib';
import {Picker} from '@ant-design/react-native';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {useEffect, useState} from 'react';
import {Navbar} from '@/components';
import {getPrivacy, setPrivacy} from '@/api/user';

export default function Menu() {
  const {t} = useTranslation();
  const [privacyData, setPrivacyData] = useState<any>({});
  useEffect(() => {
    getPrivacy({}).then(res => {
      setPrivacyData(res || {});
    });
  }, []);

  const setData = async (data: any) => {
    const newData = {
      ...privacyData,
      ...data,
    };
    setPrivacyData(newData);

    const res = await setPrivacy({
      data: newData,
      operation_id: Date.now().toString(),
    });
  };

  return (
    <>
      <Navbar title="隐私设置" />
      <ScrollView
        style={{
          backgroundColor: Colors.white,
        }}>
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
              {t('我的上线时间')}
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
              <Picker
                style={{flex: 1, height: pt(20)}}
                data={[
                  {
                    label: t('可见'),
                    value: 1,
                  },
                  {
                    label: t('不可见'),
                    value: 2,
                  },
                ]}
                cols={1}
                value={privacyData?.is_show_online_time}
                onChange={e => {
                  setData({
                    is_show_online_time: e[0],
                  });
                }}>
                <Text
                  style={{
                    textAlign: 'right',
                    color: '#999999',
                    fontSize: pt(14),
                  }}>
                  {privacyData?.is_show_online_time === 1
                    ? t('可见')
                    : t('不可见')}
                </Text>
              </Picker>
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
        </ListItem>

        <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(65)}
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
              {t('需要好友验证')}
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
              <Switch
                value={privacyData?.is_friend_verify === 1}
                onValueChange={() => {
                  setData({
                    is_friend_verify:
                      privacyData?.is_friend_verify === 1 ? 2 : 1,
                  });
                }}
              />
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>

        <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(65)}
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
              {t('允许手机号搜索')}
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
              <Switch
                value={privacyData?.is_mobile_search === 1}
                onValueChange={() => {
                  setData({
                    is_mobile_search:
                      privacyData?.is_mobile_search === 1 ? 2 : 1,
                  });
                }}
              />
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>

        <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(65)}
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
              {t('允许ID搜索')}
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
              <Switch
                value={privacyData?.is_id_search === 1}
                onValueChange={() => {
                  setData({
                    is_id_search: privacyData?.is_id_search === 1 ? 2 : 1,
                  });
                }}
              />
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>

        <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(65)}
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
              {t('允许群来源的加好友')}
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
              <Switch
                value={privacyData?.is_from_group_friend === 1}
                onValueChange={() => {
                  setData({
                    is_from_group_friend:
                      privacyData?.is_from_group_friend === 1 ? 2 : 1,
                  });
                }}
              />
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>

        {/* <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(65)}
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
              {t('允许昵称搜索')}
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
              <Switch
                value={privacyData?.is_nickname_search === 1}
                onValueChange={() => {
                  setData({
                    is_nickname_search:
                      privacyData?.is_nickname_search === 1 ? 2 : 1,
                  });
                }}
              />
            </ListItem.Part>
          </ListItem.Part>
        </ListItem> */}

        <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(65)}
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
              {t('消息来时振动')}
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
              <Switch
                value={privacyData?.is_message_vibrate === 1}
                onValueChange={() => {
                  setData({
                    is_message_vibrate:
                      privacyData?.is_message_vibrate === 1 ? 2 : 1,
                  });
                }}
              />
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      </ScrollView>
    </>
  );
}
