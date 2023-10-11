import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import DarkTheme from '@/theme/dark';
import LightTheme from '@/theme/light';
import useCustomColorScheme from './useCustomColorScheme';
// 包裹StyleSheet的style，返回带主题色参数的函数
export default function useDynamicThemeStyle<T>(
  styleFun: (colors: ThemeColors, schemeType: 'dark' | 'light') => T,
): T {
  const scheme = useCustomColorScheme();
  const [style, setStyle] = useState<T>({});
  useEffect(() => {
    const colors: typeof LightTheme =
      scheme === 'dark' ? DarkTheme : LightTheme;
    setStyle(styleFun(colors, scheme));
  }, [scheme, styleFun]);

  return StyleSheet.create(style);
}
