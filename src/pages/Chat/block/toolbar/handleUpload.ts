import {
  updateCurrentMessageList,
  insertCurrentMessageList,
  deleteCurrentMessageList,
  updateMessageItem,
  checkoutConversation,
} from '@/store/reducers/conversation';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import uuid from 'react-native-uuid';
import {checkIsImgType, checkIsVideoType} from '@/utils/common';
import {Buffer} from 'buffer';
import {handleUpload} from '@/components/ImagePickUpload';
import {Image} from 'react-native';

export const sendFileMessage = (
  file: any,
  selfInfo: any,
  dispatch: any,
  currentConversation: any,
  source?: string,
) => {
  console.log(source, 'source=======>');
  const client_msg_id = uuid.v4();
  if (source === 'more') {
    file = {
      ...file,
      fileName: file.name,
      fileSize: file.size,
    };
  }
  let fileType = 6;
  if (checkIsImgType(file.fileName)) {
    fileType = 3;
  }
  if (checkIsVideoType(file.fileName)) {
    fileType = 5;
  }
  console.log('file===>', file, fileType);
  let base64ImageData = null;
  if (file.base64) {
    const base64Data = Buffer.from(file.base64, 'base64').toString('base64');
    base64ImageData = `data:image/png;base64,${base64Data}`;
  }
  const msgContent = {
    client_msg_id: client_msg_id,
    content: '',
    conversation_id: '',
    send_nickname: selfInfo.nick_name,
    status: IMSDK.MessageStatus.SENDING,
    type: fileType,
    send_id: selfInfo.user_id,
    seq: currentConversation.max_seq + 1,
  };
  let content: any = {
    image_info: {
      uuid: uuid.v4(),
      image_url: base64ImageData,
      image_width: 100,
      thumb_url: base64ImageData,
      image_height: 100,
    },
  };
  if (Number(fileType) === 6) {
    content = {
      file_info: {
        file_url: file.uri,
        uuid: uuid.v4(),
        file_name: file.fileName,
        file_size: file.fileSize,
      },
    };
  }
  if (Number(fileType) === 5) {
    content = {
      video_info: {
        file_url: file.uri,
        uuid: uuid.v4(),
        file_name: file.fileName,
        file_size: file.fileSize,
      },
    };
  }
  msgContent.content = JSON.stringify(content);
  const insertMsg = {...msgContent, send_time: Date.now()};
  dispatch(
    insertCurrentMessageList({
      data: [insertMsg],
    }),
  );
  handleUpload([file], (progressEvent: any) => {
    dispatch(
      updateMessageItem({
        data: {
          ...insertMsg,
          progress: (progressEvent.loaded / progressEvent.total) * 100,
        },
      }),
    );
  })
    .then(async (result: any) => {
      if (Number(fileType) === 3) {
        content.image_info.image_url = result[0].url;
        content.image_info.thumb_url = result[0].thumbnail;
        content.image_info.file_name = result[0].new_name;
        Image.getSize(result[0].url, (width, height) => {
          content.image_info.image_width = width;
          content.image_info.image_height = height;
        });
      }
      if (Number(fileType) === 6) {
        content.file_info.file_url = result[0].url;
        content.file_info.file_name = result[0].old_name;
        content.file_info.new_name = result[0].new_name;
      }
      if (Number(fileType) === 5) {
        content.video_info.file_url = result[0].url;
        content.video_info.file_name = result[0].new_name;
        content.video_info.thumb_url = result[0].thumbnail;
      }
      msgContent.content = JSON.stringify(content);

      const msgText = imsdk.createMessage({
        recv_id:
          currentConversation.type === 1
            ? currentConversation.user.user_id
            : currentConversation.group.group_id,
        conversation_type: currentConversation.type,
        type: Number(fileType) || 1,
        content: msgContent.content,
      });
      const updateConv = {
        ...currentConversation,
        unread_count: IMSDK.MessageStatus.UNREAD,
        max_seq: currentConversation.max_seq + 1,
      };
      imsdk.sendMessage(
        msgText,
        {
          conversation_id: currentConversation.conversation_id,
          content: msgContent.content,
          status: IMSDK.MessageStatus.SENDING,
          type: Number(fileType),
          send_nickname: selfInfo.nick_name,
          ...(Number(fileType) === 6
            ? {file_name: content.file_info.file_name}
            : {}),
          client_msg_id: client_msg_id as string,
        },
        updateConv,
      );
      dispatch(checkoutConversation(updateConv.conversation_id));
    })
    .catch(err => {
      dispatch(
        deleteCurrentMessageList({client_msg_id: msgContent.client_msg_id}),
      );
    });
};
