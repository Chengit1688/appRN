import {pt} from '@/utils/dimension';
import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type props = {
  isShow: boolean;
  buttons: any;
  onCancel: () => void;
};

const ActionSheet = ({buttons = [], isShow, onCancel}: props) => {
  const newButtons = [
    ...buttons,
    {
      label: '取消',
      textStyle: {borderTopWidth: pt(5), borderTopColor: '#F6F7F9'},
      onClick: () => onCancel(),
    },
  ];
  return isShow ? (
    <View style={styles.showMain}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.outSideView}
        onPress={onCancel}
      />
      <Modal
        animationType={'slide'}
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={onCancel}>
        <View style={styles.container}>
          {newButtons.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.openButton}
              onPress={item.onClick}
              activeOpacity={1}>
              <View style={[styles.textItem, item.textStyle]}>
                <Text style={[styles.buttonTitle]}>{item.label}</Text>
                {item.tips ? (
                  <Text style={styles.tips}>{item.tips}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  ) : null;
};

export default ActionSheet;

const styles = StyleSheet.create({
  showMain: {
    ...StyleSheet.absoluteFillObject,
  },
  outSideView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.4)',
    height: Dimensions.get('window').height,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: pt(-20),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 30,
    overflow: 'hidden',
    borderWidth: pt(0.5),
    borderColor: '#d1d1d1',
  },
  openButton: {
    width: '100%',
    height: pt(60),
    lineHeight: pt(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textItem: {
    paddingTop: pt(14),
    paddingBottom: pt(14),
    width: '100%',
  },
  buttonTitle: {
    fontSize: pt(16),
    color: '#000000',

    textAlign: 'center',
  },
  tips: {
    fontSize: pt(12),
    color: '#666666',
    textAlign: 'center',
  },
});
