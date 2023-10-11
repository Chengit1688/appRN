import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, Colors, TouchableOpacity, Image} from 'react-native-ui-lib';
import {FlatList, Linking} from 'react-native';
import Video from 'react-native-video';
import {useTranslation} from 'react-i18next';
import SearchInput from '@/components/SearchInput';
import {Empty, Navbar} from '@/components';
import {pt} from '@/utils/dimension';
import {useDebounceFn} from 'ahooks';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import ContactIndexList from '@/components/ContactIndexList';
import ContactItem from '@/components/ContactItem';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import dayjs from 'dayjs';
import {formatUrl} from '@/utils/common';
import {formatFileSize} from '@/utils/format';
import moment from 'moment';
import _ from 'lodash-es';

interface MessageLabel {
  // 便于rc-virtual-list设置key
  client_msg_id: string;
  label?: string;
}

const DATA = [
  //   {
  //     id: 1,
  //     label: '全部',
  //   },
  {
    id: 0,
    label: '群成员',
  },
  {
    id: 3,
    label: '图片',
  },
  {
    id: 5,
    label: '视频',
  },
  {
    id: 10,
    label: '链接',
  },
  {
    id: 6,
    label: '文件',
  },
];
const Months = dayjs.months();

export default function ChatRecords(props: any) {
  const groupInfo = props.route.params.groupInfo || {};
  const {t} = useTranslation();
  const [searchVal, setSearchVal] = useState('');
  const currentConversation = useSelector<RootState, IMSDK.Conversation>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );

  const [currentId, setCurrentId] = useState(0);
  const [messageList, setMessageList] = useState<any[]>([]);

  const {run} = useDebounceFn(
    async keyword => {
      setMessageList([]);
      const r = await imsdk.comlink.searchMessageByContentAndConversationId(
        keyword.trim(),
        currentId,
        currentConversation.conversation_id,
      );

      if (r?.data?.length) {
        let list = (r.data as IMSDK.Message[]).sort(
          (a, b) => b.send_time - a.send_time,
        );
        list = list.filter(msg => ![2, 3, -97, -99].includes(msg.status));
        // if (currentId !== 1) {
        //   const d = groupBy(list, _ => Months[dayjs(_.send_time).month()]);
        //   if (currentId === 3) {
        //     (list as unknown as MessageImageProps[]) = Object.entries(d)
        //       .flat()
        //       .map(_ =>
        //         Array.isArray(_)
        //           ? chunk(_, 4)
        //           : {
        //               client_msg_id: _,
        //               label: Months[dayjs().month()] === _ ? t('本月') : _,
        //             },
        //       )
        //       .flat()
        //       .map(_ =>
        //         Array.isArray(_)
        //           ? {client_msg_id: _[0].client_msg_id, data: _}
        //           : _,
        //       );
        //   }
        //   if (currentId === 6) {
        //     list = Object.entries(d)
        //       .flat()
        //       .map(_ =>
        //         Array.isArray(_)
        //           ? _
        //           : {
        //               client_msg_id: _,
        //               label: Months[dayjs().month()] === _ ? t('本月') : _,
        //             },
        //       )
        //       .flat() as any;
        //   }
        // }
        setMessageList(list);
      }
    },
    {
      wait: 300,
    },
  );

  useEffect(() => {
    if (currentId !== 0) {
      run(currentId === 1 || currentId === 3 ? searchVal : '');
    }
  }, [currentId]);

  const [adminList, setAdminList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [memberList, setMemberList] = useState([]);

  useEffect(() => {
    // 缺少分页
    imsdk
      .getGroupMemberList({
        group_id: groupInfo.group_id,
        page: 1,
        page_size: 100,
      })
      .then(res => {
        const list: any = res.list || [];
        setMemberList(list);
        // setAdminList(
        //   list.filter(
        //     (item: any) => item.role === 'admin' || item.role === 'owner',
        //   ),
        // );
        // setStaffList(list.filter((item: any) => item.role === 'user'));
      });
  }, []);

  const resultMemberList = useMemo(() => {
    const keyword = searchVal.trim().toLowerCase();
    if (keyword.length) {
      const list = memberList.filter(member => {
        const name = (member.remark || member.nick_name).toLowerCase();
        return name.includes(keyword);
      });
      return list;
    } else {
      return memberList;
    }
  }, [memberList, searchVal]);

  const renderSearch = (currentId: number) => {
    if (currentId == 3 || currentId == 5) {
      return null;
    }
    return (
      <SearchInput
        placeholder={t('搜索')}
        style={{
          margin: pt(16),
          marginBottom: 0,
        }}
        value={searchVal}
        onChange={_.debounce((val: string) => {
          if (currentId !== 0) {
            run(val);
          }
          setSearchVal(val);
        }, 200)}
      />
    );
  };

  const renderContent = (currentId: number) => {
    let content = null;
    if (!messageList.length && currentId != 0) {
      return (
        <View style={{height: pt(400)}}>
          <Empty />
        </View>
      );
    }
    switch (currentId) {
      //   //全部
      //   case 1:
      //     content = (
      //       <FlatList
      //         key={currentId}
      //         style={{flex: 1}}
      //         data={messageList}
      //         contentContainerStyle={{
      //           padding: pt(16),
      //           paddingVertical: pt(32),
      //         }}
      //         renderItem={({item, index, separators}) => {
      //           const content = item.content ? JSON.parse(item.content) : {};
      //           return (
      //             <View key={index} row style={{marginBottom: pt(15)}}></View>
      //           );
      //         }}></FlatList>
      //     );
      //     break;
      // 文件
      case 6:
        content = (
          <FlatList
            key={currentId}
            style={{flex: 1}}
            data={messageList}
            contentContainerStyle={{
              padding: pt(16),
              paddingVertical: pt(32),
            }}
            renderItem={({item, index, separators}) => {
              const content = item.content ? JSON.parse(item.content) : {};
              return (
                <View key={index} row style={{marginBottom: pt(15)}}>
                  <Image
                    assetName="file"
                    assetGroup="icons.app"
                    style={{
                      width: pt(46),
                      height: pt(46),
                    }}
                  />
                  <View style={{marginLeft: pt(11)}}>
                    <Text
                      style={{
                        fontSize: pt(15),
                        color: '#5B5B5B',
                        fontWeight: '500',
                        marginBottom: pt(13),
                      }}>
                      {content?.file_info?.file_name}
                    </Text>
                    <View row>
                      <Text
                        style={{
                          fontSize: pt(12),
                          color: '#999',
                        }}>
                        {item?.send_time
                          ? moment(item.send_time).format('YYYY-MM-DD HH:ss')
                          : ''}
                      </Text>
                      <Text
                        style={{
                          fontSize: pt(12),
                          color: '#999',
                          marginLeft: pt(8),
                        }}>
                        {item.send_nickname}
                      </Text>
                      <Text
                        style={{
                          fontSize: pt(12),
                          color: '#999',
                          marginLeft: pt(8),
                        }}>
                        {formatFileSize(content.file_size)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        );
        break;
      // 链接
      case 10:
        content = (
          <FlatList
            key={currentId}
            style={{flex: 1}}
            data={messageList}
            contentContainerStyle={{
              padding: pt(16),
              paddingVertical: pt(32),
            }}
            renderItem={({item, index, separators}) => {
              const content = item.content ? JSON.parse(item.content) : {};
              return (
                <View key={index} row style={{marginBottom: pt(15)}}>
                  <View style={{marginLeft: pt(11)}}>
                    <Text
                      underline={true}
                      onPress={() => {
                        Linking.openURL(content.text);
                      }}
                      style={{
                        fontSize: pt(15),
                        //color: '#5B5B5B',
                        color: Colors.blue10,
                        fontWeight: '500',
                        marginBottom: pt(13),
                      }}>
                      {content.text}
                    </Text>
                    <View row>
                      <Text
                        style={{
                          fontSize: pt(12),
                          color: '#999',
                        }}>
                        {item?.send_time
                          ? moment(item.send_time).format('YYYY-MM-DD HH:ss')
                          : ''}
                      </Text>
                      <Text
                        style={{
                          fontSize: pt(12),
                          color: '#999',
                          marginLeft: pt(8),
                        }}>
                        {item.send_nickname}
                      </Text>
                      <Text
                        style={{
                          fontSize: pt(12),
                          color: '#999',
                          marginLeft: pt(8),
                        }}>
                        {formatFileSize(content.file_size)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        );
        break;
      // 视频
      case 5:
        content = (
          <FlatList
            key={currentId}
            style={{flex: 1}}
            numColumns={4}
            data={messageList}
            contentContainerStyle={{
              padding: pt(4),
              paddingVertical: pt(32),
            }}
            renderItem={({item, index, separators}) => {
              const content = item.content ? JSON.parse(item.content) : {};
              let url =
                content.video_info?.thumb_url ?? content.video_info?.image_url;
              if (url) {
                url = formatUrl(url);
              }
              return (
                <View
                  key={index}
                  style={{
                    marginHorizontal: pt(2),
                    width: pt(88),
                    height: pt(88),
                    borderRadius: pt(6),
                    backgroundColor: '#F7F8FC',
                  }}>
                  <Video
                    source={{uri: url}}
                    paused
                    muted
                    resizeMode="cover"
                    style={{
                      width: pt(88),
                      height: pt(88),
                      borderRadius: pt(6),
                    }}
                  />
                </View>
              );
            }}
          />
        );
        break;
      // 图片
      case 3:
        content = (
          <FlatList
            key={currentId}
            style={{flex: 1}}
            numColumns={4}
            data={messageList}
            contentContainerStyle={{
              padding: pt(4),
              paddingVertical: pt(32),
            }}
            renderItem={({item, index, separators}) => {
              const content = item.content ? JSON.parse(item.content) : {};
              let url =
                content.image_info?.thumb_url ?? content.image_info?.image_url;
              if (url) {
                url = formatUrl(url);
              }
              return (
                <View
                  key={index}
                  style={{
                    marginHorizontal: pt(2),
                    width: pt(88),
                    height: pt(88),
                    borderRadius: pt(6),
                    backgroundColor: '#F7F8FC',
                  }}>
                  <Image
                    source={{uri: url}}
                    style={{
                      width: pt(88),
                      height: pt(88),
                      borderRadius: pt(6),
                    }}
                  />
                </View>
              );
            }}
          />
        );
        break;
      // 群成员
      case 0:
        content = (
          <ContactIndexList
            source={resultMemberList}
            // header={
            // 	<View>
            // 	  <Text
            // 		style={{
            // 		  marginTop: pt(25),
            // 		  marginBottom: pt(10),
            // 		  marginHorizontal: pt(24),
            // 		  fontSize: pt(15),
            // 		  color: '#B1B1B2',
            // 		}}>
            // 		{t('群主、管理员')}
            // 	  </Text>
            // 	  {adminList.map((item: any) => {
            // 		return (
            // 		  <ContactItem
            // 			key={item.id}
            // 			contact={{
            // 			  name: item.nick_name,
            // 			  avatar: formatUrl(item.face_url),
            // 			}}
            // 		  />
            // 		);
            // 	  })}

            // 	  <Text
            // 		style={{
            // 		  marginTop: pt(25),
            // 		  marginBottom: pt(10),
            // 		  marginHorizontal: pt(24),
            // 		  fontSize: pt(15),
            // 		  color: '#B1B1B2',
            // 		}}>
            // 		{t('群成员')}
            // 	  </Text>
            // 	</View>
            //   }
          />
        );
        break;
    }
    return content;
  };

  return (
    <>
      <Navbar title="聊天记录" />
      <View flex>
        <View
          row
          centerV
          style={{
            paddingTop: pt(15),
            justifyContent: 'space-around',
          }}>
          {DATA.map((item, idx) => {
            const viewDiffStyle =
              item.id === currentId
                ? {
                    paddingBottom: pt(10),
                    borderBottomWidth: pt(2),
                    borderBottomColor: '#7581FF',
                  }
                : {};
            const textDiffStyle =
              item.id === currentId
                ? {fontSize: pt(16), fontWeight: 'bold', color: '#7581FF'}
                : {fontSize: pt(14), color: '#666666'};

            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={1}
                onPress={() => {
                  setCurrentId(item.id);
                  setSearchVal('');
                }}
                style={{
                  ...viewDiffStyle,
                }}>
                <Text
                  style={{
                    ...textDiffStyle,
                  }}>
                  {t(item.label)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {renderSearch(currentId)}
        {renderContent(currentId)}
      </View>
    </>
  );
}
