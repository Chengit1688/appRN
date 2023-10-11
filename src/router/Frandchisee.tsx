
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import FrandchiseeIndex from '@/pages/Franchisee';
import FranchiseeDetail from '@/pages/Franchisee/detail';
import UploadData from '@/pages/Franchisee/uploadData';
import Examine from '@/pages/Franchisee/examine';
import EditInfo from '@/pages/Franchisee/editInfo';




export default function FrandchiseeRoutes() {
  return (
      <Stack.Navigator screenOptions={{}}>
        <Stack.Screen name="frandchisee" component={FrandchiseeIndex} />
        
        <Stack.Screen
          options={{
            title:'上传资料',
         }}
        name="applyJoin" component={UploadData} />
         <Stack.Screen
          options={{
            title:'审核中',
         }}
        name="examine" component={Examine} />
         <Stack.Screen
          options={{
            title:'修改资料',
         }}
        name="frandEditInfo" component={EditInfo} />
        
      </Stack.Navigator>
  );
}