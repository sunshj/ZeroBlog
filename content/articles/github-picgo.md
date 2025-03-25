---
date: 2022-04-15 10:32
path: /articles/github-picgo
tags:
  - 分享
  - 总结
title: GitHub + jsDelivr + PicGo图床
---

此篇介绍如何搭建 GitHub + jsDelivr + PicGo的免费图床<!--more-->

## 一、Github配置

1、创建一个`公开(public)`的Github资料库(repository)：例如`staticfile`

2、点击个人账号头像，点击`settings`，点击`Developer settings`，点击`Personal access tokens`，点击`Generate New token`，输入自定义`Note`名 ，并勾选`repo`所有的选项。

| ![](https://cdn.jsdelivr.net/gh/sunshj/Staticfile/img/github-create-tokens.png) |
| :-----------------------------------------------------------------------------: |

**创建完成后会生成Token，只会出现一次，记得保存备用。**

## 二、PicGo上传图片工具下载配置

1、下载地址：[https://github.com/Molunerfinn/PicGo/releases](https://github.com/Molunerfinn/PicGo/releases)

2、PicGo选择配置github图床

- 设定仓库名：`github账号/仓库名`
- 设定分支名：`master`
- 设定Token：填写刚才我们生成的 Token
- 指定存储路径：如果需要指定子目录可以填写例如 `img/`，不填则会上传至仓库根目录
- 设定自定义域名：` https://cdn.jsdelivr.net/gh/github账号/仓库名`
- 最后设为默认图床，下次再上传图片就会自动上传到 github 图床了。

| ![](https://cdn.jsdelivr.net/gh/sunshj/Staticfile/img/picgo-github-setting.png) |
| :-----------------------------------------------------------------------------: |

3、配置好之后，就可以切换到 “上传区” 选择 “图片上传 - GitHub图床” 后就可以上传图片了，支持拖拽、点击、剪贴板上传，上传后，图片链接会自动复制到剪贴板中。
