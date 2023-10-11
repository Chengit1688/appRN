import {Colors} from 'react-native-ui-lib';

export const initColor = () => {
  Colors.loadColors({
    error: '#ff2442',
    success: '#00CD8B',
    text: '#222222',
    primary: '#7581FF',
    black: '#000',
    white: '#fff',
  });
};
