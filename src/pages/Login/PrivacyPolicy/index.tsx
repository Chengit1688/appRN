import {View, Text, ScrollView, Platform} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {Navbar} from '@/components';
import {getPrivacyPolicy} from '@/api/login';
import WebView from 'react-native-webview';
import {pt} from '@/utils/dimension';
import GlobalLoading from '@/components/Loading/globalLoading';

export default function UserAgreement() {
  const [content, setContent] = useState('');
  const [webViewHeight, setWebViewHeight] = useState(100); //
  const webViewRef = useRef<any>(null);
  const [isWebView, showWebView] = useState(false);

  useEffect(() => {
    GlobalLoading.startLoading();
    getPrivacyPolicy({
      operation_id: Date.now().toString(),
    })
      .then((res: any) => {
        setContent(res.content);
        showWebView(true);
      })
      .finally(() => {
        GlobalLoading.endLoading();
      });
  }, []);
  const handleMessage = (event: any) => {
    setWebViewHeight(+event.nativeEvent.data + 250);
  };

  let jsCode = `window.postMessage(${JSON.stringify(content)}); true;`;
  let source = null;
  if (Platform.OS === 'android') {
    source = {uri: 'file:///android_asset/html/privacyPolicyContent.html'};
  } else {
    source = require('./privacyPolicyContent.html');
  }

  return (
    <>
      <Navbar title="用户协议" />
      <ScrollView>
        {isWebView ? (
          <View style={{marginTop: pt(10)}}>
            {/* <Text>{detail.content}</Text> */}
            <WebView
              ref={webViewRef}
              // source={require('./block/newsDetail.html')}
              source={source}
              // source={{html: html}}
              injectedJavaScript={jsCode}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scrollEnabled={false}
              allowFileAccess={true}
              androidHardwareAccelerationDisabled={true}
              automaticallyAdjustContentInsets={true}
              scalesPageToFit={Platform.OS !== 'ios'}
              originWhitelist={['*']}
              style={{width: '100%', height: pt(webViewHeight)}}
              onMessage={event => {
                handleMessage(event);
              }}></WebView>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}
