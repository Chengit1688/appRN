import {
  View,
  Text,
  TextField,
  TextFieldRef,
  Colors,
  Icon,
} from 'react-native-ui-lib';
import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {pt} from '@/utils/dimension';
import Emoji from './emoji';
import {addComments} from '@/api/circleFriends';

export default function Comment({
  autoFocus,
  cancel,
  id,
  reply_to_id = '',
  reply_to_name,
  handleCallback,
}: {
  autoFocus?: boolean;
  reply_to_id?: number | string;
  cancel?: (...args: any) => void;
  id: number | string;
  reply_to_name?: string;
  handleCallback: (...args: any) => void;
}) {
  const inputEl = useRef<TextFieldRef | null>(null);
  const [isShowEmoji, changeShowEmoji] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [selection, setSelection] = useState({start: 0, end: 0});
  const [isFocused, setIsFocused] = useState(autoFocus);
  const [replyObj, setReplyObj] = useState({
    reply_to_id: reply_to_id,
    reply_to_name: reply_to_name,
  });

  const handleInsertText = (textToInsert: any) => {
    const newText =
      commentText.slice(0, selection.start) +
      textToInsert +
      commentText.slice(selection.end);
    setCommentText(newText);
    const newSelection = {
      start: selection.start + textToInsert.length,
      end: selection.start + textToInsert.length,
    };
    setSelection(newSelection);
  };
  useEffect(() => {
    if (autoFocus) {
      inputEl?.current?.focus();
      setReplyObj({
        reply_to_id: reply_to_id,
        reply_to_name: reply_to_name,
      });
    } else {
      inputEl?.current?.blur();
    }
  }, [autoFocus]);
  //取消评论
  const resetComment = () => {
    changeShowEmoji(false);
    setIsFocused(false);
    cancel && cancel(false);
  };

  const [keyboardIsShown, setKeyboardIsShown] = useState(false);

  // 监听键盘显示和隐藏事件
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        changeShowEmoji(false);
        setKeyboardIsShown(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardIsShown(false);
      },
    );

    // 在组件卸载时清除事件监听
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  //改变表情切换光标
  const handleEmoji = () => {
    inputEl?.current?.blur();
    changeShowEmoji(true);
  };

  //提交评论
  const submitEditing = (event: any) => {
    event.persist();
    const params = {
      operation_id: new Date().getTime().toString(),
      content: commentText,
      reply_to_id: replyObj.reply_to_id,
      moments_id: id,
    };
    addComments(params).then(res => {
      //重置评论数据
      //changeComment({falg:false, moments_id: '',reply_to_id:'',reply_to_name:''});
      handleCallback && handleCallback(res);
      setCommentText('');
    });
  };

  const setEmoji = (value: any) => {
    handleInsertText(value);
  };
  return (
    <View style={[isFocused || isShowEmoji ? styles.commentMain : null]}>
      <TouchableOpacity
        onPress={resetComment}
        style={styles.commentMark}></TouchableOpacity>

      <View
        style={[styles.inputMain, keyboardIsShown && styles.inputWithKeyboard]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TextField
            ref={inputEl}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={submitEditing}
            selection={selection}
            onChangeText={(value: any) => {
              setCommentText(value);
            }}
            onSelectionChange={({nativeEvent}) =>
              setSelection(nativeEvent.selection)
            }
            value={commentText}
            returnKeyType="done"
            style={{
              height: pt(36),
              width: pt(300),
              backgroundColor: '#FAFAFA',
              borderRadius: pt(5),
            }}
            placeholder={
              replyObj.reply_to_name ? `回复${replyObj.reply_to_name}` : '评论'
            }></TextField>
          <TouchableOpacity onPress={handleEmoji}>
            <Icon
              style={{marginLeft: pt(10)}}
              assetName="emo"
              assetGroup="page.friends"
              size={pt(26)}></Icon>
          </TouchableOpacity>
        </View>
        <Emoji
          setEmoji={setEmoji}
          value={commentText}
          height={isShowEmoji ? 305 : 0}></Emoji>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentMain: {
    ...StyleSheet.absoluteFillObject,
  },

  commentMark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,.02)',
  },

  inputMain: {
    position: 'absolute',
    bottom: pt(0),
    width: '100%',
    padding: pt(15),
    backgroundColor: Colors.white,
    elevation: 1.5,
    shadowColor: Colors.color999,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputWithKeyboard: {
    bottom: pt(300),
  },

  //   commentMark:{
  //     ...StyleSheet.absoluteFillObject,
  //     backgroundColor:'rgba(0,0,0,.02)'
  //   },
});
