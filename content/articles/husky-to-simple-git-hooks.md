---
date: 2024-10-11 16:05
path: /articles/husky-to-simple-git-hooks
tags:
  - 分享
  - 总结
title: 从 husky 迁移到 simple-git-hooks
---

在[配置统一的开发规范](/articles/configure-project/)中用到了 husky，现在我需要从 husky 迁移到 simple-git-hooks

<!--more-->

1. 删除 husky

```bash
npm un husky
rimraf .husky
git config core.hooksPath .git/hooks/
```

2. 安装 simple-git-hooks

```bash
npm i -D simple-git-hooks
```

3. 配置 package.json

```json [package.json]
{
  "scripts": {
    "prepare": "simple-git-hooks" // [!code ++]
  },
  "simple-git-hooks": { // [!code ++]
    "pre-commit": "npx lint-staged" // [!code ++]
  } // [!code ++]
}
```
