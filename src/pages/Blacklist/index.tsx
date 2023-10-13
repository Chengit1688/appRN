import {useEffect, useState} from 'react';
import {View, TouchableOpacity, Icon} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import {Modal, Toast} from '@ant-design/react-native';
import {Empty, Navbar} from '@/components';
import SearchInput from '@/components/SearchInput';
import ContactIndexList from '@/components/ContactIndexList';
import {getBlackList} from '@/api/blackList';

export default function Contacts() {
  const {t} = useTranslation();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const init = () => {
    getBlackList({
      operation_id: `${Date.now()}`,
      page: 1,
      page_size: 999999,
    })
      .then(res => {
        setList(res?.list || []);
        setLoading(false);
      })
      .catch(res => {
      });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Navbar title="黑名单" />
      <View flex>
        <SearchInput
          placeholder={t('搜索')}
          style={{
            margin: pt(16),
            marginBottom: 0,
          }}
        />
        {!!list.length && (
          <ContactIndexList
            source={list}
            showSelect
            onSelected={e => {}}
            right={info => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    Modal.alert(
                      t('移除黑名单'),
                      t('确认将此人从黑名单移除？'),
                      [
                        {
                          text: t('取消'),
                        },
                        {
                          text: t('移除'),
                          style: {
                            color: '#F53C3C',
                          },
                          onPress: () => {
                            imsdk
                              .removeFromBlackList(info.user_id)
                              .then(res => {
                                init();
                                imsdk.emit(IMSDK.Event.FRIEND_LIST_UPDATED, {
                                  friendList: [
                                    {
                                      user_id: info.user_id,
                                      conversation_id: info.user_id,
                                      remark: info.remark,
                                      create_time: info.create_time,
                                      friend_status: info.status || 1,
                                      online_status: info.online_status || 2,
                                      black_status: 2,
                                    },
                                  ],
                                  type: 4,
                                });
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
            }}
          />
        )}
        {!list.length && <Empty />}
      </View>
    </>
  );
}
