import {useEffect} from 'react'
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import langZH from '@/locales/zhCN.json'
import langEN from '@/locales/enUS.json';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(localeData);
dayjs().localeData();
dayjs.locale('zh-cn'); // ['zh-CN', 'en-US']

const resources = {
    zh: {
        translation: langZH,
    },
    en: {
        translation: langEN,
    },
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        compatibilityJSON: 'v3',
        resources,
        lng: 'zh',
        fallbackLng: "zh",
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        debug: false,
    });


const I18nProvider = ({children}) => {
    useEffect(() => {
        i18n.changeLanguage('zh');
    }, []);
    return (
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    );
}

export {i18n, I18nProvider}