import {StatusBar, ViewStyle, TextStyle} from 'react-native';
import {Text, View} from 'react-native-ui-lib';
import {useRoute, useNavigation, useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {pt} from '@/utils/dimension';
import {useApp} from '@/hooks';

import HeaderLeft from '../HeaderLeft';
import HeaderRightButton from '../HeaderRight/button';
import HeaderRightMore from '../HeaderRight/more';

export const headerHeight = 55;

function Left(children: any | any[]) {
  return children;
}

function Right(children: any | any[]) {
  return children;
}

function Middle(children: any | any[]) {
  return children;
}

function Header({
  children,
  left,
  middle,
  right,
  title,
  nextPress,
  savePress,
  titleLeft,
  darkMode,
  bgColor,
  hideBar,
  hideTitle,
  hideHeader,
  hide,
}: {
  children?: Array<JSX.Element> | JSX.Element | undefined;
  left?: JSX.Element | undefined;
  middle?: JSX.Element | undefined;
  right?: JSX.Element | undefined;
  title?: string;
  nextPress?: () => void;
  savePress?: () => void;
  titleLeft?: boolean;
  darkMode?: boolean;
  bgColor?: string;
  hideBar?: boolean;
  hideTitle?: boolean;
  hideHeader?: boolean;
  hide?: boolean;
}) {
  const isDarkMode = darkMode || useApp().darkMode;
  const insets = useSafeAreaInsets();
  // 导航
  const {canGoBack, goBack, getState} = useNavigation();
  const {params, name} = useRoute();
  const route = useRoute();
  const state = getState();
  const {colors} = useTheme();

  // 内容样式
  let wrapStyle: ViewStyle = {backgroundColor: bgColor ?? colors.card};
  let titleStyle: TextStyle = {color: colors.text};
  let titleWrapStyle: ViewStyle = {alignItems: 'center'};

  if (titleLeft) {
    titleStyle = {
      ...titleStyle,
      paddingLeft: pt(16),
    };
    titleWrapStyle = {alignItems: 'flex-start'};
  }

  const renderLeft = () => {
    if (titleLeft) return null;
    if (!canGoBack) return null;
    if (left) return left;
    if (children !== undefined) {
      if (Array.isArray(children)) {
        let arr: JSX.Element[];
        arr = children.filter(val => {
          return val.type.name == 'Left';
        });
        if (arr[0]) {
          return arr[0];
        }
      } else if (children.type.name == 'Left') {
        return children;
      }
    }
    return <HeaderLeft />;
  };

  const renderMiddle = () => {
    if (hideTitle) return null;
    if (middle) return middle;
    if (children !== undefined) {
      if (Array.isArray(children)) {
        let arr: JSX.Element[];
        arr = children.filter(val => {
          return val.type.name == 'Middle';
        });
        if (arr[0]) {
          return arr[0];
        }
      } else if (children.type.name == 'Middle') {
        return children;
      }
    }
    return (
      <Text
        style={{
          fontSize: pt(18),
          ...titleStyle,
        }}>
        {title ?? name}
      </Text>
    );
  };

  const renderRight = () => {
    if (nextPress) return <HeaderRightMore onPress={nextPress} />;
    if (savePress) return <HeaderRightButton onPress={savePress} />;
    if (right) return right;
    if (children !== undefined) {
      if (Array.isArray(children)) {
        let arr: JSX.Element[];
        arr = children.filter(val => {
          return val.type.name == 'Right';
        });
        if (arr[0]) {
          return arr[0];
        }
      } else if (children.type.name == 'Right') {
        return children;
      }
    }
    return null;
  };

  return (
    <>
      <StatusBar
        animated={false} // backgroundColor/barStyle/hidden改变是否使用动画效果
        showHideTransition="none" // hidden改变使用的动画效果
        hidden={hideBar === true} //是否显示状态栏
        barStyle={darkMode ? 'light-content' : 'dark-content'} // 文本颜色
        backgroundColor="transparent" // 仅android支持，背景色
        translucent // 仅android支持，是否透明，true则内容区域延申至状态栏位置
      />
      {hide ? null : (
        <View
          style={{
            ...wrapStyle,
          }}>
          <View
            style={{
              height: StatusBar.currentHeight || insets.top,
            }}
          />
          {hideHeader ? null : (
            <View
              row
              spread
              centerV
              style={{
                position: 'relative',
                height: pt(headerHeight),
              }}>
              <View
                flex
                style={{
                  ...titleWrapStyle,
                }}>
                {renderMiddle()}
              </View>
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                }}>
                {renderLeft()}
              </View>
              <View
                style={{
                  position: 'absolute',
                  right: 0,
                }}>
                {renderRight()}
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
}

Header.Left = Left;
Header.Right = Right;
Header.Middle = Middle;

export default Header;
