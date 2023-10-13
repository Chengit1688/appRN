import React, {useEffect, useState} from 'react';
import {ScrollView, TextInput} from 'react-native';
import {
  Text,
  Icon,
  ListItem,
  Colors,
  Avatar,
  View,
  TextField,
} from 'react-native-ui-lib';
import {Picker} from '@ant-design/react-native';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {Navbar, PopupPicker, Popup} from '@/components';
import FullButton from '@/components/FullButton';
import {selectPhotoTapped} from '@/components/ImagePickUpload/photoCamera';

export default function Menu(props: any) {
  const {userInfo, setUserInfo} = props;
  const {t} = useTranslation();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState(userInfo?.signatures || '');

  useEffect(() => {
    setText(userInfo?.signatures || '');
  }, [userInfo]);

  return (
    <>
      <Navbar title="用户信息" />
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
              }}
            />
            <ListItem.Part
              containerStyle={{
                marginRight: pt(16),
              }}>
              <Avatar
                onPress={() => {
                  selectPhotoTapped().then((res: any) => {
                    if (res?.[0]?.url) {
                      setUserInfo({
                        ...userInfo,
                        face_url: res?.[0]?.thumbnail,
                        big_face_url: res?.[0]?.url,
                      });
                    }
                  });
                }}
                containerStyle={{}}
                {...{
                  name: userInfo?.nick_name,
                  size: pt(50),
                  source: {
                    uri: userInfo?.face_url,
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
              }}
            />
            <ListItem.Part
              containerStyle={{
                marginRight: pt(16),
              }}>
              <TextInput
                placeholder={t('请输入昵称')}
                style={{
                  color: '#222222',
                  fontSize: pt(14),
                  height: pt(54),
                  textAlign: 'right',
                }}
                value={userInfo?.nick_name}
                onChangeText={text => {
                  setUserInfo({
                    ...userInfo,
                    nick_name: text,
                  });
                }}
              />
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>

        <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(54)}
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
              <Picker
                style={{flex: 1, height: pt(20)}}
                data={[
                  {
                    label: t('男'),
                    value: 1,
                  },
                  {
                    label: t('女'),
                    value: 2,
                  },
                ]}
                cols={1}
                value={userInfo?.gender}
                onChange={e => {
                  setUserInfo({
                    ...userInfo,
                    gender: e[0],
                  });
                }}>
                <Text
                  style={{
                    textAlign: 'right',
                    color: '#222222',
                    fontSize: pt(14),
                  }}>
                  {userInfo?.gender === 2 ? t('女') : t('男')}
                </Text>
              </Picker>
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
              {t('年龄')}
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
              <TextInput
                placeholder={t('请输入年龄')}
                style={{
                  color: '#222222',
                  fontSize: pt(14),
                  height: pt(54),
                  textAlign: 'right',
                }}
                value={`${userInfo?.age}`}
                onChangeText={text => {
                  const newText = text.replace(/[^\d]+/, '');
                  setUserInfo({
                    ...userInfo,
                    age: newText ? +newText : '',
                  });
                }}
              />
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
        <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(54)}
          containerStyle={{}}
          style={{
            borderTopWidth: pt(1),
            borderTopColor: '#F7F7F7',
          }}
          onPress={() => {
            setVisible(true);
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
              <View
                row
                style={{
                  justifyContent: 'flex-end',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'right',
                    color: '#999999',
                    fontSize: pt(14),
                    maxWidth: pt(200),
                  }}>
                  {userInfo?.signatures}
                </Text>
              </View>
            </ListItem.Part>
            <ListItem.Part
              containerStyle={{
                marginRight: pt(16),
              }}>
              <Icon assetName="next" assetGroup="icons.app" size={pt(10)} />
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>

        {/* <ListItem
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
                {userInfo?.invite_code}
              </Text>
            </ListItem.Part>
            <ListItem.Part
              containerStyle={{
                marginRight: pt(16),
              }}>
              <Icon
                onPanel={() => {}}
                assetName="copy"
                assetGroup="icons.app"
                style={{
                  width: pt(10),
                  height: pt(11),
                }}
              />
            </ListItem.Part>
          </ListItem.Part>
        </ListItem> */}
        {/* <PopupPicker
          title="性别"
          visible={visible}
          numberOfVisibleRows={3}
          value={userInfo?.gender}
          sections={[
            {
              label: '男',
              value: 0,
            },
            {
              label: '女',
              value: 1,
            },
          ]}
          onCancel={() => {
            setVisible(false);
          }}
          onChange={e => {}}
        /> */}
      </ScrollView>
      <Popup
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}>
        <View
          style={{
            borderRadius: pt(10),
            backgroundColor: '#fff',
            padding: pt(15),
            width: pt(300),
          }}>
          <Text
            style={{
              fontSize: pt(15),
              fontWeight: 'bold',
              color: '#000',
              marginBottom: pt(20),
            }}>
            {t('签名')}
          </Text>
          <View
            style={{
              marginBottom: pt(20),
            }}>
            <TextField
				autoCapitalize='none'
				autoComplete='off'
				autoCorrect={false}
              value={text}
              onChangeText={e => {
                setText(e);
              }}
              multiline={true}
              numberOfLines={2}
              style={{
                height: pt(90),
              }}
              placeholder="填写签名内容"
            />
          </View>
          <FullButton
            text={t('提交')}
            onPress={() => {
              setVisible(false);
              setUserInfo({
                ...userInfo,
                signatures: text,
              });
            }}
            style={{
              width: pt(270),
              marginLeft: 0,
              marginTop: pt(20),
              marginBottom: pt(0),
              marginRight: 0,
            }}
          />
        </View>
      </Popup>
    </>
  );
}
