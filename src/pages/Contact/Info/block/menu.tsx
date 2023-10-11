import {useEffect, useState, useCallback} from 'react';
import {View, Text, Icon, Image, TextField} from 'react-native-ui-lib';
import {DeviceEventEmitter} from 'react-native';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {Toast} from '@ant-design/react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Popup} from '@/components';
import FullButton from '@/components/FullButton';
import ListMenuItem from '@/components/ListMenuItem';
import {tagFetchFriend, tagAddFriend} from '@/api/label';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {ConfirmModal} from '@/components';
import {
  updateConversationItem,
  checkoutConversation,
  updateCurrentMessageList,
} from '@/store/reducers/conversation';

export default function Menu(props) {
  const {userInfo} = props;
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [currentTag, setCurrentTag] = useState({});
  const {navigate} = useNavigation();
  const [visible, setVisible] = useState(false);
  const [remarkVisible, setRemarkVisible] = useState(false);
  const [recordVisible, setRecordVisible] = useState(false);
  const [text, setText] = useState('');
  const [remarkText, setRemarkText] = useState('');
  const selfInfo = useSelector(
    (state: RootState) => state.user.selfInfo,
    shallowEqual,
  );
  const conversationList = useSelector(
    (state: RootState) => state.conversation.conversationList,
    shallowEqual,
  );
  const currentConversation = useSelector<RootState, IMSDK.Conversation>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );

  const init = () => {
    tagFetchFriend({
      user_id: userInfo.user_id,
      operation_id: `${Date.now()}`,
    }).then((res: any) => {
      setCurrentTag(res?.List?.[0] || {});
    });
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    DeviceEventEmitter.addListener('selectTag', data => {
      const selecteds = data.selecteds;
      if (selecteds && Object.keys(selecteds).length) {
        const tag_id = selecteds[Object.keys(selecteds)[0]]?.tag_id;
        tagAddFriend({
          user_id: userInfo.user_id,
          operation_id: `${Date.now()}`,
          tag_id,
        }).then(() => {
          init();
        });
      }
    });
    return () => {
      DeviceEventEmitter.removeAllListeners('selectTag');
    };
  }, []);

  const onConfirm = () => {
    if (!text) {
      Toast.info(t('请输入需要提交的内容'));
      return;
    }
    setVisible(false);
    Toast.info(t('提交成功'));
    setText('');
  };

  const onRemarkConfirm = () => {
    if (!remarkText) {
      Toast.info(t('请输入备注内容'));
      return;
    }
    imsdk
      .addFriendRemark({
        user_id: userInfo?.user_id,
        remark: remarkText,
      })
      .then((res: any) => {
        setRemarkVisible(false);
        userInfo.remark = remarkText;
        Toast.info(t('备注成功'));
        setRemarkText('');
        // 还需要修改会话列表的备注
        const user_id_1 =
          Number(userInfo.user_id) > Number(selfInfo.user_id)
            ? selfInfo.user_id
            : userInfo.user_id;
        const user_id_2 =
          Number(userInfo.user_id) > Number(selfInfo.user_id)
            ? userInfo.user_id
            : selfInfo.user_id;
        imsdk.comlink.updateConversationName(
          `${user_id_1}_${user_id_2}`,
          remarkText,
        );
      })
      .catch(res => {
        Toast.info(t('备注失败'));
      });
  };

  return (
    <>
      <View
        style={{
          marginTop: pt(10),
          borderTopWidth: pt(5),
          borderTopColor: '#F7F8FC',
        }}>
        <ListMenuItem
          label={t('设置标签')}
          onPress={() => {
            navigate('label', {source: 'ContactInfo', isSingle: true});
          }}
          rightText={currentTag?.title}
        />
        <ListMenuItem
          label={t('设置备注')}
          onPress={() => {
            setRemarkVisible(true);
          }}
          rightText={userInfo?.remark}
        />
        <ListMenuItem
          label={t('投诉建议')}
          onPress={() => {
            setVisible(true);
          }}
        />
        <ListMenuItem
          border="none"
          label={t('清空聊天记录')}
          onPress={() => {
            setRecordVisible(true);
            // const user_id = selfInfo.user_id;
            // const conv_id = [userInfo?.user_id, user_id].sort((a, b) => a - b).join('_');
            // console.log(conv_id, 'conv_id');
            //imsdk.deleteLocalMessage([], conv_id);
            //Toast.info(t('聊天记录已清空'))
          }}
        />
      </View>
      <View
        style={{
          borderTopWidth: pt(5),
          borderTopColor: '#F7F8FC',
        }}>
        <ListMenuItem
          label={t('朋友圈')}
          onPress={() => {
            navigate('userFriendIndex', {userInfo});
          }}
          rightContent={
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/748837/pexels-photo-748837.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
              }}
              width={pt(44)}
              height={pt(44)}
            />
          }
        />
        {/* <ListMenuItem border="none" label={t('更多信息')} onPress={() => {}} /> */}
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
              {t('投诉建议')}
            </Text>
            <View
              style={{
                marginBottom: pt(20),
              }}>
              <TextField
                value={text}
                onChangeText={e => {
                  setText(e);
                }}
                multiline={true}
                numberOfLines={2}
                style={{
                  height: pt(90),
                }}
                placeholder="填写投诉建议内容"
              />
            </View>
            <FullButton
              text={t('提交')}
              onPress={onConfirm}
              disabled={!text.trim()}
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
        <Popup
          visible={remarkVisible}
          onDismiss={() => {
            setRemarkVisible(false);
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
              {t('备注')}
            </Text>
            <View
              style={{
                marginBottom: pt(20),
              }}>
              <TextField
                value={remarkText}
                onChangeText={e => {
                  setRemarkText(e);
                }}
                style={{
                  height: pt(20),
                }}
                placeholder="填写备注内容"
              />
            </View>
            <FullButton
              text={t('提交')}
              onPress={onRemarkConfirm}
              disabled={!remarkText.trim()}
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
        <ConfirmModal
          title={t('清空聊天记录')}
          content={t('确定清空聊天记录吗?')}
          showClose
          visible={recordVisible}
          onClose={() => {
            setRecordVisible(false);
          }}
          onConfirm={async () => {
            setRecordVisible(false);

            const conv_id = [userInfo.user_id, selfInfo.user_id]
              .sort((a, b) => a - b)
              .join('_');

            // 更新redux会话列表
            const arr = conversationList.filter(
              item => item.conversation_id === conv_id,
            );
            if (arr.length) {
              dispatch(
                updateConversationItem({
                  data: {
                    ...arr[0],
                    latest_message: '',
                    unread_count: 0,
                    msg: {},
                  },
                }),
              );
            }

            if (
              currentConversation &&
              currentConversation.conversation_id == conv_id
            ) {
              dispatch(updateCurrentMessageList({data: []}));
            }

            // 更新本地数据库会话列表
            const {data} = await imsdk.comlink.getConversationById(conv_id);
            if (data && data[0]) {
              imsdk.comlink.updateConversationById({
                ...data[0],
                latest_message: '',
                unread_count: 0,
              });
            }

            // 本地消息列表修改状态
            imsdk.modifyMessageStatus(conv_id);

            Toast.info(t('聊天记录已清空'));
          }}
        />
      </View>
    </>
  );
}
