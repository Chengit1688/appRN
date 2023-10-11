import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {Text, View} from 'react-native-ui-lib';
import {pt} from './dimension';

/*
  1. Create the config
*/
export const toastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'pink'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 20,
        fontWeight: '400',
      }}
    />
  ),
  info: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#fff',
        width: '95%',
        paddingTop: pt(15),
        paddingBottom: pt(15),
        height: pt(60),
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: pt(16),
        fontWeight: '500',
      }}
      text2Style={{
        fontSize: pt(14),
        marginTop: pt(5),
        fontWeight: '300',
      }}
    />
  ),
  /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
  tomatoToast: ({text1, props}) => (
    <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};
