---
date: 2022-03-09 00:10
path: /articles/kanji-furigana
sticky: 100
tags:
  - 教程
  - 网站建设
  - 总结
title: 汉字标注假名转换器
---

kuroshiro是一款十分方便使用的日文转换注音工具，主要针对日文文本，进行到平假名、片假名及罗马字的转换，并支持注音假名、送假名 （旁注音）等注音模式。

<!-- more -->

> 使用到的项目为[kuroshiro](https://github.com/hexenq/kuroshiro)，[kuromoji](https://www.jsdelivr.com/package/npm/kuromoji)

## 一、演示

:kana-play

## 二、使用

### Web

导入`kuroshiro.min.js`和`kuroshiro-analyzer-kuromoji.min.js` ，其中`kuroshiro.min.js`需要使用`1.1.0`版本。

可以直接通过CDN引入：

```html
<script src="https://cdn.jsdelivr.net/npm/kuroshiro@1.1.0/dist/kuroshiro.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/kuroshiro-analyzer-kuromoji@1.1.0/dist/kuroshiro-analyzer-kuromoji.min.js"></script>
```

```javascript
// 初始化kuroshiro
const kuroshiro = new Kuroshiro()
// 初始化kuroshiro-analyzer-kuromoji
kuroshiro.init(new KuromojiAnalyzer({ dictPath: '/path/to/dict/' }))

kuroshiro
  .convert(text, {
    mode: 'furigana',
    to: 'hiragana'
  })
  .then(res => {
    console.loe(res)
  })
```

字典文件

下载[kuromoji](https://www.jsdelivr.com/package/npm/kuromoji)项目中`dict`下的gz文件(共12个)

[![](https://data.jsdelivr.com/v1/package/npm/kuromoji/badge)](https://www.jsdelivr.com/package/npm/kuromoji)

### Node

```bash
npm i kuroshiro kuroshiro-analyzer-kuromoji
```

```javascript
import _Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'

const interopDefault = m => m.default || m
const Kuroshiro = interopDefault(_Kuroshiro)

const kuroshiro = new Kuroshiro()
await kuroshiro.init(new KuromojiAnalyzer())
const result = await kuroshiro.convert(text, { mode: 'furikana', to: 'hiragana' })
console.loe(result)
```

## 三、API说明

> 此处援引kuroshiro官网API说明

### convert(str, [options])

转换指定的字符串到指定的音节文字（可在选项中配置注音模式等设置）。

**参数**

- `str` - 将被转换的字符串。
- `options` - _可选_ 转换选项，见下表。

| 选项            | 类型   | 默认值     | 描述                                                                                           |
| --------------- | ------ | ---------- | ---------------------------------------------------------------------------------------------- |
| to              | String | ‘hiragana’ | 目标音节文字 `hiragana` (平假名), `katakana` (片假名), `romaji` (罗马字)                       |
| mode            | String | ‘normal’   | 转换模式 `normal` (标准模式), `spaced` (空格分组), `okurigana` (送假名), `furigana` (注音假名) |
| romajiSystem\*  | String | “hepburn”  | 罗马字体系 `nippon` (日本式), `passport` (护照式), `hepburn` (平文式)                          |
| delimiter_start | String | ’(‘        | 分隔符 (起始)                                                                                  |
| delimiter_end   | String | ’)’        | 分隔符 (结束)                                                                                  |

\*_: `romajiSystem`参数仅当`to`参数设置为`romaji`时生效。有关这一参数的更多信息, 请见 [罗马字体系](https://kuroshiro.org/README.zh-cn.html#罗马字体系)_

**示例**

```js
// normal (标准模式)
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {
  mode: 'okurigana',
  to: 'hiragana'
})
```

结果：かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！

```js
// spaced (空格分组)
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {
  mode: 'okurigana',
  to: 'hiragana'
})
```

结果：かんじとれ たら て を つなご う 、 かさなる の は じんせい の ライン and レミ リア さいこう ！

```js
// okurigana (送假名)
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {
  mode: 'okurigana',
  to: 'hiragana'
})
```

结果：感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！

```js
// furigana (注音假名)
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {
  mode: 'furigana',
  to: 'hiragana'
})
```

结果：<ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！

### 实用工具

**示例**

```js
const result = Kuroshiro.Util.isHiragana("あ");
```

#### isHiragana(char)

判断输入字符是否是平假名。

#### isKatakana(char)

判断输入字符是否是片假名。

#### isKana(char)

判断输入字符是否是假名。

#### isKanji(char)

判断输入字符是否是日文汉字。

#### isJapanese(char)

判断输入字符是否是日文。

#### hasHiragana(str)

检查输入字符串中是否含有平假名。

#### hasKatakana(str)

检查输入字符串中是否含有片假名。

#### hasKana(str)

检查输入字符串中是否含有假名。

#### hasKanji(str)

检查输入字符串中是否含有日文汉字。

#### hasJapanese(str)

检查输入字符串中是否含有日文。

#### kanaToHiragna(str)

转换输入假名字符串至平假名。

#### kanaToKatakana(str)

转换输入假名字符串至片假名。

#### kanaToRomaji(str, system)

转换输入假名字符串至罗马字。参数`system`可选值为`"nippon"`, `"passport"`, `"hepburn"` (默认值: “hepburn”)。
