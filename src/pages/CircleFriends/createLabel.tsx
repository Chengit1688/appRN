import {pt} from '@/utils/dimension';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {
  Avatar,
  Button,
  Colors,
  Icon,
  ListItem,
  Text,
  TextField,
  View,
} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import FullButton from '@/components/FullButton';
import {Navbar, Empty} from '@/components';
import {addTag, updateTag, getTagDetail} from '@/api/label';
import {useNavigation} from '@react-navigation/native';
import {formatUrl} from '@/utils/common';

export default function CreateLabel(props: any) {
  const id = props.route?.params?.id;
  const currentTitle = props.route?.params?.title;
  const {t} = useTranslation();
  const [title, setTitle] = useState(currentTitle || '');
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const {navigate, goBack} = useNavigation();
  useEffect(() => {
    DeviceEventEmitter.addListener('setUserData', data => {
      // 接收到 update 页发送的通知，后进行的操作内容
      setUserList(data?.data || []);
    });
    return () => {
      DeviceEventEmitter.removeAllListeners('setUserData');
    };
  }, []);

  useEffect(() => {
    if (id) {
      getTagDetail({
        operation_id: `${Date.now()}`,
        id,
      }).then(res => {
        // setTitle(res.title);
        setUserList(res.list || []);
      });
    }
  }, [id]);

  const submit = async () => {
    setLoading(true);
    if (loading) {
      return;
    }
    try {
      if (id) {
        updateTag({
          operation_id: `${Date.now()}`,
          title,
          user_id: userList.map(item => item.user_id) || [],
          tag_id: id,
        }).then(res => {
          goBack();
        });
        return;
      }
      addTag({
        operation_id: `${Date.now()}`,
        title,
        user_id: userList.map(item => item.user_id) || [],
      }).then(res => {
        goBack();
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <>
      <Navbar title={id ? '标签详情' : '新建标签'} />
      <View
        style={{
          minHeight: Dimensions.get('screen').height,
          backgroundColor: Colors.white,
          position: 'relative',
        }}>
        <View
          style={{
            padding: pt(20),
          }}>
          <Text
            style={{
              color: Colors.color222,
              fontSize: pt(14),
              marginTop: pt(10),
            }}>
            {t('标签名称')}
          </Text>
          <TextField
            style={{
              marginTop: pt(20),
              fontSize: pt(13),
              paddingBottom: pt(15),
              borderBottomWidth: pt(0.5),
              borderBottomColor: '#E7E7EF',
            }}
            placeholder={t('填写标签名称 (2~15个字)')}
            value={title}
            onChangeText={setTitle}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: pt(20),
            }}>
            <Text
              style={{
                color: Colors.color222,
                fontSize: pt(14),
                flex: 1,
              }}>
              {t('添加标签成员')}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                navigate({
                  name: 'SelectContact',
                  params: {
                    selectData: userList.reduce((obj, item) => {
                      obj[item.user_id] = true;
                      return obj;
                    }, {}),
                  },
                } as never);
              }}>
              <Icon
                assetName="add_active"
                assetGroup="icons.app"
                size={pt(16)}
              />
              <Text
                style={{
                  fontSize: pt(12),
                  color: '#7581FF',
                  fontWeight: 500,
                  marginLeft: pt(5),
                }}>
                {t('添加成员')}
              </Text>
            </TouchableOpacity>
          </View>
          {userList.map((item: any) => {
            return (
              <ListItem style={{marginTop: pt(5)}} key={item.user_id}>
                <ListItem.Part
                  left
                  containerStyle={{
                    marginLeft: pt(5),
                  }}>
                  <Avatar
                    size={pt(40)}
                    name={item.nick_name || item.nickname}
                    source={{
                      uri: formatUrl(item.face_url),
                    }}
                  />
                </ListItem.Part>
                <ListItem.Part
                  middle
                  containerStyle={{
                    marginLeft: pt(15),
                    flex: 1,
                  }}>
                  <Text style={{color: Colors.colors222, fontSize: pt(14)}}>
                    {item.nick_name || item.nickname}
                  </Text>
                </ListItem.Part>
                <ListItem.Part
                  right
                  containerStyle={{
                    marginLeft: pt(15),
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setUserList(
                        userList.filter(i => i.user_id !== item.user_id),
                      );
                    }}>
                    <Icon
                      assetName="del_red"
                      assetGroup="page.friends"
                      size={pt(16)}
                    />
                  </TouchableOpacity>
                </ListItem.Part>
              </ListItem>
            );
          })}
          {!userList.length && (
            <View style={{height: pt(300)}}>
              <Empty tip={t('暂无成员')} />
            </View>
          )}
          {/* <ListItem style={{marginTop: pt(5)}}>
            <ListItem.Part
              left
              containerStyle={{
                marginLeft: pt(5),
              }}>
              <Avatar
                size={pt(40)}
                source={{
                  uri: 'https://static.pexels.com/photos/60628/flower-garden-blue-sky-hokkaido-japan-60628.jpeg',
                }}
              />
            </ListItem.Part>
            <ListItem.Part
              middle
              containerStyle={{
                marginLeft: pt(15),
                flex: 1,
              }}>
              <Text style={{color: Colors.colors222, fontSize: pt(14)}}>
                Auneo Marinir Space
              </Text>
            </ListItem.Part>
            <ListItem.Part
              right
              containerStyle={{
                marginLeft: pt(15),
              }}>
              <Icon
                assetName="del_red"
                assetGroup="page.friends"
                size={pt(16)}
              />
            </ListItem.Part>
          </ListItem> */}
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: pt(24),
        }}>
        <FullButton
          disabled={loading}
          text="完成"
          style={{
            marginBottom: 0,
          }}
          onPress={() => {
            submit();
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
