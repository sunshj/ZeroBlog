---
date: 2022-03-09 00:09
path: /articles/hexo-tidio
tags:
  - 教程
  - 网站建设
  - 总结
title: Hexo添加Tidio在线聊天
---

Tidio界面优雅简洁，支持多渠道回复，网页、Windows、安卓、IOS，关键是免费功能对普通用户完全够用。

<!--more-->

## 注册账号

访问[Tidio](https://www.tidio.com/panel/register)注册账号，可以使用邮箱注册。

## 自定义

进入账户界面后，可以根据自己的喜好定制，可选颜色，语言，布局，侧边栏等等。

找到账户面板的Public Key ，待会儿会用到。

## 安装

在Hexo主题配置文件`_config.yml`添加如下代码

```yaml
# Tidio online chat
tidio:
  enable: true
  key: # 替换为你的Public Key
```

在Hexo主题目录下的`layout/_partial/footer.ejs`中添加如下代码

```ejs
<!-- 在线通讯Tidio -->
<% if (theme.tidio.enable){ %>
<script src="//code.tidio.co/<%- theme.tidio.key %>.js"></script>
<% } %>
```

到此Tidio的安装就完成了，Hexo三连后刷新页面，在右下角就能看到效果。

```bash
hexo clean && hexo g && hexo s
```
