import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Avatar, Colors, ListItem, Icon} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import {Empty, Navbar} from '@/components';
import headerRight from '@/components/HeaderRight/button';
import {formatUrl} from '@/utils/common';
import {getTagDetail} from '@/api/label';
import FullButton from '@/components/FullButton';

export default function LabelContacts(props) {
  const info = props.route.params.info;
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (info.tag_id) {
      getTagDetail({
        operation_id: `${Date.now()}`,
        id: info.tag_id,
      }).then(res => {
        setUserList(res.list || []);
      });
    }
  }, [info]);

  return (
    <>
      <Navbar
        title={info.title}
        rtght={headerRight({
          text: '完成',
          onPress: () => {},
        })}
      />
      {!userList?.length && <Empty />}
      {!!userList?.length && (
        <View
          style={{
            backgroundColor: Colors.white,
            minHeight: '100%',
            padding: pt(20),
          }}>
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
                    name={item.nick_name}
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
                    {item.nick_name}
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
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: pt(24),
        }}>
        <FullButton
          text="添加好友"
          style={{
            marginBottom: 0,
          }}
          onPress={() => {
            // submit();
          }}
        />
      </View>
    </>
  );
}
