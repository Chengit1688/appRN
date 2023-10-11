# mobileIM
## 命令
```
# 创建项目
npx react-native@latest init mobileIM

# 安装
yarn

# 运行
yarn android

# 开发
1.vscode底部栏运行React Native Packager（或者yarn start启动）
2.vscode运行调试

## package包
```
# UI库
yarn add react-native-ui-lib
yarn add react-native-reanimated react-native-gesture-handler
yarn add @react-native-community/blur @react-native-community/datetimepicker @react-native-community/netinfo @react-native-picker/picker

# Redux
yarn add @reduxjs/toolkit
yarn add redux
yarn add react-redux
yarn add redux-persist //持久化存储

# Axios
yarn add axios
yarn add react-native-axios

# React Navigation
yarn add @react-navigation/native              //依赖@react-navigation/core
yarn add @react-navigation/stack               //依赖@react-navigation/elements
yarn add @react-navigation/native-stack        //依赖@react-navigation/elements
yarn add @react-navigation/bottom-tabs         //依赖@react-navigation/elements
yarn add @react-navigation/material-top-tabs   //依赖react-native-pager-view，react-native-tab-view
yarn add react-native-screens react-native-safe-area-context

# 国际化
yarn add react-i18next i18next

# 存储
yarn add react-native-storage
yarn add @react-native-async-storage/async-storage

# 数据库相关
yarn add squel
yarn add react-native-sqlite-storage

# uuid
yarn add react-native-uuid

# env读取
yarn add react-native-config

# 开屏页
yarn add react-native-bootsplash

# 崩溃拦截
yarn add react-native-exception-handler

# 日志
yarn add react-native-logs

# 设备信息
yarn add react-native-device-info

# 文件路径别名
yarn add -D babel-plugin-root-import

# svg支持
yarn add react-native-svg
yarn add -D react-native-svg-transformer

# 加解密
yarn add react-native-crypto-js

# 汉字转拼音
yarn add pinyin-pro

# mqtt
yarn add @openrc/react-native-mqtt

# lodash
yarn add lodash-es
yarn add -D @types/lodash-es

# mock
yarn add mockjs
yarn add -D @types/mockjs

# 日期处理
yarn add dayjs
yarn add moment

# nanoid唯一id
yarn add nanoid

```

## 参考
RN中文站：https://www.reactnative.cn  
RN英文站：https://reactnative.dev  
组件库：https://reactnative.directory/  

Ant Design Mobile RN：https://rn.mobile.ant.design/index-cn  
Redux：https://redux.js.org/introduction/getting-started  
Axios：https://axios-http.com/docs/intro  
React Navigation：https://reactnavigation.org/docs/getting-started  
i18next：https://react.i18next.com/getting-started  
react-native-config：https://github.com/luggit/react-native-config  
react-native-bootsplash：https://github.com/zoontek/react-native-bootsplash  
react-native-logs：https://github.com/onubo/react-native-logs  

## react-native-ui-lib
https://wix.github.io/react-native-ui-lib/  

## React Navigation说明
react-native-screens组件在android系统下需要修改java代码，
在文件`android/app/src/main/java/<your package name>/MainActivity.java`中增加以下代码：
```
import android.os.Bundle;

public class MainActivity extends ReactActivity {
  // ...
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
  // ...
}
```

## react-native-config说明
需要配置原生代码  

## babel-plugin-root-import配置
https://www.cnblogs.com/all-smile/p/17420969.html  

# react-native-svg
https://zhuanlan.zhihu.com/p/455087948  
https://github.com/software-mansion/react-native-svg  
https://github.com/software-mansion/react-native-svg/blob/main/USAGE.md  
https://github.com/kristerkari/react-native-svg-example  

# react-native-bootsplash
yarn react-native generate-bootsplash src/assets/bootsplash_logo_original.png \
  --platforms=android,ios \
  --background=F5FCFF \
  --logo-width=150 \
  --assets-output=src/assets \
  --flavor=main
