import { useEffect, useRef } from 'react';

// 自定义hook 页面渲染第一次不触发监听
function useDidUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
}

export default {
  useDidUpdateEffect,
};
