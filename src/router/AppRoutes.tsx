import {NavigationContainer, NavigationContext} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import My from '@/pages/My';
import RootTab from '@/components/Tab/RootTab';
import Login from '@/pages/Login';

const Stack = createNativeStackNavigator();
import { useSelector,shallowEqual } from 'react-redux';
import CircleFriendsRoutes from "./CircleFriends"
import NewsRoutes from './News';
import SignInRoutes from './SignIn';
import FrandchiseeRoutes from './Frandchisee';
import PartyIndex from '@/pages/Party';
import React from 'react';

export default function AppRoutes() {
  const loginToken = useSelector((state:any) => state.user.token, shallowEqual);

  return (
    <NavigationContainer>
      <Stack.Navigator
            initialRouteName={loginToken ? "首页" : "login"}
          >
            <Stack.Screen options={{headerShown: false}} name="login" component={Login} />
            <Stack.Screen options={{headerShown: false}} name="首页" component={RootTab} />
            <Stack.Screen options={{headerShown: false}} name="朋友圈" component={CircleFriendsRoutes} />
            <Stack.Screen options={{headerShown: false}} name="新闻" component={NewsRoutes} />
            <Stack.Screen options={{headerShown: false}} name="signIn" component={SignInRoutes} />
            <Stack.Screen options={{headerShown: false}} name="加盟商" component={FrandchiseeRoutes} />
            <Stack.Screen options={{headerShown: false, title:'吃喝玩乐'}} name="party" component={PartyIndex} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
