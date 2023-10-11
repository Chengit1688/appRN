import {useState, useMemo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useRoute, useNavigation} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import {Toast} from '@ant-design/react-native';
import {pt} from '@/utils/dimension';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {checkoutConversation} from '@/store/reducers/conversation';
import {RootState} from '@/store';
import SearchInput from '@/components/SearchInput';
import ContactIndexList from '@/components/ContactIndexList';
import GroupIndexList from '@/components/GroupIndexList';
import FullButton from '@/components/FullButton';
import Header from '@/components/Header';

type selectedType = {
  [key: string]: boolean;
};

const DATA = [
  {
    id: 1,
    label: '联系人',
  },
  {
    id: 2,
    label: '群组',
  },
];

export default function ForwardChat(props: any) {
  const {t} = useTranslation();
  const {goBack} = useNavigation();
  const dispatch = useDispatch();
  const {params, name} = useRoute();
  const {msgs} = params;

  const [searchKey, setSearchKey] = useState('');
  const [selecteds, setSelecteds] = useState<selectedType>({});
  const [currentTabId, setCurrentTabId] = useState(1);
  const ContactList = useSelector(
    (state: any) => state.contacts.friendList,
    shallowEqual,
  );
  const groupList: any = useSelector<any>(
    state => state.contacts.groupList,
    shallowEqual,
  );
  const currentConversation = useSelector(
    (state: RootState) => state.conversation.currentConversation,
    shallowEqual,
  );

  const isGroup = useMemo(() => {
    return 1 !== currentTabId;
  }, [currentTabId]);

  const list = useMemo(() => {
    if (searchKey.length) {
      const list = (isGroup ? groupList : ContactList).filter(item => {
        const name = isGroup ? item.name : item.nick_name;
        return name.toLowerCase().includes(searchKey.toLowerCase());
      });
      return list;
    } else {
      return isGroup ? groupList : ContactList;
    }
  }, [ContactList, searchKey, isGroup]);
  const selfInfo = useSelector(
    (state: RootState) => state.user.selfInfo,
    shallowEqual,
  );

  const sendMessage = async () => {
    const conv_type = currentTabId;
    const uid = isGroup ? 'group_id' : 'user_id';
    const uname = isGroup ? 'name' : 'nick_name';
    const user_idArr = Object.keys(selecteds);
    const user_list = list;
    const selected_user_List = user_list.filter((item: any) =>
      user_idArr.includes(item[uid]),
    );
    // const message_list = selected_user_List.map((item:any) => {
    //   let v = {};
    //   v['client_msg_id'] = uuid.v4();
    //   v['recv_id'] = item[uid];
    //   v['nick_name'] = item[uname];
    //   return v;
    // });
    // msgs.map((msg:any) => {
    // 	imsdk.multiSendMessage({
    // 		content: msg.content,
    // 		type: msg.type,
    // 		conversation_type: conv_type,
    // 		message_list: message_list
    // 	}).then((res) => {
    // 		console.log('multiSendMessage ok------')
    // 		if(currentConversation?.conversation_id) {
    // 			dispatch(checkoutConversation(currentConversation.conversation_id))
    // 		}
    // 		goBack();
    // 	}).catch(err => {
    // 		console.log('multiSendMessage err---', err)
    // 	});
    // });

    const message_list: any = [];
    msgs.map((msg: any) => {
      selected_user_List.map((user: any) => {
        message_list.push({
          client_msg_id: uuid.v4(),
          recv_id: user[uid],
          send_id: selfInfo.user_id,
          send_face_url: selfInfo.face_url,
          nick_name: user[uname],
          conversation_type: conv_type,
          type: msg.type,
          content: msg.content,
        });
      });
    });
    if (!message_list.length) {
      return;
    }

    imsdk
      .forwardSendMessage(message_list)
      .then(res => {
        Toast.info(t('转发成功'));
        if (currentConversation?.conversation_id) {
          dispatch(checkoutConversation(currentConversation.conversation_id));
        }
        goBack();
      })
      .catch(err => {
        Toast.info(t('请求错误，转发失败'));
      });
  };

  return (
    <>
      <Header title={t('请选择')} />
      <View
        row
        centerV
        style={{
          paddingTop: pt(15),
          justifyContent: 'center',
        }}>
        {DATA.map((item, idx) => {
          const viewDiffStyle =
            item.id === currentTabId
              ? {
                  paddingBottom: pt(10),
                  borderBottomWidth: pt(2),
                  borderBottomColor: '#7581FF',
                }
              : {};
          const textDiffStyle =
            item.id === currentTabId
              ? {fontSize: pt(16), fontWeight: 'bold', color: '#7581FF'}
              : {fontSize: pt(14), color: '#666666'};
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={1}
              onPress={() => {
                setCurrentTabId(item.id);
                setSearchKey('');
                setSelecteds({});
              }}
              style={{...viewDiffStyle, marginHorizontal: pt(10)}}>
              <Text style={{...textDiffStyle}}>{t(item.label)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View flex>
        <SearchInput
          placeholder={t('搜索')}
          style={{
            margin: pt(16),
            marginBottom: 0,
          }}
          value={searchKey}
          onChange={(keyword: string) => {
            setSearchKey(keyword);
          }}
        />
        {isGroup ? (
          <GroupIndexList
            source={list}
            selecteds={selecteds}
            onSelected={val => {
              setSelecteds(val);
            }}
          />
        ) : (
          <ContactIndexList
            source={list}
            selecteds={selecteds}
            onSelected={val => {
              setSelecteds(val);
            }}
          />
        )}
        <FullButton text={t('发送')} onPress={sendMessage} />
      </View>
    </>
  );
}
