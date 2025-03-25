---
date: 2022-02-24 13:28
path: /articles/hexo
tags:
  - 教程
  - 网站建设
  - 总结
title: Github+Nodejs搭建Hexo
---

## 一、使用Github Pages

只需要新建一个以`<username>.github.io`为名的repository。

## 二、安装Git Bash

官网下载[Git Bash](https://gitforwindows.org/)

## 三、安装Node.js

最新版的Node.js请从[官网](https://nodejs.org/zh-cn/)下载。

设置镜像源

```bash
npm config set registry https://registry.npm.taobao.org
```

## 四、安装Hexo

命令行执行安装，会有一些报错，但可以无视。

```bash
npm install -g hexo-cli
```

使用`hexo -v`查看版本号

### 1、初始化

新建目录如Hexo，目录中执行`hexo init`，注意，目录必须为空，否则会报错

接着执行`npm install`，安装依赖。

### 2、预览网页

`hexo g`会将md文件编译为public下的html文本，`hexo s`会将网页发布到`localhost:4000`。

至此，本地Hexo的部署基本完成。按`Ctrl+C`以可以关闭部署。

### 3、 修改主题

这里使用keep主题。

```bash
cd hexo-site
npm install hexo-theme-keep
```

安装完成后，在 Hexo 配置文件`_config.yml`中将 `theme` 设置为 `keep`。

### 4、部署到Github上

在 Hexo 配置文件`_config.yml`中添加deploy参数

```yaml
deploy:
  type: git
  repo: https://github.com/sunshj/sunshj.github.io
  branch: main
```

部署

```bash
hexo clean && hexo g && hexo d
```

## 五、Hexo美化

> 主题配置查看相关主题文档即可

### 1、永久链接

修改博客根目录配置文件 `_config.yml` 的 `permalink`：

```yaml
# permalink: :year/:month/:day/:title/
# archives是自定义字段
permalink: archives/:title/
```

### 2、全局音乐播放器

以`keep`主题为例，在主题目录下的`layout/layout.ejs`中的body里面添加以下代码，并开启主题配置文件中的`pjax`

```html
<!-- 引用依赖 -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/sunshj/Staticfile@master/aplayer/APlayer.min.css"
/>
<script src="https://cdn.jsdelivr.net/gh/sunshj/Staticfile@master/aplayer/APlayer.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/sunshj/Staticfile@master/meting/Meting.min.js"></script>

<!-- 自行替换相应值,添加data-lrcType="none"可以设置默认关闭歌词 -->
<div
  class="aplayer"
  data-id="7196241123"
  data-server="netease"
  data-type="playlist"
  data-fixed="true"
  data-autoplay="true"
  data-order="random"
  data-volume="0.2"
  data-theme="#cc543a"
  data-preload="auto"
></div>
```

### 3、文章加密

安装

```bash
npm install hexo-blog-encrypt
```

根目录配置文件`_config.yml`添加：

```yaml
# Security
encrypt: # hexo-blog-encrypt
  abstract: 有东西被加密了, 请输入密码查看.
  message: 您好, 这里需要密码.
  tags:
    - { name: tagName, password: 密码A }
    - { name: tagName, password: 密码B }
  wrong_pass_message: 抱歉, 这个密码看着不太对, 请再试试.
  wrong_hash_message: 抱歉, 这个文章不能被校验, 不过您还是能看看解密后的内容.
```

在需要加密的文章添加

```yaml
password: 你的密码
```

### 4、文章隐藏

安装

```bash
npm install hexo-hide-posts
```

根目录配置文件`_config.yml`添加：

```yaml
# hexo-hide-posts
hide_posts:
  # 可以改成其他你喜欢的名字
  filter: hidden
  # 指定你想要传递隐藏文章的位置，比如让所有隐藏文章在存档页面可见
  # 常见的位置有：index, tag, category, archive, sitemap, feed, etc.
  # 留空则默认全部隐藏
  public_generators: []
  # 为隐藏的文章添加 noindex meta 标签，阻止搜索引擎收录
  noindex: true
```

在需要加密的文章添加

```yaml
hidden: true
```
