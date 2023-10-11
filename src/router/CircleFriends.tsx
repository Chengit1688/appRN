
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import CircleFriends from "@/pages/CircleFriends"
import UserIndex from "@/pages/CircleFriends/userIndex"
import MyPublished from "@/pages/CircleFriends/myPublished"
import Detail from "@/pages/CircleFriends/detail"
import Publish from "@/pages/CircleFriends/publish"
import WhoWatch from '@/pages/CircleFriends/whoWatch';
import Location from '@/pages/CircleFriends/location';
import LocationSearch from '@/pages/CircleFriends/locationSearch';
import Contacts from '@/pages/CircleFriends/contacts';
import Label from '@/pages/CircleFriends/label';
import CreateLabel from '@/pages/CircleFriends/createLabel';
import LabelContacts from '@/pages/CircleFriends/labelContacts';
import PictureDetails from '@/pages/CircleFriends/pictureDetails';


export default function CircleFriendsRoutes() {
  return (
      <Stack.Navigator screenOptions={{}}>
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      name="firends" component={CircleFriends} />
      <Stack.Screen
           options={{
              headerShown: false
           }}
        name="pictureDetails" component={PictureDetails} />
        <Stack.Screen
            options={{
              title:'提醒谁看',
           }}
        name='remind' component={Contacts} />
        <Stack.Screen
          options={{
            title:'谁可以看',
          }}
           name="whoWatch" component={WhoWatch} />
        <Stack.Screen
           options={{
              title:'标签',
           }}
        name="label" component={Label} />

        <Stack.Screen
           options={{
              title:'标签联系人',
           }}
        name="labelContacts" component={LabelContacts} />

        <Stack.Screen
          options={{
            title:'我的',
            headerShown: false
        }}
        name="userFriendIndex" component={UserIndex} />    
        
        <Stack.Screen name="所在位置1" component={LocationSearch} />
        <Stack.Screen name="所在位置" component={Location} />
  
         <Stack.Screen options={{
            title:'发布',
        }}  name="publishFriends" component={Publish} />
         
         <Stack.Screen name="我的" component={UserIndex} />
         <Stack.Screen name="我的发表" component={MyPublished} />
         <Stack.Screen name="详情" component={Detail} />
         <Stack.Screen
            options={{
              title:'新建标签',
           }}
        name='createLabel' component={CreateLabel} />
      </Stack.Navigator>
  );
}