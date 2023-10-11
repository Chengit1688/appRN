import React, {useMemo, useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, Icon} from 'react-native-ui-lib';
import {ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {Navbar, ActionSheet} from '@/components';
import SearchInput from '@/components/SearchInput';
import ContactIndexList from '@/components/ContactIndexList';
import {RootState} from '@/store';
import ContactItem from '@/components/ContactItem';
import imsdk from '@/utils/IMSDK';
import {formatUrl} from '@/utils/common';
import {useNavigation} from '@react-navigation/native';
import {Modal, Toast} from '@ant-design/react-native';
import HeaderRightButton from '@/components/HeaderRight/button';
import {useLoadList} from '@/hooks';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {setCurrentMemberItem} from '@/store/actions/contacts';
import GlobalLoading from '@/components/Loading/globalLoading';

export default function Member(props) {
  const groupInfo = props.route.params.groupInfo || {};

  const type = props.route.params.type || ''; // delete 删除、owner 管理员、setOwner 设置群主
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {navigate, goBack} = useNavigation();
  const [adminList, setAdminList] = useState<any>([]);
  const [staffList, setStaffList] = useState<any>([]);
  const [selected, setSelected] = useState({});
  const [groupOwner, setGroupOwner] = useState<IMSDK.GroupMemberRole | ''>('');
  const [current, setCurrent] = useState<any>({});
  const [isShow, setIsShow] = useState(false);
  const [isShow1, setIsShow1] = useState(false);
  const [isShow2, setIsShow2] = useState(false);
  const [keyword, setKeyword] = useState<any>('');

  const selfInfo = useSelector(
    (state: RootState) => state.user.selfInfo,
    shallowEqual,
  );

  const init = () => {
    // 缺少分页
    imsdk
      .getGroupMemberList({
        group_id: groupInfo.group_id,
        page: 1,
        page_size: 1000,
      })
      .then(res => {
        const list: any = res.list || [];
        setAdminList(
          list.filter(
            (item: any) => item.role === 'admin' || item.role === 'owner',
          ),
        );
        setStaffList(
          list.filter(
            (item: any) => item.role !== 'admin' && item.role !== 'owner',
          ),
        );
      });
  };

  const [haveMore, setHaveMore] = useState(true);
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
  });

  const getList = async () => {
    setLoading(true);
    GlobalLoading.startLoading();
    imsdk
      .getGroupMemberList({
        page_size: pagination.page_size,
        page: pagination.page,
        group_id: groupInfo.group_id,
        search_key: keyword,
      })
      .then((res: any) => {
        setLoading(false);
        const _list: any = staffList.concat(res.list || []);
        if (_list.length >= res.count) {
          setHaveMore(false);
        }
        const newList: any = _list
          .filter((item: any) => item.status === 1)
          .map((item: any) => {
            return {
              ...item,
              ...item.user,
            };
          });

        setStaffList(
          newList.filter(
            (item: any) => item.role !== 'admin' && item.role !== 'owner',
          ),
        );
      })
      .finally(() => {
        GlobalLoading.endLoading();
      });
  };
  useEffect(() => {
    getList();
  }, [pagination.page]);

  // const {loading, list, pagination, haveMore, setList} = useLoadList(
  //   (_params: any) => {
  //     // const {data} = await imsdk.comlink.getGroupMember(
  //     //   10000,
  //     //   1,
  //     //   list[0].group_id,
  //     // )
  //     console.log(_params, '_params');
  //     return imsdk.getGroupMemberList({
  //       page_size: _params.page_size,
  //       page: _params.page,
  //       group_id: groupInfo.group_id,
  //       search_key: keyword,
  //     });
  //   },
  // );

  const getAdminOrOwner = () => {
    // imsdk.comlink.getGroupMemberAdminOrOwner(groupInfo.group_id).then(res => {
    //   setAdminList(
    //     res.data
    //       .filter((item: any) => item.role === 'admin' || item.role === 'owner')
    //       .map((item: any) => {
    //         return {...item, ...item.user};
    //       }),
    //   );
    // });
    imsdk.getOwnerAdmin(groupInfo.group_id).then((res: any) => {
      setAdminList(
        res.List.filter(
          (item: any) => item.role === 'admin' || item.role === 'owner',
        ).map((item: any) => {
          return {...item, ...item.user};
        }),
      );
    });
  };
  const handleSearchTextChange = (val: any) => {
    setKeyword(val);
    setList([]);
    // pagination.onChange(1, 20);
    setPagination({
      page: 1,
      page_size: 20,
    });
  };
  useEffect(() => {
    getAdminOrOwner();
  }, []);

  // useEffect(() => {
  //   console.log('list===>', list);
  //   const newList: any = list
  //     .filter((item: any) => item.status === 1)
  //     .map((item: any) => {
  //       return {
  //         ...item,
  //         ...item.user,
  //       };
  //     });

  //   setStaffList(
  //     newList.filter(
  //       (item: any) => item.role !== 'admin' && item.role !== 'owner',
  //     ),
  //   );
  // }, [list]);

  const contentViewScroll = e => {
    e.persist();
    var offsetY = e.nativeEvent.contentOffset.y;
    var contentSizeHeight = e.nativeEvent.contentSize.height;
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height;

    if (offsetY + oriageScrollHeight >= contentSizeHeight - 20) {
      if (haveMore && !loading) {
        setPagination({
          page: pagination.page + 1,
          page_size: 20,
        });
      }
      return;
    }
  };

  useEffect(() => {
    setGroupOwner(groupInfo.role);
  }, [groupInfo]);

  const showAdminList = useMemo(() => {
    if (groupInfo.role === 'admin' || groupInfo.role === 'owner') {
      return true;
    } else {
      return groupInfo.is_open_admin_list === 1 ? false : true;
    }
  }, [groupInfo]);

  const showMemberList = useMemo(() => {
    // if (groupOwner === 'admin' || groupOwner === 'owner') {
    //   if (groupInfo.no_show_all_member === 1 ) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // } else {
    //   if (
    //     groupInfo.no_show_normal_member === 1 ||
    //     groupInfo.no_show_all_member === 1
    //   ) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // }

    if (groupInfo.role === 'admin' || groupInfo.role === 'owner') {
      return true;
    }

    if (
      (groupInfo.no_show_normal_member === 1 ||
        groupInfo.no_show_all_member === 1) &&
      groupInfo.role === 'user'
    ) {
      return false;
    }
    return true;
  }, [groupInfo]);

  // 是否是管理
  const isAdmin = groupOwner === 'owner' || groupOwner === 'admin';

  return (
    <>
      <Navbar
        title={type === 'owner' ? '群管理员' : '群聊成员'}
        right={
          type === 'setOwner' ? (
            <HeaderRightButton
              text="转让群主"
              disabled={!Object.keys(selected).length}
              onPress={() => {
                imsdk
                  .changeGroupOwner({
                    group_id: groupInfo.group_id,
                    user_id: Object.keys(selected)[0],
                  })
                  .then(() => {
                    Toast.info('转让成功');
                    navigate('GroupChatInfo', {info: groupInfo});
                  });
              }}
            />
          ) : null
        }
      />
      <View flex>
        <SearchInput
          placeholder={t('搜索')}
          onChange={handleSearchTextChange}
          style={{
            margin: pt(16),
            marginBottom: 0,
          }}
        />
        <ScrollView onMomentumScrollEnd={contentViewScroll}>
          {adminList.length > 0 && (
            <>
              <Text
                style={{
                  marginTop: pt(25),
                  marginBottom: pt(10),
                  marginHorizontal: pt(24),
                  fontSize: pt(15),
                  color: '#B1B1B2',
                }}>
                {t('群主、管理员')}
              </Text>
              {adminList.map((item: any) => {
                return (
                  <ContactItem
                    key={item.user_id}
                    selecteds={selected}
                    onItemPress={info => {
                      const data: any = {};
                      data[info.user_id] = true;
                      setSelected(data);
                    }}
                    showRadio={
                      type === 'setOwner' && item.role !== 'owner'
                        ? true
                        : false
                    }
                    contact={{
                      name: item.group_nick_name || item.nick_name,
                      avatar: formatUrl(item.face_url),
                      user_id: item.user_id,
                    }}
                    onPress={() => {
                      if (selfInfo.user_id === item.user_id) {
                        return;
                      }
                      navigate('ContactInfo', {info: item});
                    }}
                    onLongPress={() => {
                      if (!isAdmin) {
                        return;
                      }
                      if (item.role === 'owner') {
                        return;
                      }
                      setCurrent(item);
                      setIsShow2(true);
                    }}
                  />
                );
              })}
            </>
          )}

          {type !== 'owner' && (
            <Text
              style={{
                marginTop: pt(25),
                marginBottom: pt(10),
                marginHorizontal: pt(24),
                fontSize: pt(15),
                color: '#B1B1B2',
              }}>
              {t('群成员')}
            </Text>
          )}
          {type === 'owner' || !showMemberList ? null : (
            <>
              {staffList.map((item: any) => {
                return (
                  <ContactItem
                    key={item.user_id}
                    selecteds={selected}
                    onItemPress={info => {
                      const data: any = {};
                      data[info.user_id] = true;
                      setSelected(data);
                    }}
                    showRadio={
                      type === 'setOwner' && item.role !== 'owner'
                        ? true
                        : false
                    }
                    contact={{
                      name: item.group_nick_name || item.nick_name,
                      avatar: formatUrl(item.face_url),
                      user_id: item.user_id,
                    }}
                    onPress={() => {
                      if (selfInfo.user_id === item.user_id) {
                        return;
                      }
                      navigate('ContactInfo', {info: item});
                    }}
                    onLongPress={() => {
                      if (!isAdmin) {
                        return;
                      }
                      setCurrent(item);
                      setIsShow(true);
                    }}
                  />
                );
              })}
            </>
          )}
        </ScrollView>
        <ActionSheet
          isShow={isShow}
          onCancel={() => setIsShow(false)}
          buttons={[
            {
              label: t('设置管理员'),
              onClick: () => {
                if (current.mute_end_time > 0) {
                  Toast.info({
                    content: t('当前用户禁言中，请解除禁言后再设置为管理员'),
                    mask: false,
                  });
                  return;
                }
                setIsShow(false);
                imsdk
                  .setGroupMemberRole({
                    group_id: groupInfo?.group_id,
                    user_id: current.user_id,
                    role: 'admin',
                  })
                  .then(res => {
                    Toast.info({
                      content: t('设置成功'),
                      mask: false,
                    });
                    dispatch(setCurrentMemberItem({data: current}));

                    setAdminList([...adminList, current]);

                    const newList = list.map((item: any) => {
                      console.log(item, '====>11');
                      return {
                        ...item,
                        role:
                          item.user_id === current.user_id
                            ? 'admin'
                            : item.role,
                      };
                    });
                    setList(newList);
                  });
              },
            },
            {
              label: current?.mute_end_time ? t('取消禁言') : t('禁言用户'),
              onClick: () => {
                setIsShow(false);
                if (current?.mute_end_time) {
                  imsdk
                    .setGroupMemberMuteTime({
                      group_id: groupInfo?.group_id,
                      user_id: current.user_id,
                      mute_sec: 0,
                    })
                    .then(() => {
                      Toast.info({
                        content: t('已取消禁言'),
                        mask: false,
                      });
                      const newList = list.map((item: any) => {
                        return {
                          ...item,
                          mute_end_time:
                            item.user_id === current.user_id
                              ? 0
                              : item.mute_end_time,
                        };
                      });
                      setList(newList);
                    });
                  return;
                }
                setTimeout(() => {
                  setIsShow1(true);
                }, 200);
              },
            },
            {
              label: t('踢出群聊'),
              onClick: () => {
                setIsShow(false);
                imsdk
                  .removeGroupMember({
                    group_id: groupInfo?.group_id,
                    user_id_list: [current.user_id],
                  })
                  .then(() => {
                    Toast.info({
                      content: t('已踢出群聊'),
                      mask: false,
                    });
                    setList(
                      list.filter(
                        (item: any) => item.user.user_id !== current.user_id,
                      ),
                    );
                  });
              },
            },
          ]}
        />
        <ActionSheet
          isShow={isShow1}
          onCancel={() => setIsShow1(false)}
          buttons={[
            {
              label: t('1小时'),
              onClick: () => {
                setIsShow1(false);
                imsdk
                  .setGroupMemberMuteTime({
                    group_id: groupInfo?.group_id,
                    user_id: current.user_id,
                    mute_sec: 3600,
                  })
                  .then(() => {
                    Toast.info({
                      content: t('已禁言1小时'),
                      mask: false,
                    });
                    const newList = list.map((item: any) => {
                      return {
                        ...item,
                        mute_end_time:
                          item.user_id === current.user_id
                            ? 3600
                            : item.mute_end_time,
                      };
                    });
                    setList(newList);
                  });
              },
            },
            {
              label: t('24小时'),
              onClick: () => {
                setIsShow1(false);
                imsdk
                  .setGroupMemberMuteTime({
                    group_id: groupInfo?.group_id,
                    user_id: current.user_id,
                    mute_sec: 3600 * 24,
                  })
                  .then(() => {
                    Toast.info({
                      content: t('已禁言24小时'),
                      mask: false,
                    });
                    const newList = list.map((item: any) => {
                      return {
                        ...item,
                        mute_end_time:
                          item.user_id === current.user_id
                            ? 3600 * 24
                            : item.mute_end_time,
                      };
                    });
                    setList(newList);
                  });
              },
            },
            {
              label: t('永久'),
              onClick: () => {
                setIsShow1(false);
                imsdk
                  .setGroupMemberMuteTime({
                    group_id: groupInfo?.group_id,
                    user_id: current.user_id,
                    mute_sec: 3600 * 24 * 365,
                  })
                  .then(() => {
                    Toast.info({
                      content: t('已永久禁言'),
                      mask: false,
                    });
                    const newList = list.map((item: any) => {
                      return {
                        ...item,
                        mute_end_time:
                          item.user_id === current.user_id
                            ? 3600 * 24 * 365
                            : item.mute_end_time,
                      };
                    });
                    setList(newList);
                  });
              },
            },
          ]}
        />
        <ActionSheet
          isShow={isShow2}
          onCancel={() => setIsShow2(false)}
          buttons={[
            {
              label: t('取消管理员'),
              onClick: () => {
                setIsShow2(false);
                imsdk
                  .setGroupMemberRole({
                    group_id: groupInfo?.group_id,
                    user_id: current.user_id,
                    role: 'user',
                  })
                  .then(res => {
                    Toast.info({
                      content: t('已取消管理员'),
                      mask: false,
                    });
                    dispatch(setCurrentMemberItem({data: current}));
                    setAdminList(
                      adminList.filter(
                        (item: any) => item.user_id !== current.user_id,
                      ),
                    );
                    const newList = list.map((item: any) => {
                      console.log(item, '取消管理员');
                      return {
                        ...item,
                        role:
                          item.user_id === current.user_id ? 'user' : item.role,
                      };
                    });
                    setList(newList);
                  });
              },
            },
            {
              label: t('踢出群聊'),
              onClick: () => {
                setIsShow2(false);
                imsdk
                  .removeGroupMember({
                    group_id: groupInfo?.group_id,
                    user_id_list: [current.user_id],
                  })
                  .then(() => {
                    Toast.info({
                      content: t('已踢出群聊'),
                      mask: false,
                    });
                    setList(
                      list.filter(
                        (item: any) => item.user.user_id !== current.user_id,
                      ),
                    );
                  });
              },
            },
          ]}
        />
        {/* <ContactIndexList
          // selecteds={type === 'setOwner' ? selected : undefined}
          // type={type === 'setOwner' ? 'sigle' : 'multiple'}
          // onSelected={setSelected}
          source={type === 'owner' || !showMemberList ? [] : staffList}
          right={
            type === 'delete'
              ? info => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        Modal.alert(
                          t('删除群成员'),
                          t('确认将此人从群聊移除？'),
                          [
                            {
                              text: t('取消'),
                            },
                            {
                              text: t('删除'),
                              style: {
                                color: '#F53C3C',
                              },
                              onPress: () => {
                                imsdk
                                  .removeGroupMember({
                                    group_id: groupInfo.group_id,
                                    user_id_list: [info.user_id],
                                  })
                                  .then(res => {
                                    Toast.info('已删除');
                                    setStaffList(
                                      staffList.filter(
                                        (item: any) =>
                                          item.user_id !== info.user_id,
                                      ),
                                    );
                                  });
                              },
                            },
                          ],
                        );
                      }}>
                      <Icon
                        assetName="del_red"
                        assetGroup="page.friends"
                        size={pt(16)}
                      />
                    </TouchableOpacity>
                  );
                }
              : undefined
          }
          onPress={(_, info) => {
            if (type === 'delete') {
              return;
            }
            navigate('ContactInfo', {info});
          }}
          header={
            <View>
              {!!showAdminList && (
                <>
                  <Text
                    style={{
                      marginTop: pt(25),
                      marginBottom: pt(10),
                      marginHorizontal: pt(24),
                      fontSize: pt(15),
                      color: '#B1B1B2',
                    }}>
                    {t('群主、管理员')}
                  </Text>
                  {adminList.map((item: any) => {
                    return (
                      <ContactItem
                        key={item.id}
                        selecteds={selected}
                        onItemPress={info => {
                          const data = {};
                          data[info.user_id] = true;
                          setSelected(data);
                        }}
                        showRadio={
                          type === 'setOwner' && item.role !== 'owner'
                            ? true
                            : false
                        }
                        contact={{
                          name: item.nick_name,
                          avatar: formatUrl(item.face_url),
                          user_id: item.user_id,
                        }}
                        onPress={() => {
                          navigate('ContactInfo', {info: item});
                        }}
                      />
                    );
                  })}
                </>
              )}

              {type !== 'owner' && (
                <Text
                  style={{
                    marginTop: pt(25),
                    marginBottom: pt(10),
                    marginHorizontal: pt(24),
                    fontSize: pt(15),
                    color: '#B1B1B2',
                  }}>
                  {t('群成员')}
                </Text>
              )}
            </View>
          }
        /> */}
      </View>
    </>
  );
}
