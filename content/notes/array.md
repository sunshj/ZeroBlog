---
title: 数组
date: '2023-02-27 14:44:36'
path: /notes/array
---


## 数组洗牌

```ts [shuffleArray.ts]
function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
```


 

## 数组去重

```ts [uniqueBy.ts]
function uniqueBy<T, K extends keyof T>(array: T[], getKey?: K | ((item: T) => T[K])) {
  const result: T[] = []
  const keys = new Set()

  array.forEach(item => {
    const key = getKey ? (typeof getKey === 'function' ? getKey(item) : item[getKey]) : item
    if (!keys.has(key)) {
      keys.add(key)
      result.push(item)
    }
  })

  return result
}

```