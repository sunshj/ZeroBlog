---
title: 节流与防抖
date: '2023-02-26 21:02:00'
path: /notes/throttle-debounce
---

## 节流

节流函数：在指定时间内只执行一次

 ```ts [throttle.ts]
function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => ReturnType<T> | void {
  let lastTime = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      return fn.apply(this, args);
    }
  };
}
```


## 防抖
防抖函数：在指定时间内只执行最后一次

```ts [debounce.ts]
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: number | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```