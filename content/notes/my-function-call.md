---
title: 手写 call
date: '2024-04-17 14:02:27'
path: /notes/my-function-call
---
call 方法用于调用一个函数，并指定该函数的 this 值和参数。

::code-group

```js
Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx === null || ctx === undefined ? globalThis : new Object(ctx)
  const key = Symbol('fn')
  Object.defineProperty(ctx, key, {
    enumerable: false,
    value: this
  })
  const result = ctx[key](...args)
  delete ctx[key]
  return result
}
```

```js
// 测试
const obj = {
  test(a, b) {
    console.log(this)
    return a + b
  }
}

obj.test.myCall(obj, 1, 2)
```

::
