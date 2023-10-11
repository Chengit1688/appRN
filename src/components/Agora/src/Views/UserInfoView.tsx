import React, {useContext} from 'react';
import RtmContext from '../Contexts/RtmContext';
import PropsContext, {UidInterface} from '../Contexts/PropsContext';
import {StyleSheet, Text, View} from 'react-native';

const UserInfo: React.FC<{user: UidInterface; style?: React.CSSProperties}> = (
  props,
) => {
  const {usernames} = useContext(RtmContext);
  const {rtcProps, styleProps} = useContext(PropsContext);
  const {user} = props;

  return rtcProps?.videoPlaceholder && rtcProps.enableVideo ? (
    <View>
        <Text style={{ color:"#fff"}}>用户头像</Text>
    </View>
  ) : (
    <React.Fragment />
  );
};

const styles = StyleSheet.create({
  username: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#007bffaa',
    color: '#fff',
    margin: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
});

export default UserInfo;
