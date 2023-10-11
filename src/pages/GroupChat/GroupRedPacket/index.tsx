import {KeyboardAvoidingView, Platform, TextInput} from 'react-native';
import {Image, Text, TouchableOpacity, View} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';

import {useNavigation} from '@react-navigation/native';
import FullButton from '@/components/FullButton';
import Header from '@/components/Header';
import {Navbar, SvgIcon, ActionSheet} from '@/components';
import {useState} from 'react';
import PlayModal from '@/components/PlayModal';
import GroupMember from '../GroupMember';

const redTypeList = [
  {
    label: '拼手气红包',
    value: 1,
  },
  {
    label: '普通红包',
    value: 2,
  },
  {
    label: '专属红包',
    value: 3,
  },
  //   {
  //     label: '游戏雷红包',
  //     value: 4,
  //   },
];

export default function GroupRedPacket({route}: {route: any}) {
  const {group_id} = route.params;
  const {t} = useTranslation();
  const {goBack} = useNavigation();
  const [redMoney, setRedMoney] = useState<any>(0.0);
  const [redNums, setRedNums] = useState<any>();
  const [mine_number, setMineNumber] = useState<any>(0);
  const [mentionOpen, setMentionOpen] = useState<boolean>(false);
  const [remark, setRemark] = useState<any>('恭喜发财,大吉大利');
  const [receiveData, setReceiveData] = useState<any>({}); //接收人信息
  const [redType, setType] = useState<any>({
    value: 1,
    label: '拼手气红包',
  });
  const [isPlayModal, setPlayModal] = useState<boolean>(false);

  const [redTypeShow, setRedTypeShow] = useState<boolean>(false);

  const handleInputChange = (text: string) => {
    // 使用正则表达式验证输入内容
    const regex = /^\d+(\.\d{0,2})?$/;
    if (regex.test(text) || text === '') {
      setRedMoney(text);
    }
  };

  const handleInputMinnumber = (text: string) => {
    // 验证只能输入一个数字
    const regex = /^\d{1}$/;
    if (regex.test(text) || text === '') {
      setMineNumber(Number(text));
    }
  };

  const handleType = (data: any) => {
    setRedTypeShow(false);
    setType({
      ...data,
    });
  };

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
          <TouchableOpacity
            row
            centerV
            activeOpacity={0.8}
            style={{
              marginTop: pt(20),
            }}
            onPress={() => {
              setRedTypeShow(true);
            }}>
            <Text
              style={{
                color: '#7581FF',
                fontWeight: 'bold',
                marginLeft: pt(16),
              }}>
              {redType.label}
            </Text>
            <SvgIcon
              style={{
                marginLeft: pt(5),
              }}
              name="downRed"
              size={pt(18)}></SvgIcon>
          </TouchableOpacity>
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
              {t(
                redType.value === 1
                  ? '总金额'
                  : redType.value === 3
                  ? '金额'
                  : '单个金额',
              )}
            </Text>
            {redType.value === 1 ? (
              <Text
                style={{
                  fontSize: pt(13),
                  marginLeft: pt(5),
                  color: '#fff',
                  padding: pt(2),
                  backgroundColor: '#efa007',
                  borderRadius: pt(3),
                  overflow: 'hidden',
                }}>
                拼
              </Text>
            ) : null}
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
          {redType.value === 1 || redType.value === 2 ? (
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
                {t('红包个数')}
              </Text>
              <TextInput
                placeholder={'请输入个数'}
                placeholderTextColor="#B1B1B2"
                textAlign="right"
                keyboardType="numeric"
                onChangeText={text => setRedNums(text)}
                value={redNums}
                style={{
                  flex: 1,
                  paddingLeft: pt(16),
                  paddingRight: pt(16),
                  fontSize: pt(14),
                }}
              />
            </View>
          ) : null}
          {redType.value === 3 ? (
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
                {t('发给谁')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setMentionOpen(true);
                }}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    marginRight: pt(5),
                  }}>
                  {receiveData.group_nick_name || receiveData.nick_name}
                </Text>
                <Image
                  assetName="next"
                  assetGroup="icons.app"
                  style={{
                    width: pt(6.5),
                    height: pt(10),
                  }}
                />
              </TouchableOpacity>
              {/* <TextInput
              placeholder={'请输入个数'}
              placeholderTextColor="#B1B1B2"
              textAlign="right"
              keyboardType="numeric"
              onChangeText={text => setRedNums(text)}
              value={redNums}
              style={{
                flex: 1,
                paddingLeft: pt(16),
                paddingRight: pt(16),
                fontSize: pt(14),
              }}
            /> */}
            </View>
          ) : null}

          {redType.value === 4 ? (
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
                {t('设置雷')}
              </Text>
              <TextInput
                placeholder={'请输入类数字(只能一个)'}
                placeholderTextColor="#B1B1B2"
                textAlign="right"
                keyboardType="numeric"
                maxLength={1}
                onChangeText={text => handleInputMinnumber(text)}
                value={mine_number}
                style={{
                  flex: 1,
                  paddingLeft: pt(16),
                  paddingRight: pt(16),
                  fontSize: pt(14),
                }}
              />
            </View>
          ) : null}
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
              redNums={redNums}
              isGroup={true}
              group_id={group_id}
              redType={redType.value}
              mine_number={mine_number}
              redMoney={redMoney}
              remark={remark}
              receive_user_id={receiveData.user_id}
              setPlayModal={setPlayModal}
              isPlayModal={isPlayModal}
            />
          )}
        </View>
        <GroupMember
          groupInfo={{
            group_id,
          }}
          isAt={mentionOpen}
          setAtUser={(item: any) => {
            setReceiveData(item);
            setMentionOpen(false);
          }}
          // groupMember={atALLMemberList}
          onCancel={() => {
            setMentionOpen(false);
          }}
        />
        <ActionSheet
          isShow={redTypeShow}
          onCancel={() => setRedTypeShow(false)}
          buttons={[
            {
              label: t('拼手气红包'),
              onClick: () => {
                handleType(redTypeList[0]);
              },
            },
            {
              label: t('普通红包'),
              onClick: () => {
                handleType(redTypeList[1]);
              },
            },
            {
              label: t('专属红包'),
              onClick: () => {
                handleType(redTypeList[2]);
              },
            },
            // {
            //   label: t('游戏雷红包'),
            //   onClick: () => {
            //     handleType(redTypeList[3]);
            //   },
            // },
          ]}></ActionSheet>
      </KeyboardAvoidingView>
    </>
  );
}
