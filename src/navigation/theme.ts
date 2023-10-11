import {DefaultTheme, DarkTheme} from '@react-navigation/native';

// TODO: darkMode判断
const defaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // primary: '', // 主颜色
    background: '#ffffff', //页面背景色
    card: '#ffffff', //组件tab/header背景色
    text: '#000000', //文字颜色
    // border: '', //组件边框颜色
    // notification: '', //badge背景色
  },
  dark: false, //是否深色模式
};

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    // primary: '', // 主颜色
    background: '#000000', //页面背景色
    card: '#000000', //组件tab/header背景色
    text: '#ffffff', //文字颜色
    // border: '', //组件边框颜色
    // notification: '', //badge背景色
  },
  dark: true, //是否深色模式
};

export {darkTheme, defaultTheme};
