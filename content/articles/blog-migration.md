---
title: 博客迁移至 Nuxt
date: '2024-11-25 23:49:59'
path: /articles/blog-migration
sticky: 900
tags: 
  - 网站建设
---

之前的博客使用的是 Hexo + [Keep主题](https://github.com/theme-keep)，最近开始学习 Nuxt，于是就使用 Nuxt 技术栈重写了博客。
<!--more-->
~~一开始想要做个全栈的博客，略微思索后发觉貌似没那个必要，索性直接用 Nuxt Content 了，最终生成的是一个静态网站，部署在 Vercel 上。~~

2025年3月27日更新：为博客添加了后台，但不需要数据库，只需使用Github登录，即可在线编写博客。

## 技术栈

- Nuxt 3
- Nuxt Content v2
- Nuxt MDC  (使用了自定义的 Nuxt MDC 组件模块 [@sunshj/mdc](https://github.com/sunshj/mdc))
- Nuxt Icon
- Nuxt Image
- UnoCSS 
- giscus (评论系统)
- fuse.js (搜索，支持类Unix搜索命令，[详见](https://www.fusejs.io/examples.html#extended-search))


## 网站评分
![PageSpeed Insights](https://cdn.jsdelivr.net/gh/sunshj/Staticfile/images/pagespeed-20250327212529.png)

## TODO

- [ ] 文章加密
- [x] OG Image
- [x] 首屏
- [x] 站点地图
- [x] RSS

 
