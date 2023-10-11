import {View, Text, Colors, Image, Assets} from 'react-native-ui-lib';
import {Modal} from 'react-native';
import React from 'react';
import {pt} from '@/utils/dimension';
import {StyleSheet, TouchableOpacity} from 'react-native';
import SvgIcon from '../SvgIcon';
import {formatUrl} from '@/utils/common';
import * as Animatable from 'react-native-animatable';
import {receiveRedpack, receiveGroupRedpack} from '@/api/wallet';
import {useNavigation} from '@react-navigation/native';
import imsdk from '@/utils/IMSDK';
import {updateMessageItem} from '@/store/reducers/conversation';
import {useDispatch} from 'react-redux';
import * as toast from '@/utils/toast';

function redPacketModal({redPacketData, setShowRedPacket}: any) {
  const dispatch = useDispatch();
  const onCancel = () => {
    setShowRedPacket({
      show: false,
      send_face_url: '',
      send_nickname: '',
      redpack_id: '',
    });
  };
  const {
    send_face_url,
    remark,
    send_nickname,
    redpack_id,
    isGroup,
    group_id,
    message,
  } = redPacketData || {};
  const [open, setOpen] = React.useState(false);
  const {navigate} = useNavigation();
  const avatar = send_face_url
    ? {uri: formatUrl(send_face_url)}
    : Assets.imgs.avatar.defalut;

  const updateMessage = () => {
    // 更新会话中的消息内容
    const {format_time, content, ...other} = message;
    const newContent = JSON.parse(content);
    newContent.status = 2;

    const messageItem = {
      ...other,
      content: JSON.stringify(newContent),
    };
    imsdk.comlink.updateMessageById(messageItem);

    // 更新当前会话的当前红包消息

    dispatch(
      updateMessageItem({
        data: messageItem,
      }),
    );

    navigate('RedPacketDetail', {
      redpack_id,
      isGroup,
      send_face_url,
      send_nickname,
    });
  };

  const receiveRed = () => {
    if (open) return;
    setOpen(true);
    if (isGroup) {
      receiveGroupRedpack({
        redpack_group_id: redpack_id,
        operation_id: new Date().getTime().toString(),
        group_id,
      })
        .then(res => {
          setOpen(false);
          onCancel();
          if (res.code === 0) {
            updateMessage();
          } else {
            if (res.code === 10158) {
              toast.info('红包已领取，请查看详情');
              updateMessage();
              return;
            }
            toast.info(res.message);
          }
        })
        .finally(() => {
          setOpen(false);
          onCancel();
        });
    } else {
      receiveRedpack({
        redpack_single_id: redpack_id,
        operation_id: new Date().getTime().toString(),
      })
        .then(res => {
          setOpen(false);
          onCancel();
          if (res.code === 0) {
            updateMessage();
          } else {
            if (res.code === 10158) {
              toast.info('红包已领取，请查看详情');
              updateMessage();
              return;
            }
            toast.info(res.message);
          }
        })
        .finally(() => {
          setOpen(false);
          onCancel();
        });
    }
  };
  return (
    <>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          zIndex: 999,
        }}>
        <View flex>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.outSideView}
            onPress={onCancel}></TouchableOpacity>
          <Modal
            animationType={'slide'}
            transparent={true}
            style={styles.modalContainer}
            statusBarTranslucent={true}>
            <View style={styles.container}>
              <View style={styles.content}></View>
              <View center style={styles.textContent}>
                <View
                  row
                  center
                  style={{
                    marginTop: pt(80),
                  }}>
                  <Image
                    source={avatar}
                    style={{
                      width: pt(30),
                      height: pt(30),
                      borderRadius: pt(3),
                      marginRight: pt(10),
                    }}></Image>
                  <Text
                    style={{
                      color: '#efa007',
                      fontWeight: 'bold',
                      fontSize: pt(18),
                    }}>
                    {send_nickname}发出的红包
                  </Text>
                </View>
                <Text
                  numberOfLines={2}
                  style={{
                    marginTop: pt(20),
                    marginLeft: pt(10),
                    MapRight: pt(10),
                    fontSize: pt(20),
                    color: '#efa007',
                    fontWeight: 'bold',
                  }}>
                  {remark || '恭喜发财，大吉大利'}
                </Text>
              </View>
              <Animatable.View
                animation={open ? 'fadeIn' : ''}
                iterationCount="infinite"
                style={{
                  position: 'absolute',
                  top: pt(310),
                  width: pt(66),
                  height: pt(66),
                  borderRadius: pt(33),
                  backgroundColor: '#efa007',
                  left: '50%',
                  marginLeft: pt(-33),
                  zIndex: 9999,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    receiveRed();
                  }}>
                  <Text
                    style={{
                      fontSize: open ? pt(12) : pt(20),
                      color: '#fff',
                      textAlign: 'center',
                      lineHeight: pt(66),
                    }}>
                    {open ? '请等待...' : '开'}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
              {/* <View
                style={{
                  position: 'absolute',
                  top: pt(310),
                  width: pt(66),
                  height: pt(66),
                  borderRadius: pt(33),
                  backgroundColor: '#efa007',
                  left: '50%',
                  marginLeft: pt(-33),
                  zIndex: 9999,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    receiveRed();
                  }}>
                  <Text
                    style={{
                      fontSize: pt(20),
                      color: '#fff',
                      textAlign: 'center',
                      lineHeight: pt(66),
                    }}>
                    {open ? '...' : '开'}
                  </Text>
                </TouchableOpacity>
              </View> */}
            </View>
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.8}
              style={{
                width: '100%',
                position: 'absolute',
                zIndex: 9999,
                top: pt(626),
                left: '50%',
                marginLeft: pt(-20),
              }}>
              <SvgIcon name="close" size={pt(40)}></SvgIcon>
            </TouchableOpacity>
          </Modal>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: pt(300),
    height: pt(420),
    left: '50%',
    marginLeft: pt(-150),
    top: '50%',
    marginTop: pt(-220),
    flexDirection: 'column',
    backgroundColor: '#e34621',
    borderRadius: pt(10),
    paddingBottom: 30,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
  },
  header: {
    marginTop: pt(20),
    width: '100%',
  },
  title: {
    fontSize: pt(13),
    textAlign: 'center',
  },
  content: {
    width: '100%',
    height: pt(340),
    borderWidth: pt(1),
    borderBottomRightRadius: pt(150),
    borderBottomLeftRadius: pt(150),
    elevation: 1.5,
    shadowColor: 'red',
    borderColor: 'red',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    flexDirection: 'column',

    alignItems: 'center',
  },
  textContent: {
    position: 'absolute',
    width: '100%',
  },
  outSideView: {
    backgroundColor: 'rgba(0,0,0,.4)',
    flex: 1,
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

const RedPacketModal = React.memo(redPacketModal, (pre, next) => {
  return true;
});
export default RedPacketModal;
