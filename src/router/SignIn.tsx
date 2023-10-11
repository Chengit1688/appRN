
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import SignIn from "@/pages/SignIn/index"
import Record from "@/pages/SignIn/record"



export default function NewsRoutes() {
  return (
      <Stack.Navigator screenOptions={{}}>
        <Stack.Screen  options={{
          headerShown: false
        }}  name="signIn" component={SignIn} />
        
        <Stack.Screen
          options={{
            title:'兑换记录',
         }}
        name="exchangeRecord" component={Record} />
      </Stack.Navigator>
  );
}