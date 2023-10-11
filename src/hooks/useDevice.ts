import {useState, useEffect} from 'react';
import {
  useColorScheme,
  Platform,
  PixelRatio,
  NativeModules,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export default function useDevice() {
  const [darkMode, setDarkMode] = useState('dark' === useColorScheme());

  const [userAgent] = useState(DeviceInfo.getUserAgentSync());
  const [lang, setLang] = useState('');

  useEffect(() => {
    let locale =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier;
    if (!locale) locale = 'zh-CN';
    setLang(locale);
  });

  return {
    darkMode,

    userAgent,
    lang,

    // runtime
    isIOS: 'ios' === Platform.OS,
    isAndroid: 'android' === Platform.OS,
    isWindows: 'windows' === Platform.OS,
    isMacos: 'macos' === Platform.OS,
    isWeb: 'web' === Platform.OS,

    //
    pixelRatio: PixelRatio.get(), // 像素密度比
    fontScale: PixelRatio.getFontScale(), // 用户在手机设置的字体缩放比例
  };
}
