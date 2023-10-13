import React, {useContext, useState} from 'react';

import {LocalContext} from '../../Contexts/LocalUserContext';
import RtcContext from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import {DispatchType} from '../../Contexts/RtcContext';
import {IRtcEngine} from 'react-native-agora';

import PropsContext, {
  ToggleState,
  UidInterface,
} from '../../Contexts/PropsContext';
const SwitchAudioType: React.FC = () => {
  const {styleProps, callbacks} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {switchCamera} = localBtnStyles || {};
  const {RtcEngine, dispatch} = useContext(RtcContext);
  const [speaker, setSpeaker] = useState(true);

  const localUser = useContext(LocalContext);
  return (
    <BtnTemplate
      name={speaker ? 'speaker' : 'receiver'}
      btnText={speaker ? '扬声器' : '听筒'}
      style={{...styles.localBtn, ...(switchCamera as object)}}
      onPress={() => {
        setSpeaker(!speaker);
        RtcEngine.setEnableSpeakerphone(!speaker);
      }}
    />
  );
};
export const muteAudioType = async (
  local: UidInterface,
  dispatch: DispatchType,
  RtcEngine: IRtcEngine,
) => {
  const localState = local.defaultToSpeaker;
  // 类型是默认扬声器，切换为听筒
  if (localState === ToggleState.speaker) {
    try {
      RtcEngine.setEnableSpeakerphone(false);
      dispatch({
        type: 'DefaultToSpeaker',
        value: [ToggleState.receiver],
      });
    } catch (e) {
      dispatch({
        type: 'DefaultToSpeaker',
        value: [ToggleState.speaker],
      });
    }
  } else {
  }
};

export default SwitchAudioType;
