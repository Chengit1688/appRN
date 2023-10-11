import {ScrollView, StatusBar} from 'react-native';
import {
  Text,
  View,
  Avatar,
  Image,
  Assets,
  TouchableOpacity,
} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt, opacity} from '@/utils/dimension';

import Header, {headerHeight} from '@/components/Header';
import HeaderLeft from '@/components/HeaderLeft';
import {getRedpackInfo, getGroupRedpackInfo} from '@/api/wallet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {formatUrl} from '@/utils/common';
import {useEffect, useMemo, useState} from 'react';
import SvgIcon from '@/components/SvgIcon';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import _ from 'lodash';
import GlobalLoading from '@/components/Loading/globalLoading';

export default function RedPacketDetail({route}: {route: any}) {
  const {redpack_id, isGroup, send_face_url, send_nickname, group_id} =
    route.params;
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [detail, setDetail] = useState<any>({
    amount: 0,
  });
  const diffMoney = useMemo(() => {
    const total = _.isArray(detail.recv_info)
      ? detail.recv_info.reduce((a: any, b: any) => a + b.amount, 0)
      : 0;
    return Number(total / 100).toFixed(2);
  }, [detail]);
  const {goBack} = useNavigation();

  useEffect(() => {
    if (!isGroup) {
      GlobalLoading.startLoading();
      getRedpackInfo({
        redpack_single_id: redpack_id,
        operation_id: new Date().getTime().toString(),
      })
        .then(res => {
          console.log(res, '====>单聊红包');
          setDetail(res);
        })
        .finally(() => {
          GlobalLoading.endLoading();
        });
    } else {
      GlobalLoading.startLoading();
      getGroupRedpackInfo({
        operation_id: new Date().getTime().toString(),
        redpack_group_id: redpack_id,
        group_id,
      })
        .then(res => {
          console.log(res, '====>群红包');
          setDetail(res);
        })
        .finally(() => {
          GlobalLoading.endLoading();
        });
    }
  }, [isGroup]);

  const avatar = send_face_url
    ? {uri: formatUrl(send_face_url)}
    : Assets.imgs.avatar.defalut;
  return (
    <>
      <Header darkMode hide />
      <View flex>
        <ScrollView
          style={{
            paddingBottom: pt(30),
          }}>
          <Image
            assetName="red_packet_headerbg"
            assetGroup="imgs.app"
            style={{
              width: pt(375),
              height: pt(115),
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: insets.top - 10,
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginTop: StatusBar.currentHeight || 0,
              height: headerHeight,
            }}>
            <TouchableOpacity
              center
              activeOpacity={0.8}
              onPress={() => {
                goBack();
              }}
              style={{
                paddingLeft: pt(16),
                paddingRight: pt(16),
                minHeight: pt(30),
              }}>
              <SvgIcon name="backWhite" size={pt(20)} />
            </TouchableOpacity>
          </View>
          <View
            row
            center
            style={{
              marginTop: pt(37),
            }}>
            <Image
              source={avatar}
              style={{
                width: pt(26),
                height: pt(26),
                borderRadius: pt(3),
              }}></Image>
            {/* <Avatar
            imageStyle={{
              borderRadius: pt(3),
            }}
            {...{
              
              size: pt(17),
              source: {
                avatar
              },
            }}
          /> */}
            <Text
              style={{
                marginLeft: pt(6),
                marginRight: pt(6),
                fontSize: pt(16),
                fontWeight: 'bold',
                color: '#333333',
              }}>
              {t(`${send_nickname}发出的红包`)}
            </Text>
            {isGroup && detail.type === 1 ? (
              <View
                center
                style={{
                  width: pt(15),
                  height: pt(15),
                  borderRadius: pt(3),
                  backgroundColor: '#DFBC80',
                }}>
                <Text
                  style={{
                    fontSize: pt(10),
                    color: '#FFFFFF',
                  }}>
                  {t('拼')}
                </Text>
              </View>
            ) : null}
          </View>
          <View
            center
            style={{
              marginTop: pt(10),
            }}>
            <Text
              style={{
                fontSize: pt(13),
                color: '#333333',
                opacity: 0.6,
              }}>
              {detail?.remark || ''}
            </Text>
          </View>
          <View
            row
            centerH
            style={{
              marginTop: pt(15),
              alignItems: 'baseline',
            }}>
            <Text
              style={{
                fontSize: pt(40),
                fontWeight: 'bold',
                color: '#DFBC80',
              }}>
              {Number(detail?.amount / 100).toFixed(2)}
            </Text>
            <Text
              style={{
                marginLeft: pt(10),
                fontSize: pt(14),
                color: '#DFBC80',
              }}>
              {t('元')}
            </Text>
          </View>
          {/* <View row center>
          <Text
            style={{
              fontSize: pt(13),
              color: '#DFBC80',
            }}>
            {t('已存入零钱，可直接提现')}
          </Text>
          <Image
            assetName="red_packet_next"
            assetGroup="icons.app"
            style={{
              marginLeft: pt(9),
            }}
          />
        </View> */}
          {!isGroup ? (
            <View
              style={{
                marginLeft: pt(16),
                marginRight: pt(16),
                marginTop: pt(30),
              }}>
              <Text
                style={{
                  color: '#333333',
                  opacity: 0.6,
                }}>
                {detail.status === 1
                  ? t(
                      `红包金额${Number(detail?.amount / 100).toFixed(
                        2,
                      )}元，等待对方领取`,
                    )
                  : detail?.status === 2
                  ? `1个红包已被领取`
                  : `红包已过期`}
              </Text>
            </View>
          ) : (
            <View
              style={{
                marginLeft: pt(16),
                marginRight: pt(16),
                marginTop: pt(30),
                marginBottom: pt(20),
              }}>
              <Text
                style={{
                  color: '#333333',
                  opacity: 0.6,
                }}>
                {t(
                  `已领取${
                    detail?.recv_info?.length > 0
                      ? detail?.recv_info?.length
                      : 0
                  }/${detail.total}个，共${diffMoney}/${Number(
                    detail.amount / 100,
                  ).toFixed(2)}元`,
                )}
              </Text>
            </View>
          )}

          {!isGroup && detail.status === 2 ? (
            <View
              style={{
                paddingBottom: pt(10),
              }}>
              <View
                row
                centerV
                style={{
                  marginLeft: pt(16),
                  marginRight: pt(16),
                  paddingTop: pt(15),
                  paddingBottom: pt(10),
                }}>
                <Image
                  style={{
                    width: pt(30),
                    height: pt(30),
                    borderRadius: pt(15),
                  }}
                  source={
                    detail.recv_face_url
                      ? {uri: formatUrl(detail.recv_face_url)}
                      : Assets.imgs.avatar.defalut
                  }></Image>

                <View
                  flex
                  row
                  spread
                  style={{
                    paddingLeft: pt(10),
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: pt(15),
                        fontWeight: 'bold',
                        color: '#333333',
                      }}>
                      {detail.recv_nickname || ''}
                    </Text>
                    <Text
                      style={{
                        marginTop: pt(5),
                        fontSize: pt(14),
                        color: '#8A8A8A',
                      }}>
                      {dayjs(detail.recv_at * 1000).format('HH:mm')}
                    </Text>
                  </View>
                  <View>
                    <View
                      row
                      style={{
                        justifyContent: 'flex-end',
                        alignItems: 'baseline',
                      }}>
                      <Text
                        style={{
                          fontSize: pt(15),
                          color: '#333333',
                        }}>
                        {Number(detail.amount / 100).toFixed(2)}
                      </Text>
                      <Text
                        style={{
                          fontSize: pt(14),
                          color: '#333333',
                        }}>
                        {t('元')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : null}

          {isGroup ? (
            <>
              {_.isArray(detail.recv_info) &&
                detail.recv_info.map((item: any, index: number) => {
                  return (
                    <View
                      key={index}
                      style={{
                        paddingBottom: pt(10),
                      }}>
                      <View
                        row
                        centerV
                        style={{
                          marginLeft: pt(16),
                          marginRight: pt(16),
                          paddingTop: pt(5),
                          paddingBottom: pt(10),
                          borderBottomWidth: pt(0.5),
                          borderBottomColor: opacity('#424242', 0.2),
                        }}>
                        <Image
                          style={{
                            width: pt(30),
                            height: pt(30),
                            borderRadius: pt(15),
                          }}
                          source={
                            item.face_url
                              ? {uri: formatUrl(item.face_url)}
                              : Assets.imgs.avatar.defalut
                          }></Image>

                        <View
                          flex
                          row
                          spread
                          style={{
                            paddingLeft: pt(10),
                          }}>
                          <View>
                            <Text
                              style={{
                                fontSize: pt(15),
                                fontWeight: 'bold',
                                color: '#333333',
                              }}>
                              {item.recv_nickname || ''}
                            </Text>
                            <Text
                              style={{
                                marginTop: pt(5),
                                fontSize: pt(14),
                                color: '#8A8A8A',
                              }}>
                              {dayjs(item.recv_at * 1000).format('HH:mm')}
                            </Text>
                          </View>
                          <View>
                            <View
                              row
                              style={{
                                justifyContent: 'flex-end',
                                alignItems: 'baseline',
                              }}>
                              <Text
                                style={{
                                  fontSize: pt(15),
                                  color: '#333333',
                                }}>
                                {Number(item.amount / 100).toFixed(2)}
                              </Text>
                              <Text
                                style={{
                                  fontSize: pt(14),
                                  color: '#333333',
                                }}>
                                {t('元')}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
            </>
          ) : null}

          {/* <View
          style={{
            paddingBottom: pt(10),
          }}>
          <View
            row
            centerV
            style={{
              marginLeft: pt(16),
              marginRight: pt(16),
              paddingTop: pt(20),
              paddingBottom: pt(20),
              borderBottomWidth: pt(0.5),
              borderBottomColor: opacity('#424242', 0.2),
            }}>
            <Avatar
              {...{
                name: '张三',
                size: pt(50),
                source: {
                  uri: 'https://randomuser.me/api/portraits/women/24.jpg',
                },
              }}
            />
            <View
              flex
              row
              spread
              style={{
                paddingLeft: pt(10),
              }}>
              <View>
                <Text
                  style={{
                    fontSize: pt(15),
                    fontWeight: 'bold',
                    color: '#333333',
                  }}>
                  {t('张三')}
                </Text>
                <Text
                  style={{
                    marginTop: pt(5),
                    fontSize: pt(14),
                    color: '#8A8A8A',
                  }}>
                  {'9:20'}
                </Text>
              </View>
              <View>
                <View
                  row
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'baseline',
                  }}>
                  <Text
                    style={{
                      fontSize: pt(19),
                      color: '#333333',
                    }}>
                    {'1.31'}
                  </Text>
                  <Text
                    style={{
                      fontSize: pt(14),
                      color: '#333333',
                    }}>
                    {t('元')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            row
            centerV
            style={{
              marginLeft: pt(16),
              marginRight: pt(16),
              paddingTop: pt(20),
              paddingBottom: pt(20),
            }}>
            <Avatar
              {...{
                name: '李四',
                size: pt(50),
                source: {
                  uri: 'https://randomuser.me/api/portraits/women/24.jpg',
                },
              }}
            />
            <View
              flex
              row
              spread
              style={{
                paddingLeft: pt(10),
              }}>
              <View>
                <Text
                  style={{
                    fontSize: pt(15),
                    fontWeight: 'bold',
                    color: '#333333',
                  }}>
                  {t('李四')}
                </Text>
                <Text
                  style={{
                    marginTop: pt(5),
                    fontSize: pt(14),
                    color: '#8A8A8A',
                  }}>
                  {'9:20'}
                </Text>
              </View>
              <View>
                <View
                  row
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'baseline',
                  }}>
                  <Text
                    style={{
                      fontSize: pt(19),
                      color: '#333333',
                    }}>
                    {'12.01'}
                  </Text>
                  <Text
                    style={{
                      fontSize: pt(14),
                      color: '#333333',
                    }}>
                    {t('元')}
                  </Text>
                </View>
                <View row centerV>
                  <Image assetName="red_packet_best" assetGroup="icons.app" />
                  <Text
                    style={{
                      marginTop: pt(5),
                      marginLeft: pt(5),
                      fontSize: pt(12),
                      color: '#F5C164',
                    }}>
                    {'手气最佳'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View> */}
        </ScrollView>
      </View>
    </>
  );
}
