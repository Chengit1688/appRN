import CryptoJS from 'react-native-crypto-js';
/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
export function aesIvEncrypt(word, aseKey = '1122334455667788', iv = '') {
  var key = CryptoJS.enc.Utf8.parse(aseKey); //将秘钥转换成Utf8字节数组
  //加密
  var encrypt = CryptoJS.AES.encrypt(word, key, {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return window.btoa(encrypt.ciphertext.toString()); //加密后的数据
}

export const AESDecData = (
  data,
  key = '5oHzKCZlP0oV0F5F',
  iv = '5oHzKCZlP0oV0F5F',
) => {
  // 这里的data是WordBuffer类型的数据
  // return new Promise((resolve) => {
  //   const bKey = CryptoJS.enc.Utf8.parse(key);
  //   const bIv = CryptoJS.enc.Utf8.parse(iv);
  //   const decrypt = CryptoJS.AES.decrypt({ ciphertext: data }, bKey, { iv: bIv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  //   const arrayBuffer = WordArrayToArrayBuffer(decrypt);
  //   resolve(arrayBuffer)
  // })
  const bKey = CryptoJS.enc.Utf8.parse(key);
  const bIv = CryptoJS.enc.Utf8.parse(iv);
  const decrypt = CryptoJS.AES.decrypt({ciphertext: data}, bKey, {
    iv: bIv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  const arrayBuffer = WordArrayToArrayBuffer(decrypt);
  return arrayBuffer;
};

export function ArrayBufferToWordArray(arrayBuffer) {
  const u8 = new Uint8Array(arrayBuffer, 0, arrayBuffer.byteLength);
  const len = u8.length;
  const words = [];
  for (let i = 0; i < len; i += 1) {
    words[i >>> 2] |= (u8[i] & 0xff) << (24 - (i % 4) * 8);
  }
  return CryptoJS.lib.WordArray.create(words, len);
}

export const WordArrayToArrayBuffer = wordArray => {
  const {words} = wordArray;
  const {sigBytes} = wordArray;
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i += 1) {
    const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    u8[i] = byte;
  }
  return u8;
};
const AES_KEY = '1122334455667788'; // 密钥, AES-128 需16个字符, AES-256 需要32个字符
const AES_IV = '1122334455667788'; // 密钥偏移量，16个字符

const key = CryptoJS.enc.Utf8.parse(AES_KEY);
const iv = CryptoJS.enc.Utf8.parse(AES_IV);

// 加密
export function encrypt(data) {
  const srcs = CryptoJS.enc.Utf8.parse(data);

  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

// 解密
export function decrypt(data) {
  const decrypted = CryptoJS.AES.decrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypted).toString();
}
