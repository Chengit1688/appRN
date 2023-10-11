import React from 'react';
import {Text, View} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import Popup from '@/components/Popup';
import {useTranslation} from 'react-i18next';
import FullButton from '../FullButton';

type ConfirmModalProps = {
  showClose?: boolean;
  visible: boolean;
  onClose: (visible: boolean) => void;
  onConfirm: () => void;
  title: any;
  content: string;
};
const ConfirmModal = (props: ConfirmModalProps) => {
  const {
    title,
    content,
    showClose = false,
    visible,
    onClose,
    onConfirm,
  } = props;
  const {t} = useTranslation();

  return (
    <>
      <Popup
        showClose={showClose}
        visible={visible}
        onDismiss={() => {
          onClose?.(false);
        }}>
        <View
          style={{
            borderRadius: pt(10),
            backgroundColor: '#fff',
            padding: pt(15),
            width: pt(300),
          }}>
          <Text
            style={{
              fontSize: pt(15),
              fontWeight: 'bold',
              color: '#000',
              marginBottom: pt(20),
            }}>
            {title || t('标题')}
          </Text>
          <View
            row
            centerH
            style={{
              marginVertical: pt(20),
            }}>
            <Text text16 black center fw500>
              {content}
            </Text>
          </View>
          <FullButton
            text={t('确认')}
            onPress={onConfirm}
            style={{
              width: pt(270),
              marginLeft: 0,
              marginTop: pt(20),
              marginBottom: pt(0),
              marginRight: 0,
            }}
          />
        </View>
      </Popup>
    </>
  );
};
export default ConfirmModal;
