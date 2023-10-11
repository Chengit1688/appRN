import {KeyboardAvoidingView, Platform, TextInput} from 'react-native';
import {Text, View} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';

import {useNavigation} from '@react-navigation/native';
import FullButton from '@/components/FullButton';
import Header from '@/components/Header';
import {Navbar} from '@/components';
import {useState} from 'react';
import PlayModal from '@/components/PlayModal';

export default function RedPacket({route}: {route: any}) {
  const {recv_id} = route.params;
  const {t} = useTranslation();
  const {goBack} = useNavigation();
  const [redMoney, setRedMoney] = useState<any>(0.0);
  const [remark, setRemark] = useState<any>('恭喜发财,大吉大利');
  const [isPlayModal, setPlayModal] = useState<boolean>(false);
  const handleInputChange = (text: string) => {
    // 使用正则表达式验证输入内容
    const regex = /^\d+(\.\d{0,2})?$/;
    if (regex.test(text) || text === '') {
      setRedMoney(text);
    }
  };

  const handleplay = () => {};

  return (
    <>
      {/* <Header bgColor="#F75747" darkMode /> */}
      <Navbar title="红包"></Navbar>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
        }}>
        <View flex>
          <View
            row
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
              {t('单个金额')}
            </Text>
            <TextInput
              placeholder={'￥0.00'}
              placeholderTextColor="#B1B1B2"
              textAlign="right"
              keyboardType="numeric"
              onChangeText={handleInputChange}
              value={redMoney}
              style={{
                flex: 1,
                paddingLeft: pt(16),
                paddingRight: pt(16),
                fontSize: pt(14),
              }}
            />
          </View>
          <View
            row
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
              {t('红包祝福')}
            </Text>
            <TextInput
              placeholder={t('恭喜发财，大吉大利')}
              placeholderTextColor="#B1B1B2"
              textAlign="right"
              onChangeText={text => setRemark(text)}
              style={{
                flex: 1,
                paddingLeft: pt(16),
                paddingRight: pt(16),
                fontSize: pt(15),
              }}
            />
          </View>
          <View
            row
            center
            style={{
              marginTop: pt(66),
            }}>
            <Text
              style={{
                fontSize: pt(30),
                fontWeight: 'bold',
                color: '#000000',
              }}>
              ￥
            </Text>
            <Text
              style={{
                fontSize: pt(44),
                fontWeight: 'bold',
                color: '#000000',
              }}>
              {redMoney}
            </Text>
          </View>
          <FullButton
            text={t('塞钱进红包')}
            onPress={() => {
              setPlayModal(true);
            }}
            style={{
              marginLeft: pt(81),
              marginRight: pt(81),
              backgroundColor: '#F75747',
            }}
          />
          {isPlayModal && (
            <PlayModal
              recv_id={recv_id}
              redMoney={redMoney}
              remark={remark}
              setPlayModal={setPlayModal}
              isPlayModal={isPlayModal}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
