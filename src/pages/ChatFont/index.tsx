import React, {Fragment, useEffect, useState} from 'react';
import {View, Text, Slider, Avatar} from 'react-native-ui-lib';
import {ImageBackground} from 'react-native';
import {Navbar} from '@/components';
import {pt} from '@/utils/dimension';
import {useTranslation} from 'react-i18next';
import {StorageFactory} from '@/utils/storage';

export default function LoginPage() {
  const {t} = useTranslation();
  const [value, setValue] = useState<string | number>(14);

  const init = async () => {
    const fontSize = (await StorageFactory.getLocal('chatFontSize')) || 14;
    setValue(fontSize);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Fragment>
      <Navbar
        title={t('聊天字体')}
        right={
          <Text primary text14 fw500>
            {t('完成')}
          </Text>
        }
      />
      <View flexG flex-1 bg-white spread paddingV-20 paddingH-16>
        <View>
          <View
            row
            right
            style={{
              marginBottom: pt(15),
            }}>
            <View
              paddingH-12
              paddingV-13
              style={{
                borderRadius: pt(7),
                backgroundColor: '#7581FF',
                marginTop: pt(12),
                marginRight: pt(10),
                borderTopRightRadius: pt(0),
              }}>
              <Text
                white
                style={{
                  fontSize: pt(+value),
                }}>
                {t('预览字体大小')}
              </Text>
            </View>
            <Avatar
              containerStyle={{}}
              {...{
                size: pt(38),
                source: {
                  uri: 'https://randomuser.me/api/portraits/women/24.jpg',
                },
              }}
            />
          </View>
          <View
            row
            style={{
              marginBottom: pt(15),
            }}>
            <Avatar
              containerStyle={{}}
              {...{
                size: pt(38),
                source: {
                  uri: 'https://randomuser.me/api/portraits/women/24.jpg',
                },
              }}
            />
            <View
              paddingH-12
              paddingV-13
              style={{
                borderRadius: pt(7),
                backgroundColor: '#F6F7FB',
                marginTop: pt(12),
                marginLeft: pt(10),
                borderTopLeftRadius: pt(0),
                maxWidth: pt(259),
              }}>
              <Text
                text
                style={{
                  fontSize: pt(+value),
                }}>
                {t('拖动下面的滑动，可设置字体大小')}
              </Text>
            </View>
          </View>
          <View
            row
            style={{
              marginBottom: pt(15),
            }}>
            <Avatar
              containerStyle={{}}
              {...{
                size: pt(38),
                source: {
                  uri: 'https://randomuser.me/api/portraits/women/24.jpg',
                },
              }}
            />
            <View
              paddingH-12
              paddingV-13
              style={{
                borderRadius: pt(7),
                backgroundColor: '#F6F7FB',
                marginTop: pt(12),
                marginLeft: pt(10),
                borderTopLeftRadius: pt(0),
                maxWidth: pt(259),
              }}>
              <Text
                text
                style={{
                  fontSize: pt(+value),
                }}>
                {t(
                  '设置后，会改变聊天、菜单和朋友圈中的字体大小。如果在使用过程中存在问 题或意见，可反馈给客服',
                )}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <View
            row
            spread
            style={{
              marginBottom: pt(13),
              position: 'relative',
            }}>
            <Text text14>A</Text>
            {value !== 13 && value !== 18 && (
              <Text
                text14
                style={{
                  position: 'absolute',
                  left: 18 * (value - 13) + '%',
                }}>
                {t('标准')}
              </Text>
            )}
            {/* <Text text14>标准</Text>
            <Text text14>标准</Text>
            <Text text14>标准</Text> */}
            <Text text19>A</Text>
          </View>
          <ImageBackground
            source={require('../../assets/imgs/scaleplate.png')}
            style={{
              width: '100%',
              height: pt(6),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: pt(17),
            }}>
            <Slider
              minimumValue={13}
              maximumValue={18}
              value={value}
              onValueChange={async e => {
                setValue(e);
                await StorageFactory.setLocal('chatFontSize', e.toString());
              }}
              step={1}
              thumbTintColor="#fff"
              minimumTrackTintColor="rgba(0,0,0,0)"
              maximumTrackTintColor="rgba(0,0,0,0)"
              containerStyle={{
                backgroundColor: 'rgba(0,0,0,0)',
                width: '100%',
              }}
              activeThumbStyle={{
                backgroundColor: '#fff',
              }}
              thumbStyle={{
                backgroundColor: '#fff',
                shadowColor: '#fff',
                borderColor: '#AFAFAF',
                borderWidth: 1,
              }}
            />
          </ImageBackground>
        </View>
      </View>
    </Fragment>
  );
}
