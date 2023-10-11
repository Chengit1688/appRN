import React, { useEffect, useRef } from 'react';
import {
	View,
	Text,
	Avatar,
	Icon,
	TouchableOpacity,
	RadioButton,
} from 'react-native-ui-lib';
import { shallowEqual, useSelector } from 'react-redux';

import {pt} from '@/utils/dimension';
import {IMSDK} from '@/utils/IMSDK'
import { RootState } from '@/store';


interface IProps {
    type?: number;
    content?: string;
    group?: any;
}

function SysMessage(props: IProps) {

    const {type} = props
    const settingInfo = useSelector<RootState>((state) => state.conversation.settingInfo, shallowEqual) || {};
    let content = props.content;
    if (type === IMSDK.MessageType.GROUP_CREATE_NOTIFY) {
        content = content?.replace('${groupName}', settingInfo?.name)
    }
	return (
        <View
          center
          style={{
            marginTop: pt(34),
            marginBottom: pt(25),
          }}>
          <Text
            style={{
              fontSize: pt(11),
              fontWeight: 'bold',
              color: '#CFD4E1',
            }}>
            {content}
          </Text>
        </View>
    );
}

export default SysMessage;
