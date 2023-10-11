import React from 'react';
import {StatusBar} from 'react-native';
import {View, Colors, Avatar, Text, Image} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import {BoxShadow} from 'react-native-shadow';
import QRCode from 'react-native-qrcode-svg';
import {pt} from '@/utils/dimension';
import FullButton from '@/components/FullButton';
import Header, {headerHeight} from '@/components/Header';
import HeaderLeft from '@/components/HeaderLeft';
import {formatUrl} from '@/utils/common';
import Config from 'react-native-config';
import {Navbar} from '@/components';

export default function QRcode(props: any) {
  const groupInfo = props.route.params.groupInfo || {};
  const {t} = useTranslation();

  return (
    <>
      <Navbar seize={false} />
      <View flex>
        <LinearGradient
          colors={['#7581FF', '#8767EC']}
          style={{
            height: pt(250),
          }}
        />
        {/* <View
          style={{
            position: 'absolute',
            top: 0,
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginTop: StatusBar.currentHeight || 0,
            height: headerHeight,
          }}>
          <HeaderLeft />
        </View> */}
        <View
          center
          style={{
            position: 'absolute',
            top: 40,
            marginTop: (StatusBar.currentHeight || 0) + headerHeight,
            width: pt(375),
          }}>
          <BoxShadow
            setting={{
              width: pt(314), // 与子元素高一致
              height: pt(400), // 与子元素宽一致
              color: '#000', // 阴影颜色
              border: pt(10), // 阴影宽度
              radius: pt(10), // 与子元素圆角一致
              opacity: 0.04, // 透明
              x: 0, // 偏移量
              y: pt(30),
            }}>
            <View
              center
              style={{
                marginTop: pt(30),
                padding: pt(28),
                width: pt(314),
                height: pt(400),
                borderRadius: pt(10),
                backgroundColor: '#ffffff',

                // // android
                // elevation: 5,
                // // ios
                // shadowColor: '#999', //设置阴影色
                // shadowOffset: {width: 0, height: 0}, //设置阴影偏移,该值会设置整个阴影的偏移，width可以看做x,height可以看做y,x向右为正，y向下为正
                // shadowOpacity: 1,
                // shadowRadius: 5,
              }}>
              <View
                style={{
                  marginTop: pt(-50),
                  marginBottom: pt(16),
                  borderWidth: pt(4),
                  borderRadius: pt(5),
                  borderColor: '#ffffff',
                  backgroundColor: '#f5f5f5',
                }}>
                <Image
                  assetName={groupInfo.name}
                  source={{
                    uri: formatUrl(groupInfo.face_url),
                  }}
                  width={pt(70)}
                  height={pt(70)}
                />
              </View>
              <Text
                style={{
                  marginBottom: pt(24),
                  fontSize: pt(15),
                  fontWeight: 'bold',
                }}>
                {groupInfo.name}
              </Text>
              {/* <Image
                source={{
                  uri: 'https://images.pexels.com/photos/748837/pexels-photo-748837.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                }}
                width={pt(200)}
                height={pt(200)}
              /> */}
              <QRCode
                value={`${Config.VITE_APP_SITEID}://qrcode?type=1&id=${groupInfo.group_id}&name=${groupInfo.name}`}
                size={pt(200)}
              />
              {/* <Text
                style={{
                  marginTop: pt(16),
                  fontSize: pt(13),
                  color: '#999999',
                  textAlign: 'center',
                }}>
                {t('该二维码7天内(6月26日前)有效，重新进入将更新')}
              </Text> */}
            </View>
          </BoxShadow>
        </View>
      </View>
      <FullButton outline text={t('保存图片')} onPress={() => {}} />
    </>
  );
}
