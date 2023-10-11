import {Typography, Colors} from 'react-native-ui-lib';
import {pt} from '../dimension';

export const initTypography = () => {
  // 加载排版
  Typography.loadTypographies({
    bold: {
      fontWeight: '700',
    },
    fw100: {
      fontWeight: '100',
    },
    fw200: {
      fontWeight: '200',
    },
    fw300: {
      fontWeight: '300',
    },
    fw400: {
      fontWeight: '400',
    },
    fw500: {
      fontWeight: '500',
    },
    fw600: {
      fontWeight: '600',
    },
    fw700: {
      fontWeight: '700',
    },
    fw800: {
      fontWeight: '800',
    },
    // fontsize
    text12: {
      fontSize: pt(12),
    },
    text13: {
      fontSize: pt(13),
    },
    text14: {
      fontSize: pt(14),
    },
    text15: {
      fontSize: pt(15),
    },
    text16: {
      fontSize: pt(16),
    },
    text17: {
      fontSize: pt(17),
    },
    text18: {
      fontSize: pt(18),
    },
    text19: {
      fontSize: pt(19),
    },
    // space
    'paddingH-12': {
      paddingHorizontal: pt(12),
    },
    'paddingV-12': {
      paddingVertical: pt(12),
    },
    'paddingH-13': {
      paddingHorizontal: pt(13),
    },
    'paddingV-13': {
      paddingVertical: pt(13),
    },
    'paddingH-16': {
      paddingHorizontal: pt(16),
    },
    'paddingV-16': {
      paddingVertical: pt(16),
    },
    'paddingH-20': {
      paddingHorizontal: pt(20),
    },
    'paddingV-20': {
      paddingVertical: pt(20),
    },
  });
};
