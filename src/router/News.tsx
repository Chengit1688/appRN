
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import News from "@/pages/News/index"
import Detail from "@/pages/News/detail"



export default function NewsRoutes() {
  return (
      <Stack.Navigator screenOptions={{}}>
        <Stack.Screen name="news" component={News} />
        
        <Stack.Screen
          options={{
            title:'详情',
         }}
        name="newsDetail" component={Detail} />
      </Stack.Navigator>
  );
}