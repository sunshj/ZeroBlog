---
date: 2023-12-20 18:56
path: /articles/vue2-migrate-vite
tags:
  - 分享
  - 总结
title: vue2项目迁移vite指南
hidden: true
---

本文将会把一个使用@vue/cli 搭建的 vue 2 项目迁移到 vite

<!--more-->

仓库地址：[vue2-migrate-vite](https://github.com/sunshj/vue2-migrate-vite)

> 注意：vue 需要升级到 2.7 版本

## 一、安装、配置 vite

1. 安装 `vite@4` 和支持 `vue@2` 的插件

```bash [npm]
npm i -D vite@4 vite-plugin-vue2@2.0.3
```

2. 添加 `vite.config.js` 配置文件

```javascript [vite.config.js]
import path from 'node:path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

export default defineConfig({
  plugins: [createVuePlugin()],
  server: {
    host: '0.0.0.0',
    port: 8080
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  }
})
```

3. 修改 `package.json`

```json [package.json]
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 二、删除依赖和文件

1. 删除 `babel`，`@vue/cli`，`sass-loader` 和 `core-js` 相关依赖

```bash [npm]
npm un @babel/core @babel/eslint-parser @vue/cli-plugin-babel @vue/cli-plugin-eslint @vue/cli-plugin-router @vue/cli-plugin-vuex @vue/cli-service sass-loader core-js
```

2. 删除 `babel.config.js`，`vue.config.js` 文件

## 三、文件修改

1. `.browserslistrc` 添加 `not ie 11`

```text
> 1%
last 2 versions
not dead
not ie 11
```

2. 将 `public/index.html` 移至根目录下，删除插值模板，添加 `script`

```html [public/index.html]
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link rel="icon" href="./favicon.ico" />
    <title>vite-vue2</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./src/main.js"></script> // [!code ++]
  </body>
</html>
```

## 四、环境变量

1. 环境变量文件前缀改为 `VITE_APP`
2. 使用 `import.meta.env` 引入环境变量
3. `router/index.js` 中的 `base: process.env.BASE_URL` 可以删除

## 五、使用文件路由和布局

1. 安装依赖

```bash [npm]
npm i -D vite-plugin-pages@0.32 vite-plugin-vue-layouts@0.8
```

2. 配置 vite 插件

```javascript [vite.config.js]
import Pages from 'vite-plugin-pages' // [!code ++]
import Layouts from 'vite-plugin-vue-layouts' // [!code ++]

export default defineConfig({
  plugins: [
    createVuePlugin(),
    Pages({ routeBlockLang: 'yaml' }), // [!code ++]
    Layouts() // [!code ++]
  ]
  //...
})
```

3. 修改 `router/index.js`

```javascript [src/router/index.js]
import generatedRoutes from '~pages' // [!code ++]
import { setupLayouts } from 'virtual:generated-layouts' // [!code ++]
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = setupLayouts(generatedRoutes) // [!code ++]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
```

4. 将 `views` 目录改为 `pages` 然后按照文件路由规则修改

## 六、其他问题

1. `element-ui` 部分组件没有渲染：在 `vite.config.js` 配置 `resolve.extensions` 和 `resolve.alias`

```javascript [vite.config.js]
export default defineConfig({
  //...
  resolve: {
    extensions: ['.js', '.vue', '.json'], // [!code ++]
    alias: {
      '@': path.join(__dirname, 'src'),
      vue: 'vue/dist/vue.esm.js' // [!code ++]
    }
  }
})
```

2. `ant-design-vue` 打包问题：安装 `vite-plugin-antdv-fix` 并添加到 `plugins` 中

```bash [npm]
 npm i -D vite-plugin-antdv-fix
```

```javascript [vite.config.js]
import antdvFix from 'vite-plugin-antdv-fix' // [!code ++]

export default defineConfig({
  plugins: [
    createVuePlugin(),
    antdvFix() // [!code ++]
    //...
  ]
})
```
