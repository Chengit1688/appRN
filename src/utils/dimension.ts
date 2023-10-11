import {Dimensions} from 'react-native';

type ModeType = -1 | 0 | 1

// app 只有竖屏模式，所以可以只获取一次 width
const deviceWidthDp = Dimensions.get('window').width;
// UI 默认给图是 640
const uiWidthPx = 750;

// 尺寸格式化
function format(value: number, mode?: ModeType, decimal?: number) {
     let val = value
     if(mode === 0) {
          if(decimal && decimal > 0) {
               // 保留指定数量小数
               val = Math.round(value*(10**decimal))/(10**decimal)
          } else {
               // 四舍五入
               val = Math.round(value) 
          }
     } else if(mode === -1) {
          // 向下取整
          val = Math.floor(value)
     } else if(mode === 1) {
          // 向上取整
          val = Math.ceil(value)
     }
     return val
}

function rpx(uiElementPx: number, mode?: ModeType, decimal?: number): number {
     const widthPx = uiWidthPx
     let size = uiElementPx *  (deviceWidthDp / widthPx)
     size = format(size, mode, decimal)
     return size
}


function pt(uiElementPx: number, mode?: ModeType, decimal?: number): number {
     const widthPx = uiWidthPx/2 // pt比px小一倍
     let size = uiElementPx *  (deviceWidthDp / widthPx)
     size = format(size, mode, decimal)
     return size
}

function dp(uiElementPx: number, mode?: ModeType, decimal?: number): number {
     const widthPx = uiWidthPx/2 // dp比px小一倍
     let size = uiElementPx *  (deviceWidthDp / widthPx)
     size = format(size, mode, decimal)
     return size
}


function opacity(color: string, opacity: number) {
     let val = ''
     opacity = Math.max(opacity,0);
     opacity = Math.min(opacity,1);

     color = color.replace(/\#/g,'').toUpperCase(); // /^#[0-9a-fA-F]{6}$/
     if(color.length === 3){
       let arr = color.split('');
       color = '';
       for (let i = 0; i < arr.length; i++) {
         color += (arr[i] + arr[i]);//将简写的3位字符补全到6位字符
       }
     }
     let num = Math.round(255 * opacity);//四舍五入
     let str = '';
     let arrHex = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];//十六进制数组
     while (num>0) {
         let mod = num % 16;
         num = (num - mod) / 16;
         str = arrHex[mod] + str;
     }
     if(str.length == 1)str = '0' + str;
     if(str.length == 0)str = '00';
     return `#${color+str}`;
}

export {
     rpx,
     pt,
     dp,
     opacity
};