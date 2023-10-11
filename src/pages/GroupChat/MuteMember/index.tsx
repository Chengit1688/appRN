import React, {useMemo, useEffect, useState} from 'react';
import {
  Text,
  View,
  ListItem,
  Avatar,
  TouchableOpacity,
} from 'react-native-ui-lib';
import {ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {Navbar, ActionSheet, Empty} from '@/components';
import {formatUrl} from '@/utils/common';
import HeaderRightButton from '@/components/HeaderRight/button';
import {Modal, Toast} from '@ant-design/react-native';
import {RootState} from '@/store';
import imsdk from '@/utils/IMSDK';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {updateSettingInfo} from '@/store/reducers/conversation';

export default function Member(props) {
  const settingInfo =
    useSelector<RootState>(
      state => state.conversation.settingInfo,
      shallowEqual,
    ) || {};
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const staffList = useMemo(() => {
    if (settingInfo && settingInfo?.muteUserList?.length > 0) {
      return settingInfo?.muteUserList;
    } else {
      return [];
    }
  }, [settingInfo]);

  return (
    <>
      <Navbar title={t('禁言列表')} />
      <View flex>
        {!!staffList?.length && (
          <ScrollView>
            <>
              <Text
                style={{
                  marginTop: pt(25),
                  marginBottom: pt(10),
                  marginHorizontal: pt(24),
                  fontSize: pt(15),
                  color: '#B1B1B2',
                }}>
                {t('禁言列表')}
              </Text>
              {staffList.map((item: any) => {
                return (
                  <ListItem
                    key={item.id}
                    activeBackgroundColor={'#F8F9FF'}
                    activeOpacity={1}
                    height={pt(60)}
                    onPress={() => {}}>
                    <ListItem.Part
                      left
                      containerStyle={{
                        marginLeft: pt(34),
                      }}>
                      <Avatar
                        {...{
                          name: item.nick_name,
                          size: pt(40),
                          source: {
                            uri: formatUrl(item.face_url),
                          },
                        }}
                      />
                    </ListItem.Part>
                    <ListItem.Part middle style={{flex: 1}}>
                      <View
                        row
                        spread
                        centerV
                        style={{height: pt(60), paddingHorizontal: pt(15)}}>
                        <Text
                          style={{
                            color: '#222222',
                            fontSize: pt(14),
                            fontWeight: 'bold',
                            flex: 1,
                          }}>
                          {item.nick_name}
                        </Text>
                        <HeaderRightButton
                          text={t('解除禁言')}
                          onPress={() => {
                            imsdk
                              .setGroupMemberMuteTime({
                                group_id: item.group_id,
                                user_id: item.user_id,
                                mute_sec: 0,
                              })
                              .then(() => {
                                dispatch(
                                  updateSettingInfo({unMuteUserList: [item]}),
                                );
                              });
                          }}
                        />
                      </View>
                    </ListItem.Part>
                  </ListItem>
                );
              })}
            </>
          </ScrollView>
        )}
        {!staffList?.length && <Empty />}
      </View>
    </>
  );
}
