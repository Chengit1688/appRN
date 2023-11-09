import {ScrollView, TextInput, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Colors,
  Icon,
  Image,
  ListItem,
  TouchableOpacity,
  Dialog,
  PanningProvider,
} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import PushList from './block/pushList';
import {useTranslation} from 'react-i18next';
import _ from 'lodash';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {handleUpload} from '@/components/ImagePickUpload';
import {publishMoments} from '@/api/circleFriends';
import {ConfirmModal} from '@/components';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/store';
// import { setLocationInfo, setPushImgList } from '@/store/actions/circle'
import {checkIsVideoType} from '@/utils/common';

import Video from 'react-native-video';
import {useRoute} from '@react-navigation/native';

export default function Publish({navigation, route}: any) {
  const {params} = useRoute<any>();
  // const locationInfo =  useSelector((state:any) => state.circle.locationInfo, shallowEqual)
  const dispatch: AppDispatch = useDispatch();

  const {t} = useTranslation();
  //  const {imgList, handleBack} = props
  //  const imgList  =  useSelector((state:any) => state.circle.imgPushList, shallowEqual) || []

  const [newImgList, changeImgList] = useState([]);
  const [isPush, changeIsPush] = useState(false);
  const [content, changeConent] = useState('');
  const [visible, changeVisible] = useState(false);
  const [videoFlag, changeVideoFlag] = useState(false);
  const [inviteFriend, setInviteFriend] = useState<any[]>([]);
  const [locationInfo, setLocationInfo] = useState({
    name: '',
    address: '',
  });
  const [whoSeeData, setWhoSeeData] = useState<any>({
    status: 2, //默认公开
    friends: [],
    tags: [],
  });

  const hanleGoBack = () => {
    // dispatch(setLocationInfo({
    //     name: "",
    //     address: ""
    // }));
    // dispatch(setPushImgList([]))
    navigation.goBack();
  };
  const uploadImg = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.6,
        includeBase64: true,
        selectionLimit: 9 - (newImgList.length || 0),
      },
      response => {
        if (response.assets) {
          handleUpload(response.assets).then((res: any) => {
            changeImgList(newImgList.concat(res));
          });
        }
      },
    );
  };

  useEffect(() => {
    let falg = false;
    if (params?.imgList) {
      // 图片
      changeImgList(params.imgList);
      falg = params.imgList.length > 0;
      changeVideoFlag(
        params.imgList.some((item: any) => checkIsVideoType(item.url)),
      );
    } else {
      falg = content !== '';
    }
    changeIsPush(falg);
    if (params?.selectedsList) {
      //提醒谁看
      setInviteFriend(params?.selectedsList);
    }
    if (params?.locationInfo?.name) {
      //所在位置
      setLocationInfo(params.locationInfo);
    }

    if (params?.whoSeeData) {
      //谁可以看
      setWhoSeeData(params.whoSeeData);
    }
  }, [params, content]);

  //发表
  const submitCircleFriends = () => {
    if (!isPush) return;

    let params: any = {
      operation_id: new Date().getTime().toString(),
      can_see: whoSeeData.status,
      content,
      images: newImgList.map((item: any) => item.url),
      invite_friend_id: inviteFriend.map((item: any) => item.user_id),
      location: locationInfo?.name || '',
      share_friend_id: whoSeeData.friends.map((item: any) => item.user_id),
      share_tag_id: Object.values(whoSeeData.tags).map(
        (item: any) => item.tag_id,
      ),
    };
    if (checkIsVideoType(newImgList[0]?.url)) {
      // 视频
      params = {
        ...params,
        video_img: newImgList.map((item: any) => item.thumbnail),
      };
    }
    publishMoments(params).then(res => {
      // dispatch(setLocationInfo({
      //     name: void 0,
      //     address: void 0,
      // }));
      // dispatch(setPushImgList([]))
      // navigation.goBack()
      navigation.navigate({name: 'circleFirends', params: {refresh: true}}); // 传递刷新标志
    });
  };

  return (
    <ScrollView
      style={{
        backgroundColor: Colors.white,
      }}>
      <View
        style={{
          margin: pt(20),
        }}>
        <View
          row
          centerV
          style={{
            marginTop: pt(32),
            marginBottom: pt(22),
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={hanleGoBack}>
            <Icon assetName="back" assetGroup="icons.app" size={pt(16)}></Icon>
          </TouchableOpacity>
          <TouchableOpacity onPress={submitCircleFriends}>
            <Text
              style={[styles.publishBtn, isPush ? styles.publishActive : '']}>
              发表
            </Text>
          </TouchableOpacity>
        </View>
        <TextInput
          onChangeText={(value: string) => changeConent(value)}
          style={{
            fontSize: pt(15),
          }}
          multiline
          placeholder="这一刻的想法..."></TextInput>
        {newImgList.length > 0 ? (
          <View style={{...styles.flexRow, ...styles.imgMain}}>
            {_.map(newImgList, (imgItem: any, index) => {
              return (
                <View key={index} style={styles.addImg}>
                  {checkIsVideoType(imgItem?.url) ? (
                    // <Video
                    //   resizeMode={'cover'}
                    //   paused={true}
                    //   source={{uri: imgItem.thumb_url}}
                    //   style={styles.backgroundVideo}></Video>
                    <Image
                      style={{width: '100%', height: '100%'}}
                      source={{uri: imgItem.thumbnail}}></Image>
                  ) : (
                    <Image
                      style={{width: '100%', height: '100%'}}
                      source={{uri: imgItem.url}}></Image>
                  )}
                </View>
              );
            })}
            {newImgList.length < 9 && !videoFlag ? (
              <TouchableOpacity onPress={uploadImg} style={styles.addImg}>
                <Icon
                  assetName="add"
                  assetGroup="page.friends"
                  size={pt(30)}></Icon>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
        <PushList
          inviteFriend={inviteFriend}
          locationInfo={locationInfo}
          whoSeeData={whoSeeData}></PushList>
      </View>
      <ConfirmModal
        visible={visible}
        title="提示"
        content="退出后数据不会保存"
        onClose={() => {
          changeVisible(false);
        }}
        onConfirm={() => {
          changeVisible(false);
          hanleGoBack;
        }}></ConfirmModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imgMain: {
    marginTop: pt(30),
  },
  publishBtn: {
    height: pt(30),
    width: pt(60),
    backgroundColor: '#ddd',
    color: '#fff',
    borderRadius: pt(4),
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: pt(30),
  },
  publishActive: {
    backgroundColor: '#7581FF',
  },

  addImg: {
    backgroundColor: '#F7F8FC',
    width: pt(100),
    height: pt(100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: pt(8),
    marginBottom: pt(8),
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
  },
});
