---
date: 2022-08-02 19:42
path: /articles/vercel-deploy-express
tags:
  - 教程
  - 网站建设
  - 总结
title: Vercel部署Node.js Express项目
---

Vercel 是一个强大的网站托管服务

<!--more-->

## 一、注册 vercel

官网：https://vercel.com/

推荐用 github 直接登录注册，注册时会要求验证手机号。

## 二、安装 vercel

本地安装 Vercel

```bash
npm i vercel -g
```

登录 Vercel

```bash
vercel login
```

## 三、创建 Express 项目

使用 **express-generator** 快速创建应用程序框架

1. 安装 express-generator

   ```bash
   npm install -g express-generator
   ```

2. 在当前工作目录中创建名为 _myapp_ 的 Express 应用程序并将视图引擎将设置为 ejs

   ```bash
   express --view=ejs myapp
   ```

3. 安装依赖

   ```bash
   npm install
   ```

   生成的应用程序具有以下目录结构：

   ```text
   .
   ├── app.js
   ├── bin
   │   └── www
   ├── package.json
   ├── public
   │   ├── images
   │   ├── javascripts
   │   └── stylesheets
   │       └── style.css
   ├── routes
   │   ├── index.js
   │   └── users.js
   └── views
       ├── error.pug
       ├── index.pug
       └── layout.pug

   7 directories, 9 files
   ```

4. 在根目录创建*index.js*，将 bin/www 里的代码复制到 index.js 中后即可删除 bin 目录，并对代码中导入的 app 模块路径进行修改；由于 3000 端口默认会被 Vercel 使用，所以 Express 服务要换个端口，在 index.js 中修改预设的 3000 端口
5. 在 package.json 中的 scripts 下添加

    ```json [package.json]
    {
      "scripts": {
        "build": "node index.js" // [!code ++]
      }
    }
    ```

6. 下载 `@vercel/node` 包

   ```bash
   npm i @vercel/node -S
   ```

7. 在根目录创建*vercel.json*，写入以下配置

   ```json [vercel.json]
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/"
       }
     ]
   }
   ```

## 四、部署 Node 服务

本地测试

```bash
vercel dev
```

部署服务

```bash
vercel
```

后续部署时会提示 `Deployed to production. Run vercel --prod to overwrite later`，所以要更新应用（资源）

```bash
vercel --prod
```
