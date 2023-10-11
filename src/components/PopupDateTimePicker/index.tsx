import React from 'react';
import {Text, View} from 'react-native-ui-lib';
import DateTimePicker from '@react-native-community/datetimepicker';
import {pt} from '@/utils/dimension';
import Popup from '../Popup';
import FullButton from '../FullButton';

const PopupDateTimePicker = (props: any) => {
  const {value, title, onCancel, visible, onChange} = props;
  const [currentValue, setCurrentValue] = React.useState(value);

  return (
    <>
      <Popup visible={visible} onDismiss={onCancel}>
        <View
          style={{
            borderRadius: pt(10),
            backgroundColor: '#fff',
            padding: pt(15),
            width: pt(300),
          }}>
          <Text
            style={{
              fontSize: pt(15),
              fontWeight: 'bold',
              color: '#000',
              marginBottom: pt(20),
            }}>
            {title || '选择日期'}
          </Text>
          <DateTimePicker
            value={currentValue || new Date()}
            display="spinner"
            locale="zh-Hans-CN"
            onChange={e => {
              setCurrentValue(e.nativeEvent.timestamp);
            }}
          />
          <FullButton
            text="确认"
            style={{
              width: pt(270),
              marginLeft: 0,
              marginTop: pt(20),
              marginBottom: pt(0),
              marginRight: 0,
            }}
            onPress={onChange}
          />
        </View>
      </Popup>
    </>
  );
};
export default PopupDateTimePicker;
