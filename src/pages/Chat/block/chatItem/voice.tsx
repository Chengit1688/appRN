import {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Colors,
  TouchableOpacity,
  Hint,
  Icon,
} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import {getMsgContent} from '@/utils/common';
import Voice from '@/components/Icon/voice';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import {t, use} from 'i18next';
import {SvgIcon} from '@/components';
import {StorageFactory} from '@/utils/storage';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import _ from 'lodash';
import {updateCurrentMessageList} from '@/store/reducers/conversation';
import {RootState} from '@/store';
const actons: any = [
  // {
  //   key: 'speaker',
  //   label: '扬声器',
  // },
  // {
  //   key: 'receiver',
  //   label: '听筒播放',
  // },
];

export default function ChatVoice(row: any, isOwn: boolean) {
  const c = JSON.parse(row.content);
  const uri = getMsgContent(row);
  const id = row.msg_id;
  const [playdata, setPlayData] = useState<any>({});
  const dispatch = useDispatch();
  let audioRecorderPlayer = useRef<AudioRecorderPlayer>(
    new AudioRecorderPlayer(),
  ).current;

  const viewDiffStyle = isOwn
    ? {
        borderTopEndRadius: 0,
        backgroundColor: '#7581FF',
      }
    : {
        backgroundColor: '#F6F7FB',
        borderTopStartRadius: 0,
      };
  const textDiffStyle = isOwn
    ? {
        color: Colors.white,
      }
    : {};
  const selfInfo = useSelector(
    (state: any) => state.user.selfInfo,
    shallowEqual,
  );
  const currentMessageList = useSelector<RootState, IMSDK.Message[]>(
    state => state.conversation.currentMessageList,
    shallowEqual,
  );
  const currentConversation = useSelector<RootState, any>(
    state => state.conversation.currentConversation,
    shallowEqual,
  );
  const [showHint, setShowHint] = useState<{[key: string]: boolean}>({});

  let time: any;
  const togglePlay = async () => {
    audioRecorderPlayer.stopPlayer();
    clearTimeout(time);
    let data = (await StorageFactory.getLocal('IM_AUDIO_PLAY')) || {};

    if (!data[id]) {
      data[id] = true;

      try {
        audioRecorderPlayer.startPlayer(uri);
      } catch (error) {
        console.log(error, 'error');
      }
      Object.keys(data).forEach((item: any) => {
        data[item] = item === id ? true : false;
      });
      time = setTimeout(() => {
        StorageFactory.setLocal('IM_AUDIO_PLAY', {
          [id]: false,
        });
        setPlayData({
          ...playdata,
          [id]: false,
        });
      }, c.audio_info?.duration * 1000);
      // audioRecorderPlayer.addPlayBackListener(res => {
      //   console.log(res.currentPosition, res.duration, '播放进度');
      //   if (res.currentPosition >= res.duration) {
      //     StorageFactory.setLocal('IM_AUDIO_PLAY', {
      //       [id]: false,
      //     });
      //     setPlayData({
      //       ...playdata,
      //       [id]: false,
      //     });
      //   }
      //   return;
      // });
      setPlayData(data);
      StorageFactory.setLocal('IM_AUDIO_PLAY', data);
    } else {
      audioRecorderPlayer.stopPlayer();
      data[id] = false;
      setPlayData({
        ...playdata,
        [id]: false,
      });
      StorageFactory.setLocal('IM_AUDIO_PLAY', data);
    }
  };
  const getAction = useCallback((row: any) => {
    const _actons = _.clone(actons);
    if (row.send_id == selfInfo.user_id) {
      _actons.push({
        key: 'revoke',
        label: '撤回',
      });
    }
    return _actons;
  }, []);
  const toggleCurrentHint = (id: string) => {
    let data = {...showHint};
    if (data[id]) {
      delete data[id];
    } else {
      data[id] = true;
    }
    setShowHint(data);
  };
  const onPress = (id: string, key: string) => {
    switch (key) {
      case 'revoke':
        imsdk.revokeMessage([row], currentConversation).then(() => {
          // reverMsgCallBack(row.msg_id);
        });
        break;
      case 'receiver':
        break;
    }
  };
  const reverMsgCallBack = useCallback(
    (msg_id: any) => {
      const index = currentMessageList.findIndex(i => i.msg_id === msg_id);

      const deepCloneMsg = JSON.parse(JSON.stringify(currentMessageList));
      console.log(index, deepCloneMsg, '===>deepCloneMsg1111');
      deepCloneMsg.splice(index, 1);
      console.log(index, deepCloneMsg, '===>deepCloneMsg2222');
      dispatch(
        updateCurrentMessageList({
          data: deepCloneMsg,
        }),
      );
    },
    [currentMessageList],
  );

  return (
    <View
      style={{
        padding: pt(12),
        borderRadius: pt(7),
        ...viewDiffStyle,
      }}>
      <Hint
        visible={showHint[id]}
        color={'#4C4C4C'}
        removePaddings={true}
        borderRadius={pt(5)}
        onBackgroundPress={() => toggleCurrentHint(id)}
        customContent={(() => {
          return (
            <View
              row
              style={{
                flexWrap: 'wrap',
                width: pt(68),
                paddingTop: pt(10),
                paddingBottom: pt(10),
              }}>
              {getAction(row).map(item => {
                return (
                  <TouchableOpacity
                    key={item.key}
                    activeOpacity={1}
                    onPress={() => {
                      onPress(id, item.key);
                    }}>
                    <View
                      center
                      style={{
                        width: pt(60),
                        height: pt(60),
                      }}>
                      <Icon
                        assetName={item.key}
                        assetGroup="page.chat"
                        size={pt(15)}
                        style={{
                          width: pt(30),
                          height: pt(30),
                          marginBottom: pt(6),
                        }}
                      />
                      <Text
                        style={{
                          fontSize: pt(12),
                          color: '#FFFFFF',
                        }}>
                        {t(item.label)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })()}>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={() => {
            if (getAction(row).length > 0) {
              setShowHint({
                [row.msg_id]: true,
              });
            }
          }}
          onPress={() => {
            togglePlay();
          }}
          center
          row>
          <Text
            style={{
              marginRight: pt(5),
              ...textDiffStyle,
            }}>
            {c.audio_info?.duration}”
          </Text>
          <Voice white={isOwn} isPlay={playdata[id]} />
        </TouchableOpacity>
      </Hint>
    </View>
  );
}
