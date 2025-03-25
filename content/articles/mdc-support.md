---
title: MDC Support
date: '2024-12-09 17:47:57'
path: /articles/mdc-support
tags:
  - 总结
---

本站使用自定义的 Nuxt MDC 组件模块 [@sunshj/mdc](https://github.com/sunshj/mdc)，支持常见 Markdown 语法，并扩展了一些自定义语法。

### Heading

::code-group
::div{label="Preview" style="padding:5px 10px"}

  <ProseH1 id="heading-1">Heading 1</ProseH1>
  <ProseH2 id="heading-2">Heading 2</ProseH2>
  <ProseH3 id="heading-3">Heading 3</ProseH3>
  <ProseH4 id="heading-4">Heading 4</ProseH4>
  <ProseH5 id="heading-5">Heading 5</ProseH5>
  <ProseH6 id="heading-6">Heading 6</ProseH6>

::
 
```md [Code]
# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6
```

::

### Link

::code-group
::div{label="Preview" style="padding:5px 10px"}
  [Internal Link](/articles) :br

  [External Link](https://github.com/sunshj/mdc) :br 
  
  [`InlineCode Link`](https://github.com/sunshj/mdc)
::

```md [Code]
[Internal Link](/articles)

[External Link](https://github.com/sunshj/mdc)

[`InlineCode Link`](https://github.com/sunshj/mdc)
```

::

### Blockquote

::code-group
::div{label="Preview" style="padding:5px 10px"}

> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

::

```md [Code]
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
```

::

### Code Block

::code-group
::div{label="Preview" style="padding:5px 10px"}

```ts
export default () => {
  console.log('Code block')
}
```

```ts [With Title]
export default () => {
  console.log('Code block')
}
```

```ts{2} [Highlight Lines]
export default () => {
  console.log('Code block');
};
```

```ts [Diff Lines]
export default () => {
  console.log('Code blcok') // [!code --]
  console.log('Code block') // [!code ++]
}
```

::

````mdc [Code]
```ts
export default () => {
  console.log('Code block')
}
```

```ts [With Title]
export default () => {
  console.log('Code block')
}
```

```ts{2} [Highlight Lines]
export default () => {
  console.log('Code block');
};
```

```ts [Diff Lines]
export default () => {
  console.log('Code blcok') // [!code --]
  console.log('Code block') // [!code ++]
}
```
````

::

### Code Group

::code-group
  ::div{label="Preview" style="padding:5px 10px"}
    ::code-group
      ```bash [npm]
      npm run dev
      ```

      ```bash [pnpm]
      pnpm dev
      ```

      ```bash [yarn]
      yarn dev
      ```

      ```bash [bun]
      bun run dev
      ```
    ::
  ::

  ```mdc [Code]
  ::code-group
    ```bash [npm]
    npm run dev
    ```

    ```bash [pnpm]
    pnpm dev
    ```

    ```bash [yarn]
    yarn dev
    ```

    ```bash [bun]
    bun run dev
    ```
  ::
  ```
::

### Inline Code

::code-group
::div{label="Preview" style="padding:5px 10px"}
`code inline`

`const codeInline: string = 'highlighted code inline'`{lang="ts"}
::

```md [Code]
`code inline`

`const codeInline: string = 'highlighted code inline'`{lang="ts"}
```

::

### Horizontal Rule 

::code-group
::div{label="Preview" style="padding:5px 10px"}
Before

---

After
::

```md [Code]
Before

---

After
```

::

### Image

::code-group
::div{label="Preview" style="padding:5px 10px"}
![Photo by Drew Beamer](https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80 "Get image from unsplash.com")

[![npm version](https://img.shields.io/npm/v/@sunshj/mdc/latest.svg?style=flat&colorA=020420&colorB=00DC82)](https://npmjs.com/package/@sunshj/mdc) [![Nuxt](https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js)](https://nuxt.com)
 
::

```md [Code]
![Photo by Drew Beamer](https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80 "Get image from unsplash.com")

[![npm version](https://img.shields.io/npm/v/@sunshj/mdc/latest.svg?style=flat&colorA=020420&colorB=00DC82)](https://npmjs.com/package/@sunshj/mdc) [![Nuxt](https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js)](https://nuxt.com)
```

::

### Unordered List

::code-group
::div{label="Preview" style="padding:5px 10px"}
- First item
- Second item
- Third item
    - Indented item
    - Indented item
- Fourth item
::

```md [Code]
- First item
- Second item
- Third item
    - Indented item
    - Indented item
- Fourth item
```

::

### Ordered List

::code-group
::div{label="Preview" style="padding:5px 10px"}
1. First item
2. Second item
3. Third item
    1. Indented item
    2. Indented item
4. Fourth item
::

```md [Code]
1. First item
2. Second item
3. Third item
    1. Indented item
    2. Indented item
4. Fourth item
```

::

### Paragraph

::code-group
::div{label="Preview" style="padding:5px 10px"}
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
::

```md [Code]
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
```

::

### Strong

::code-group
::div{label="Preview" style="padding:5px 10px"}
**Just a strong paragraph.**
::

```md [Code]
**Just a strong paragraph.**
```

::

### Italic

::code-group
::div{label="Preview" style="padding:5px 10px"}
*Just an italic paragraph.*
::

```md [Code]
*Just an italic paragraph.*
```

::

### Table

::code-group
::div{label="Preview" style="padding:5px 10px"}
| Key | Type | Description |
| --- | --------- | ------------------------------------------- |
| 1 | Wonderful | Table with `some long code snippet example` |
| 2 | Wonderful | Data |
| 3 | Wonderful | Website |
::

```md [Code]
| Key | Type      | Description                                 |
| --- | --------- | ------------------------------------------- |
| 1   | Wonderful | Table with `some long code snippet example` |
| 2   | Wonderful | Data                                        |
| 3   | Wonderful | Website                                     |
```

::


### Strikethrough

::code-group
::div{label="Preview" style="padding:5px 10px"}
~~Just a strikethrough paragraph.~~
::

```md [Code]
~~Just a strikethrough paragraph.~~
```

::

 
### Task List

::code-group
::div{label="Preview" style="padding:5px 10px"}
- [x] Foo
- [ ] Bar
- [ ] Baz
::

```md [Code]
- [x] Foo
- [ ] Bar
- [ ] Baz
```

::



### Emoji

::code-group
::div{label="Preview" style="padding:5px 10px"}
:smile:
:heart:
:rocket:
::

```md [Code]
:smile:
:heart:
:rocket:
```

::
 

 ### Shortcut

::code-group
  ::div{label="Preview" style="padding:5px 10px"}
    :shortcut{value="meta"} :shortcut{value="K"} :br
    :shortcut{value="xs" size="xs"} :shortcut{value="sm"} :shortcut{value="md" size="md"}
  ::
  ```mdc [Code]
  :shortcut{value="meta"} :shortcut{value="K"} :br
  :shortcut{value="xs" size="xs"} :shortcut{value="sm"} :shortcut{value="md" size="md"}
  ```
::



