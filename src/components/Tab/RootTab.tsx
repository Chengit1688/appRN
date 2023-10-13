import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Assets, Colors, Icon} from 'react-native-ui-lib';
import {shallowEqual, useSelector} from 'react-redux';

import {pt} from '@/utils/dimension';
import {RootState} from '@/store';

import Message from '@/pages/Message';
import Contacts from '@/pages/Contacts';
import Discover from '@/pages/Discover';
import My from '@/pages/My';

const Tab = createBottomTabNavigator();

const RootTab = () => {
  const {t} = useTranslation();
  const [initPageName] = useState('Message');

  const unreadCount: number = useSelector(
    (state: RootState) => state.conversation.unreadCount,
    shallowEqual,
  );
  const remindCircle = useSelector(
    (state: RootState) => state.global.remindCiircle,
    shallowEqual,
  );

  const noticeCount = useSelector(
    (state: RootState) => state.contacts.noticeCount,
    shallowEqual,
  );

  const msgBadge = useMemo(() => {
    return unreadCount > 0 ? {tabBarBadge: unreadCount} : {};
  }, [unreadCount]);

  const circleNums = useMemo(() => {
    return remindCircle.length > 0 ? {tabBarBadge: remindCircle.length} : {};
  }, [remindCircle]);

  const noticeNums = useMemo(() => {
    const total = noticeCount.friendNotice + noticeCount.groupNotice;
    return total > 0 ? {tabBarBadge: total} : {};
  }, [noticeCount]);

  return (
    <Tab.Navigator
      initialRouteName={initPageName}
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        lazy: true,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarIconStyle: {},
        tabBarBadgeStyle: {
          marginTop: pt(5),
        },
        tabBarActiveTintColor: '#7581FF',
        tabBarInactiveTintColor: '#D9DADB',
        tabBarActiveBackgroundColor: Colors.white,
        tabBarInactiveBackgroundColor: Colors.white,
      }}>
      <Tab.Screen
        name="Message"
        component={Message}
        options={{
          title: t('消息（在线）'),
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              size={size}
              tintColor={color}
              source={Assets.icons.tab.message}
            />
          ),
          ...msgBadge,
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={Contacts}
        options={{
          title: t('联系人'),
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              size={size}
              tintColor={color}
              source={Assets.icons.tab.contacts}
            />
          ),
          ...noticeNums,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          title: t('发现'),
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              size={size}
              tintColor={color}
              source={Assets.icons.tab.discover}
            />
          ),
          ...circleNums,
        }}
      />
      <Tab.Screen
        name="My"
        component={My}
        options={{
          title: t('我的'),
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => (
            <Icon size={size} tintColor={color} source={Assets.icons.tab.my} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default RootTab;
