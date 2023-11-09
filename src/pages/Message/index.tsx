import {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  Icon,
  TouchableOpacity,
  SkeletonView,
  ListItem,
  Image,
} from 'react-native-ui-lib';
import {Animated, Easing} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {BoxShadow} from 'react-native-shadow';
import {useLatest} from 'ahooks';

import {pt} from '@/utils/dimension';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {RootState} from '@/store';
import {updateConversationItem} from '@/store/reducers/conversation';
import {updateUnreadCount} from '@/store/reducers/conversation';
import Modal from '@/components/Modal';
import Header from '@/components/Header';
import SearchInput from '@/components/SearchInput';
import Main from './block/main';

import {StyleSheet} from 'react-native';
import _ from 'lodash';
import Avatar from '@/components/Avatar';
import {checkMultiplePermissions} from '@/utils/allPermissions';

const DATA = [
  {
    key: 'scan',
    label: '扫一扫',
  },
  {
    key: 'addfriend',
    label: '加好友',
  },
  {
    key: 'groupchat',
    label: '发起群聊',
  },
];

export default function Message() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {setOptions, navigate} = useNavigation();
  const [showHint, setShowHint] = useState(false);
  const [searchKey, setSearchKey] = useState('');

  const onMenuPress = (key: string) => {
    switch (key) {
      case 'scan':
        navigate('scanQRcode');
        break;
      case 'addfriend':
        navigate('AddFriends');
        break;
      case 'groupchat':
        navigate('GroupChatStart');
        break;
    }
  };
  //  const hasPermission = async () => {
  //   try {}
  //   await audioRecorderPlayer.startRecorder(path, audioSet);
  //  }

  //   // 获取相册权限
  useEffect(() => {
    checkMultiplePermissions();
  }, []);

  const headerRight = () => {
    return (
      <TouchableOpacity
        center
        activeOpacity={0.8}
        onPress={() => {
          setShowHint(true);
        }}
        style={{
          paddingLeft: pt(16),
          paddingRight: pt(16),
          minHeight: pt(30),
        }}>
        <Icon assetName="add" assetGroup="page.message" size={pt(18)} />
      </TouchableOpacity>
    );
  };

  const renderMenu = () => {
    if (!showHint) {
      return null;
    }
    return (
      <Modal transparent onDismiss={() => setShowHint(false)}>
        <View
          style={{
            position: 'absolute',
            top: pt(0),
            right: pt(16),
          }}>
          <BoxShadow
            setting={{
              width: pt(115), // 与子元素高一致
              height: pt(175), // 与子元素宽一致
              color: '#000', // 阴影颜色
              border: pt(10), // 阴影宽度
              radius: pt(10), // 与子元素圆角一致
              opacity: 0.02, // 透明
              x: pt(0), // 偏移量
              y: pt(0),
            }}>
            <View
              style={{
                padding: pt(5),
                paddingLeft: pt(16),
                paddingRight: pt(16),
                backgroundColor: '#FFFFFF',
              }}>
              {DATA.map(({key, label}, idx) => {
                const border =
                  idx === DATA.length - 1
                    ? {}
                    : {
                        borderBottomWidth: pt(0.5),
                        borderBottomColor: '#E9E9E9',
                      };
                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setShowHint(false);
                      onMenuPress(key);
                    }}
                    key={key}
                    row
                    centerV
                    style={{
                      paddingTop: pt(17),
                      paddingBottom: pt(17),
                      ...border,
                    }}>
                    <Icon
                      assetName={key}
                      assetGroup="page.message"
                      size={pt(20)}
                    />
                    <Text
                      style={{
                        marginLeft: pt(8),
                        fontSize: pt(14),
                        fontWeight: 'bold',
                        color: '#222222',
                      }}>
                      {t(label)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </BoxShadow>
        </View>
      </Modal>
    );
  };

  const conversationList = useSelector(
    (state: RootState) => state.conversation.conversationList,
    shallowEqual,
  );
  const lastConversationList = useLatest(conversationList);
  const lastConversationListSort = useMemo(() => {
    const temp = [...lastConversationList.current];
    return temp.sort((a, b) => {
      if (a.is_topchat === 1 && b.is_topchat === 2) {
        return -1; // a在b前面
      } else if (a.is_topchat === 2 && b.is_topchat === 1) {
        return 1; // b在a前面
      } else {
        // 如果两者都是topchat或者都不是，再按照send_time排序
        const sendTimeA = a.msg?.send_time || 0;
        const sendTimeB = b.msg?.send_time || 0;
        return sendTimeB - sendTimeA; // 按照send_time降序排序
      }
    });
  }, [lastConversationList.current]);

  useEffect(() => {
    let unreadCount = 0;
    lastConversationListSort.map((conv: IMSDK.Conversation) => {
      unreadCount += conv?.unread_count || 0;
    });

    dispatch(updateUnreadCount({unreadCount: unreadCount}));
  }, [lastConversationListSort]);

  const currentMessageAtList = useSelector(
    (state: RootState) => state.conversation.conversationAtList,
    shallowEqual,
  );

  // const [messageList, setMessageList] = useState<any>([]);

  // const getMessageList = () => {
  //   if (searchKey.length) {
  //     const list = lastConversationListSort.filter(conv => {
  //       const info =
  //         conv.type === 1
  //           ? conv.user || {}
  //           : conv.type === 2
  //           ? conv.group || {}
  //           : {};
  //       const name =
  //         conv.type === 1 ? info?.remark || info?.nick_name : info?.name;
  //       return name.toLowerCase().includes(searchKey.toLowerCase());
  //     });
  //     const lastConversationList = list.filter(
  //       (item: any) => item.latest_message,
  //     );
  //     const newLast = lastConversationList.map((item, index) => {
  //       if (
  //         currentMessageAtList.some(
  //           (atItem: any) => atItem.conversation_id === item.conversation_id,
  //         )
  //       ) {
  //         return {
  //           ...item,
  //           at: true,
  //         };
  //       }
  //       return item;
  //     });
  //     // return newLast;
  //     setMessageList(newLast);

  //     // return list.filter((item: any) => item.latest_message);
  //   } else {
  //     let lastConversationList = lastConversationListSort.filter(
  //       (item: any) => item.latest_message,
  //     );

  //     const newLast = lastConversationList.map((item, index) => {
  //       if (
  //         currentMessageAtList.some(
  //           (atItem: any) => atItem.conversation_id === item.conversation_id,
  //         )
  //       ) {
  //         return {
  //           ...item,
  //           at: true,
  //         };
  //       }
  //       return item;
  //     });

  //     // return newLast;
  //     setMessageList(newLast);
  //   }
  // };

  // useEffect(() => {
  //   getMessageList();
  // }, [lastConversationListSort, searchKey, currentMessageAtList]);

  const messageList = useMemo(() => {
    if (searchKey.length) {
      const list = lastConversationListSort.filter(conv => {
        const info =
          conv.type === 1
            ? conv.user || {}
            : conv.type === 2
            ? conv.group || {}
            : {};
        const name =
          conv.type === 1 ? info?.remark || info?.nick_name : info?.name;
        return name.toLowerCase().includes(searchKey.toLowerCase());
      });
      const lastConversationList = list.filter(
        (item: any) => item.latest_message,
      );
      const newLast = lastConversationList.map((item, index) => {
        if (
          currentMessageAtList.some(
            (atItem: any) => atItem.conversation_id === item.conversation_id,
          )
        ) {
          return {
            ...item,
            at: true,
          };
        } else {
          return {
            ...item,
            at: false,
          };
        }
      });

      return newLast;

      // return list.filter((item: any) => item.latest_message);
    } else {
      let lastConversationList = lastConversationListSort.filter(
        (item: any) => item.latest_message,
      );

      const newLast = lastConversationList.map((item, index) => {
        if (
          currentMessageAtList.some(
            (atItem: any) => atItem.conversation_id === item.conversation_id,
          )
        ) {
          return {
            ...item,
            at: true,
          };
        } else {
          return {
            ...item,
            at: false,
          };
        }
      });

      return newLast;
    }
  }, [lastConversationListSort, searchKey, currentMessageAtList]);
  const animationValue = new Animated.Value(0);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  };
  startAnimation();
  const skeletonStyle = {
    opacity: animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 0.5],
    }),
  };


  // console.log('messageList====>>>',messageList)

  return (
    <>
      <Header titleLeft title="消息" right={headerRight()} />
      <View flex>
        <SearchInput
          placeholder={t('搜索会话')}
          style={{
            margin: pt(16),
            marginBottom: 0,
          }}
          onChange={(keyword: string) => {
            setSearchKey(keyword);
          }}
        />
        {/* <View style={styles.skeletonContainer}>
          {_.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], (item, index) => {
            return (
              <Animated.View style={[styles.skeletonItem, skeletonStyle]}>
                <View style={styles.avatar}></View>
                <View></View>
              </Animated.View>
            );
          })}
        </View> */}
        <Main source={messageList} />
        {showHint ? renderMenu() : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    margin: pt(18),
  },
  avatar: {
    width: pt(40),
    height: pt(40),
    borderRadius: pt(20),
  },
  skeletonItem: {
    flexDirection: 'row',
    width: '100%',
    height: pt(30),
    marginTop: 20,
    backgroundColor: '#E0E0E0', // Placeholder color
    borderRadius: 4,
  },
});
