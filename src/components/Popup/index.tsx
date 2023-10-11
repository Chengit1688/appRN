import React from 'react';
import {View, Dialog} from 'react-native-ui-lib';
import type {DialogProps} from 'react-native-ui-lib';
import {TouchableOpacity} from 'react-native';
import SvgIcon from '../SvgIcon';
import {pt} from '@/utils/dimension';

type PopupProps = {
  showClose?: boolean;
} & DialogProps;

const Popup = (props: PopupProps) => {
  const {showClose = true} = props;
  return (
    <Dialog
      center
      overlayBackgroundColor="rgba(0, 0, 0, 0.40)"
      transparent
      {...props}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <View>{props?.children}</View>
        {!!showClose && (
          <TouchableOpacity
            style={{
              marginTop: pt(30),
            }}
            onPress={() => {
              props?.onDismiss?.();
            }}>
            <SvgIcon name="close" size={pt(33)} />
          </TouchableOpacity>
        )}
      </View>
    </Dialog>
  );
};
export default Popup;
