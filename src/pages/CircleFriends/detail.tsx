import {
  Text,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Colors, Icon, TextField, View} from 'react-native-ui-lib';
import InfoList from './block/infoList';
import {pt} from '@/utils/dimension';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {getMomentsDetail} from '@/api/circleFriends';
import {FullUserItem} from '@/store/types/user';
import {useNavigation, useRoute} from '@react-navigation/native';
import Comment from './block/comment';
import {Navbar} from '@/components';

export default function Detail() {
  const userInfo = useSelector<RootState, FullUserItem>(
    state => state.user.selfInfo,
    shallowEqual,
  );
  const {params} = useRoute<any>();
  const [detailData, setDetail] = useState({});
  const [autoFocus, setAutoFocus] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [reply, setReply] = useState({
    id: '',
    name: '',
  });

  const getDetail = () => {
    getMomentsDetail({
      moments_id: params.id,
      operation_id: new Date().getTime().toString(),
    })
      .then((res: any) => {
        const images =
          res.data.MomentsInfo?.image != '' &&
          res.data.MomentsInfo?.image.split(';');
        setDetail({
          ...res.data,
          images,
          video: res.data.MomentsInfo?.video_img
            ? {
                url: res.data.MomentsInfo.image,
                thumb: res.data.MomentsInfo.video_img,
              }
            : '',
        });
      })
      .catch(err => {
        console.log(err, 'err');
      });
  };

  useEffect(() => {
    getDetail();
  }, []);

  //点击评论
  const clickComment = (falg: boolean, itemData: any, replyData: any) => {
    setShowComment(true);
    setAutoFocus(true);
    setReply({
      id: replyData.reply_user?.user_id,
      name: replyData.reply_user?.nick_name,
    });
  };
  const cancel = () => {
    setShowComment(false);
    setAutoFocus(false);
  };
  //提交评论
  const commitComment = (res: any) => {
    getDetail();
  };

  return (
    <>
      <Navbar title={'详情'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
        }}>
        <View flex>
          <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
            <InfoList
              data={detailData}
              isDetail={true}
              userInfo={userInfo}
              hanleChangeComment={clickComment}></InfoList>
          </ScrollView>
          {showComment ? (
            <Comment
              reply_to_id={reply.id}
              reply_to_name={reply.name}
              cancel={cancel}
              autoFocus={autoFocus}
              handleCallback={commitComment}
              id={params.id}></Comment>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
