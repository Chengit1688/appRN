import {Alert, Platform, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {pt} from '@/utils/dimension';
import {View, Text, Avatar, Icon, Image} from 'react-native-ui-lib';
import List from './block/list';
import {useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {getNewsDetail, getNewList} from '@/api/news';
import {WebView} from 'react-native-webview';
import dayjs from 'dayjs';
import _ from 'lodash';
import GlobalLoading from '@/components/Loading/globalLoading';
// import html from "./block/newsDetail.html"

export default function NewsDetail() {
  const {t} = useTranslation();
  const {params} = useRoute<any>();
  const [webViewHeight, setWebViewHeight] = useState(100); //
  const [detail, setDetail] = useState<any>({
    title: '',
    time: '',
    content: '',
  });
  const webViewRef = useRef<any>(null);
  const [list, setList] = useState([]);
  const [isWebView, showWebView] = useState(false);

  useEffect(() => {
    showWebView(false);
    GlobalLoading.startLoading();
    getNewsDetail({
      operation_id: new Date().getTime().toString(),
      id: params.id,
    })
      .then((res: any) => {
        setDetail({
          title: res.title,
          time: dayjs(res.created_at * 1000).format('YYYY年MM月DD日 HH:mm'),
          content: res.content,
        });
        // let jsCode = `window.receiveMessage(${JSON.stringify(res.content)}); true;`;
        showWebView(true);
      })
      .finally(() => {
        GlobalLoading.endLoading();
      });
    getNewList({
      operation_id: new Date().getTime().toString(),
      page: 1,
      page_size: 3,
      order_by: 'view_total desc',
    }).then((res: any) => {
      setList(res.list);
    });
  }, [params]);

  const handleMessage = (event: any) => {
    setWebViewHeight(event.nativeEvent.data);
  };

  let jsCode = `window.postMessage(${JSON.stringify(detail.content)}); true;`;
  let source = null;
  if (Platform.OS === 'android') {
    source = {uri: 'file:///android_asset/html/newsDetail.html'};
  } else {
    source = require('./block/newsDetail.html');
  }
  return (
    <ScrollView style={{}}>
      <View
        style={{
          backgroundColor: '#fff',
          padding: pt(20),
        }}>
        <Text style={styles.title}>{detail.title}</Text>
        <Text style={styles.txt}>{detail.time}</Text>
        {isWebView ? (
          <View style={{marginTop: pt(20)}}>
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

        {/* <Text style={styles.title}>全面学习把握落实党的二十大精神 以新担当新作为谱写长江航运高质量 发展新篇章</Text>
            <View row centerV>
                <View>
                    <Avatar size={36} source={{ uri:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw%2F34b72822-b16e-42c6-8ff4-c67dcbd65b62%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1692348816&t=77b657d28706792679462befbd3340ac'}}></Avatar>
                    <Icon style={styles.auth} assetName="auth" assetGroup="page.news" size={pt(15)}></Icon>
                </View>
                <View style={styles.nameTxt}>
                    <Text style={styles.name}>长江航运</Text>
                    <Text style={styles.txt}>2022-12-28 · 《长江航运》编辑委员会</Text>
                </View>
            </View>

            <View style={{ marginTop: pt(20)}}>
                <Text style={{
                    fontSize: pt(14),
                    color:"#333",
                    lineHeight: pt(30)
                }}>2022 年 12 月 28 日， 长航局组织召开党委（扩大）会议暨二十大精神宣讲，深入学习领会党的二十大精神、中央经济工作会议精神，贯彻落实部党组关于 2023 年交通运输工作的部署要求，提出 2023 年长江航运高质量发展的初步设想和初步安排，安排部署岁末年初长江航运有关重点工作。长航局党委书记缪昌文作题为《全面学习把握落实党的二十大精神 以新担当新作为谱写长江航运高质量发展新篇章》的报告。</Text>
                <Image resizeModel={"cover"} style={{flex: 1, marginTop: pt(10),marginBottom: pt(10),height:pt(200)}} source={{uri:'https://img1.baidu.com/it/u=1310564963,1641173348&fm=253&fmt=auto&app=120&f=JPEG'}}></Image>
                <Text style={{
                    fontSize: pt(14),
                    color:"#333",
                    lineHeight: pt(30)
                }}>2022 年 12 月 28 日， 长航局组织召开党委（扩大）会议暨二十大精神宣讲，深入学习领会党的二十大精神、中央经济工作会议精神，贯彻落实部党组关于 2023 年交通运输工作的部署要求，提出 2023 年长江航运高质量发展的初步设想和初步安排，安排部署岁末年初长江航运有关重点工作。长航局党委书记缪昌文作题为《全面学习把握落实党的二十大精神 以新担当新作为谱写长江航运高质量发展新篇章》的报告。</Text>
            </View>*/}
      </View>
      <View style={styles.likes}>
        <Text style={styles.likesTitle}>{t('喜欢此内容的人还喜欢')}</Text>
        <View style={{marginLeft: pt(20), marginRight: pt(20)}}>
          {_.map(list, (item, index) => (
            <List key={index} item={item}></List>
          ))}
        </View>
        {/* <List></List> */}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: pt(21),
    color: '#333',
    fontWeight: 'bold',
    lineHeight: pt(28),
    marginBottom: pt(10),
  },
  nameTxt: {
    marginLeft: pt(15),
  },
  name: {
    fontSize: pt(13),
    color: '#333',
  },
  txt: {
    color: '#999999',

    fontSize: pt(11),
  },
  auth: {
    position: 'absolute',
    bottom: pt(-3),
    right: pt(-3),
  },
  likes: {
    backgroundColor: '#fff',
    paddingTop: pt(20),
    paddingBottom: pt(20),
    borderTopColor: '#F6F7F9',
    borderTopWidth: pt(1),
  },
  likesTitle: {
    margin: pt(20),
    marginTop: 0,
    color: '#B2B2B2',
    fontSize: pt(14),
  },
});
