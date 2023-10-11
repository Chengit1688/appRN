import axios, {AxiosError, AxiosRequestConfig} from 'axios';

// window.__update=(number)=>{
// 	const {ipcRenderer} = require('electron')
// 	ipcRenderer.sendSync('update-badge', number);
// 	// axios.get("http://127.0.0.1:38121/update?num="+number).then(res=>{
// 	// }).catch(e=>{

// 	// })
// }
let _isPc = false;
export let setIsPc = b => {
  _isPc = b;
};

export let isPc = () => {
  return _isPc;
};

export async function updatePcIcon(number, opts) {
  console.log('更新数量', number);
  // const {ipcRenderer} = require('electron')
  if (!isPc()) return;

  axios
    .get('/update?num=' + number)
    .then(res => {})
    .catch(e => {});
  // ipcRenderer.sendSync('update-badge', number);

  if (!window['__TAURI__']) return;
  console.log('更新数量2');
  let {path, fs, tauri} = window['__TAURI__'];
  let {appWindow} = window['__TAURI__'].window;

  const defaultStyle = {
    fontColor: 'white',
    font: '20px arial',
    color: 'blue',
    fit: true,
    decimals: 0,
  };
  const imgSize = 64;
  const iconImg = new Image();
  iconImg.crossOrigin = 'anonymous';

  let style = Object.assign(defaultStyle, opts);
  let resourceDir = await path.resourceDir();
  const filePath = await path.join(resourceDir, 'assets', 'icon.png');
  const assetUrl = tauri.convertFileSrc(filePath);
  console.log('更新数量', assetUrl);
  iconImg.src = assetUrl;

  // 获取画布对象
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imgSize;
  canvas.height = imgSize;

  // 绘制背景图像
  ctx.drawImage(iconImg, 0, 0, canvas.width, canvas.height);

  function roundedRect(x, y, width, height, radius) {
    ctx.fillStyle = style.color;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
  }
  roundedRect(
    (canvas.width * 2) / 4,
    0,
    (canvas.width * 2) / 4,
    (canvas.width * 2) / 4,
    5,
  );
  //数字
  if (number != 0) {
    ctx.fillStyle = style.fontColor;
    ctx.font = style.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number + '', (canvas.width * 3) / 4, canvas.height / 4);
  }
  canvas.toBlob(res => {
    console.log('更新数量5', res);
    if (res) {
      res.arrayBuffer().then(async res => {
        const fname = 'cc_icon.png';
        await fs.writeBinaryFile(fname, res, {dir: fs.BaseDirectory.Cache});
        let icon = await path.cacheDir();
        icon = icon + '\\' + fname;

        appWindow
          .setIcon(icon)
          .then(res => {})
          .catch(e => {
            console.error('设置图标报错', e);
          });
      });
    }
  }, 'image/png');
}
