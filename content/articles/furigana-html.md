---
title: HTML振假名表示法
path: /articles/furigana-html
tags: 
    - 总结 
date: '2021-02-21 18:38:22'
updated: '2021-04-07 08:17:27'
---

#### 基本语法

```html
<ruby>汉字<rp>(</rp><rt>假名</rt><rp>)</rp></ruby>
```

示例：<ruby>汉字<rp>(</rp><rt>假名</rt><rp>)</rp></ruby>

##### 1.假名直接表示

```
その
```

その

##### 2.单个汉字单个假名

```html
<ruby>換<rp>(</rp><rt>か</rt><rp>)</rp></ruby>
```

<ruby>換<rp>(</rp><rt>か</rt><rp>)</rp></ruby>

##### 3.单个汉字多个假名

```html
<ruby>夢<rp>(</rp><rt>ゆめ</rt><rp>)</rp></ruby>
```

<ruby>夢<rp>(</rp><rt>ゆめ</rt><rp>)</rp></ruby>

##### 4.多个汉字假名标注

```html
<ruby>空飛<rp>(</rp><rt>そらと</rt><rp>)</rp></ruby>
```

<ruby>空飛<rp>(</rp><rt>そらと</rt><rp>)</rp></ruby>

##### 5.按行标注汉字假名

```html
<p><ruby>空飛<rp>(</rp><rt>そらと</rt><rp>)</rp></ruby>ぶ<ruby>羽根<rp>(</rp><rt>はね</rt><rp>)</rp></ruby>と<ruby>引<rp>(</rp><rt>ひ</rt><rp>)</rp></ruby>き<ruby>換<rp>(</rp><rt>か</rt><rp>)</rp></ruby>えに</p>
```

<ruby>空飛<rp>(</rp><rt>そらと</rt><rp>)</rp></ruby>ぶ<ruby>羽根<rp>(</rp><rt>はね</rt><rp>)</rp></ruby>と<ruby>引<rp>(</rp><rt>ひ</rt><rp>)</rp></ruby>き<ruby>換<rp>(</rp><rt>か</rt><rp>)</rp></ruby>えに
