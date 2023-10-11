import {useState} from 'react';
import {Provider} from '@ant-design/react-native';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import zhCN from '@ant-design/react-native/lib/locale-provider/zh_CN';

function AntdProvider({children}: any) {
  const [locale] = useState('zh');

  const languages: Array<any> = [
    {
      value: 'zh',
      label: '中文',
      language: zhCN,
    },
    {
      value: 'en',
      label: 'English',
      language: enUS,
    },
  ];
  const currentLocale = languages.find(item => item.value === locale);

  return <Provider locale={currentLocale.language}>{children}</Provider>;
}

export {AntdProvider};
