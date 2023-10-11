import React from 'react';
import {Text, View, SectionsWheelPicker} from 'react-native-ui-lib';
import DateTimePicker from '@react-native-community/datetimepicker';
import {pt} from '@/utils/dimension';
import Popup from '@/components/Popup';
import FullButton from '../FullButton';

const PopupDateTimePicker = (props: any) => {
  const {
    value,
    title,
    onCancel,
    visible,
    onChange,
    sections,
    numberOfVisibleRows,
  } = props;
  const [currentValue, setCurrentValue] = React.useState(value);

  return (
    <>
      <Popup visible={visible} onDismiss={onCancel}>
        <View
          pointerEvents="none"
          onResponderMove={() => {}}
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
            {title || '选择'}
          </Text>
          <SectionsWheelPicker
            sections={[
              {
                items: sections || [],
              },
            ]}
            numberOfVisibleRows={numberOfVisibleRows || 1}
            activeTextColor="#000"
            inactiveTextColor="#999"
            align="center"
            itemHeight={pt(55)}
            value={currentValue}
            textStyle={{
              fontSize: pt(16),
              fontWeight: 'bold',
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
