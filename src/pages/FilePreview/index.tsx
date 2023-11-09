import {View, Text, Platform, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import {FullButton, Navbar, SvgIcon} from '@/components';
// import WebView from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import {pt} from '@/utils/dimension';
import Share from 'react-native-share';

export default function FilePreview(props: any) {
  const {params} = useRoute<any>();

  let source = {uri: `file:/${params.url}`, cache: true};

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
      }}>
      <Navbar title="预览" />
      <View
        style={{
          flex: 1,
          flexDirection: 'cloumn',
          padding: pt(20),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <SvgIcon name="unknown" size={pt(50)} />
        <Text
          style={{
            marginTop: pt(20),
            fontWeight: '400',

            fontSize: pt(16),
          }}>
          {params.name}
        </Text>
        <Text
          style={{
            marginTop: pt(20),
            fontSize: pt(14),
            textAlign: 'center',
            lineHeight: pt(24),
          }}>
          APP暂不支持打开此类文件，您可以使用其他应用打开并预览
        </Text>
        <FullButton
          label="其他应用打开"
          onPress={() => {
            Share.open({
              message: '分享文件',
              url: params.url,
            })
              .then(res => {
              })
              .catch(err => {
                err && console.log(err);
              });
          }}
          style={{
            marginTop: pt(80),
            width: pt(200),
          }}></FullButton>
      </View>
    </View>
  );
}
