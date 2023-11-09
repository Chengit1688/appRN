import {View, Text} from 'react-native-ui-lib';
import React, {useEffect, useState} from 'react';
import {FullButton, Navbar} from '@/components';
import {pt} from '@/utils/dimension';
import {TextInput, TouchableOpacity} from 'react-native';
import {getWallet, getWithdrawConfig, submitWithdraw} from '@/api/wallet';
import _ from 'lodash';
import {ScrollView} from 'react-native';
import {Toast} from '@ant-design/react-native';

export default function Cash() {
  const [formData, setFormData] = useState<any>({});
  const [detail, setDetail] = useState<any>({});
  const [config, setConfig] = useState<any>({});
  // 获取提现配置
  const initData = () => {
    getWithdrawConfig({operation_id: Date.now()}).then(res => {
      const dict = res;
      const arr = res.columns;
      arr.map((v,index)=>{
        if(v.name == '提款人:'){
          v.name = '收款姓名:'
        }else if(v.name == '银行:'){
          v.name = '支付宝账号:'
        }else if(v.name == '卡号:'){
          v.name = '电话号码:'
        }
      })
      dict.columns = arr;
      setConfig(dict || {});
    });
    getWallet({operation_id: Date.now()}).then(res => {
      setDetail(res || {});
    });
  };

  useEffect(() => {
    initData();
  }, []);

  const checkPhone=(phone)=>{
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      return false;
    }
    return true;
  }


  const submit = () => {
    let falg = true;
    for (const item of config?.columns) {
      if (item.required === 1 && !item.value) {
        Toast.info(`${item.name.replace(':', '')}不能为空`);
        falg = false;
        break;
      }
      // if(item.name == '电话号码:'){
      //   if(!checkPhone(item.value)){
      //    return Toast.info(`请输入正确的电话号码`);
      //   }
      // }
      if (item.name === '提现金额' && item.value < config.min / 100) {
        Toast.info(`提现金额不能小于${config.min / 100}元`);
        falg = false;
        break;
      }
      if (item.name === '提现金额' && item.value > config.max / 100) {
        Toast.info(`提现金额不能大于${config.max / 100}元`);
        falg = false;
        break;
      }
    }
    if (falg) {
      const columns = config?.columns?.map((item: any) => {
        return {
          ...item,
          value:
            item.name === '提现金额' ? `${item.value * 100}` : `${item.value}`,
        };
      });
      submitWithdraw({columns, operation_id: `${Date.now()}`}).then(res => {
        Toast.info(`提现申请成功`);
        initData();
        //   message.success('提现申请成功');
        //   initData();
        //   form.resetFields();
      });
    }
  };

  console.log('config===>>',config)
  return (
    <View>
      <Navbar title="提现" />
      <ScrollView>
        <View>
          {_.map(config?.columns, (item, index) => {
            return (
              <View
                row
                key={index}
                centerV
                style={{
                  marginTop: pt(30),
                  marginLeft: pt(16),
                  marginRight: pt(16),
                  paddingBottom: pt(10),
                  borderBottomWidth: pt(1),
                  borderBottomColor: '#EEEEEE',
                }}>
                <Text
                  style={{
                    fontSize: pt(15),
                    color: '#333333',
                  }}>
                  {item.name}
                </Text>
                <TextInput
                  placeholder={`请输入${item.name.replace(':', '')}`}
                  placeholderTextColor="#B1B1B2"
                  textAlign="right"
                  keyboardType={
                    item.name === '提现金额' ? 'numeric' : 'default'
                  }
                  value={`${item.value}`}
                  onChangeText={(text: any) => {
                    setConfig({
                      ...config,
                      columns: _.map(config?.columns, (_c, _d) => {
                        if (index === _d) {
                          return {
                            ..._c,
                            value: text,
                          };
                        }
                        return _c;
                      }),
                    });
                  }}
                  style={{
                    flex: 1,
                    paddingLeft: pt(16),
                    paddingRight: pt(16),
                    fontSize: pt(14),
                  }}
                />
              </View>
            );
          })}
        </View>
        <View
          row
          style={{
            marginTop: pt(16),
            marginLeft: pt(16),
          }}>
          <Text
            style={{
              fontWeight: '500',
              fontSize: pt(15),
            }}>
            余额：￥
          </Text>
          <Text
            style={{
              fontWeight: '500',
              fontSize: pt(15),
            }}>
            {detail?.balance ? detail?.balance / 100 : 0}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              const newConfig = _.map(config?.columns, (_c, _d) => {
                if (_c.name === '提现金额') {
                  return {
                    ..._c,
                    value: detail?.balance
                      ? (detail?.balance / 100).toString()
                      : 0,
                  };
                }
                return _c;
              });

              setConfig({
                ...config,
                columns: newConfig,
              });
            }}
            style={{marginLeft: pt(10)}}>
            <Text
              style={{
                fontSize: pt(15),
                color: '#7581FF',
                fontWeight: '500',
              }}>
              全部提现
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: pt(30),
          }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: pt(13),
              color: '#7581FF',
              fontWeight: '500',
              margin: pt(16),
              marginBottom: pt(0),
            }}>
            {`(最小提现金额：${config?.min?config?.min / 100:'0'}元，最大提现金额: ${
             config?.max?config?.max / 100:'0'
            }元)`}
          </Text>
          <FullButton
            text="提现"
            onPress={() => {
              submit();
            }}></FullButton>
        </View>
      </ScrollView>
    </View>
  );
}
