import {useColorScheme} from 'react-native';

// 当前主题，可根据系统主题返回，也可以自定义多种主题逻辑
export default function useCustomColorScheme() {
  const scheme = useColorScheme();

  return scheme;
}
