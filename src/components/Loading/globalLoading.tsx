import RootSiblings from 'react-native-root-siblings';
import { LoaderScreen } from 'react-native-ui-lib';
import {ActivityIndicator} from "@ant-design/react-native"
import React from 'react';
import {View, StyleSheet} from 'react-native';

/**
 * @description 全局loading视图
 *
 * 示例
 * import GlobalLoading from '../utils/GlobalLoading';
 * GlobalLoading.startLoading(); //或 GlobalLoading.startLoading({text: '图片上传中'});
 * GlobalLoading.endLoading();
 */

let sibling:any;
export default class GlobalLoading {
  /**
   * 展示loading
   * @param {text: string} 提示文案
   */
  static startLoading(...args: any[]) {
    let text = '';
    for (var element of args) {
      if (element instanceof Object && element.hasOwnProperty('text')) {
        text = element.text;
        break;
      }
    }
    let tip = text && text.length ? text : '加载中...';
    if (!sibling) {
      //创建
      sibling = new RootSiblings(
        (
            <View style={styles.sibling}>
                <ActivityIndicator animating toast size="large" text={tip} />
            </View>
        )
      );
    } else {
      //更新
      sibling.update(
        <View style={styles.sibling}>
          <ActivityIndicator animating toast size="large" text={tip} />
        </View>,
      );
    }
  }

  /**
   * @description: loading销毁
   */
  static endLoading = () => {
    sibling.destroy();
  };
}



const styles = StyleSheet.create({
  sibling: {
    position: 'absolute', //需设，否则背景色完全不透明，完全看不到当前页面
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    opacity: 1,
  },
});

