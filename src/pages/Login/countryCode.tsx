import {View, Picker, Icon, Colors, Button} from 'react-native-ui-lib';
import {StyleSheet, TextInput, Text} from 'react-native';
import {pt} from '@/utils/dimension';
import _ from 'lodash';
import React, {useState} from 'react';
import {SvgIcon} from '@/components';
export type CountryCodeType = {
  name: string; // 国家名字
  code: string; // 编号
};

const countryCodeArr: CountryCodeType[] = [
  {
    name: '中国',
    code: '+86',
  },
];

const dropdown = require('@/assets/icons/chevronDown.png');
export default function countryCode(props: any) {
  const {country_code, setCountryCode, setPhoneNumber, phone_number} = props;

  const hanleSetCountryCode = (value: any) => {
    // getCountryCode(value);
  };
  // const hanleGetPhoneNumber = (value: any) => {
  //   getPhoneNumber(value);
  // };
  return (
    <View style={styles.formItemFlex}>
      <Picker
        value={country_code}
        placeholder={'Placeholder'}
        renderPicker={(_value?: string) => {
          return (
            <View row>
              <Text
                style={{
                  fontSize: pt(15),
                  fontWeight: '500',
                }}>
                {_value}
              </Text>
              {/* <Icon
                style={{marginLeft: 10, marginTop: 2, width: 50}}
                source={dropdown}
                size={13}
                tintColor={Colors.$iconDefault}
              /> */}
              <SvgIcon
                name="down1"
                size={20}
                style={{marginLeft: 10, width: 30}}></SvgIcon>
            </View>
          );
        }}
        onChange={setCountryCode}>
        {_.map(countryCodeArr, item => (
          <Picker.Item
            key={item.code}
            value={item.code}
            label={`${item.name} ${item.code}`}
          />
        ))}
      </Picker>
      <Text style={styles.afterLines}></Text>
      <TextInput
        onChangeText={setPhoneNumber}
        value={phone_number}
        placeholder="请输入手机号"
        style={{
          flex: 1,
          fontSize: pt(15),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formItemFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: pt(0.5),
    marginLeft: pt(20),
    marginRight: pt(20),
    marginTop: pt(5),
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    paddingTop: pt(15),
    paddingBottom: pt(15),
  },
  afterLines: {
    width: pt(1),
    height: pt(18),
    backgroundColor: '#dcdcdc',
    marginLeft: pt(20),
    marginRight: pt(20),
  },
});
