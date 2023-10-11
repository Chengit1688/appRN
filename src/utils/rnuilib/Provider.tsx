import React, {useState} from 'react';
import {useEffect, createContext} from 'react';
import {loadAssets} from './assets';
import {initColor} from './colors';
import {initTypography} from './typography';

const Context = createContext({});

export default function RnuilibProvider({children}: any) {
  const [initd, setInitd] = useState(false);
  useEffect(() => {
    loadAssets();
    initColor();
    initTypography();
    setTimeout(() => {
      // 延迟等待资源加载
      setInitd(true);
    }, 500);
  });

  return (
    <Context.Provider value={{}}>{initd ? children : null}</Context.Provider>
  );
}
