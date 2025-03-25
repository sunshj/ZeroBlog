---
date: 2023-12-04 23:35
path: /articles/configure-project
sticky: 600
tags:
  - 总结
title: 如何配置统一的开发规范
---
为项目添加 prettier、ESLint、Stylelint、husky、lint-staged 以及 commitlint.

<!--more-->

## 不想手动配置怎么办？

如果觉得下面配置步骤过于繁琐，可使用 cli 工具自动完成配置

```bash [npm]
npm i -g sunshj
```

执行 `sun config`，如果是 pnpm monorepo 项目，需要使用 `sun config -w`

## 一、配置 Prettier

> VS Code 需要安装 [prettier 扩展](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

1. 安装 prettier

   ```bash [pnpm]
   pnpm i -D prettier
   ```
2. 安装配置文件

   ```bash [pnpm]
   pnpm i -D @sunshj/prettier-config
   ```
3. `package.json` 添加脚本和 `prettier` 配置

   ```json [package.json]
   {
     "scripts": {
       "format": "prettier --write ." // [!code ++]
     },
     "prettier": "@sunshj/prettier-config" // [!code ++]
   }
   ```

## 二、配置 ESLint

> VS Code 需要安装 [ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)并且开启 `Use Flat Config`

1. 安装 ESLint

   ```bash [pnpm]
   pnpm i -D eslint
   ```
2. 安装配置文件

   ```bash [pnpm]
   pnpm i -D @sunshj/eslint-config
   ```
3. 根目录创建 `eslint.config.js` 配置文件

   ```js [eslint.config.js]
   import { defineConfig } from '@sunshj/eslint-config'
   
   export default defineConfig({
     files: ['src/**/*.{vue,ts,js}']
   })
   ```
4. `package.json` 添加脚本

   ```json [package.json]
   {
     "scripts": {
        "lint": "eslint .", // [!code ++]
        "lint:fix": "eslint . --fix", // [!code ++]
     }
   }
   ```

## 三、配置 Stylelint

> VS Code 需要安装 [Stylelint 扩展](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) ，并进行配置

```json [.vscode/settings.json]
{
  "stylelint.validate": ["css", "postcss", "scss", "vue"]
}
```

1. 安装 Stylelint

   ```bash [pnpm]
   pnpm i -D stylelint@16
   ```
2. 安装配置文件

   ```bash [pnpm]
   pnpm i -D @sunshj/stylelint-config
   ```
3. `package.json` 添加脚本和 `stylelint` 配置

   ```json [package.json]
   {
     "scripts": {
       "stylelint": "stylelint --fix \"src/**/*.{vue,css,scss}\" --cache" // [!code ++]
     },
     "stylelint": { // [!code ++]
       "extends": "@sunshj/stylelint-config" // [!code ++]
     } // [!code ++]
   }
   ```

## 四、配置 husky 和 lint-staged

> 查看[从 husky 迁移到 simple-git-hooks](/articles/husky-to-simple-git-hooks/)

1. 安装 husky 和 lint-staged

   ```bash [pnpm]
   pnpm i -D husky@8 lint-staged@15
   ```
2. `package.json` 添加 lint-staged 配置

   ```json [package.json]
   {
     "lint-staged": { // [!code ++]
       "src/**/*.{vue,js,ts}": ["eslint --fix", "prettier --write"] // [!code ++]
     } // [!code ++]
   }
   ```
3. `package.json` 添加脚本

   ```json [package.json]
   {
     "scripts": {
       "prepare": "husky install" // [!code ++]
     }
   }
   ```
4. 执行 `pnpm prepare`
5. 添加 pre-commit 钩子

   ```bash
   npx husky set .husky/pre-commit "npx lint-staged"
   ```

## 五、配置提交规范

1. 安装 cz-git 、commitizen 以及 commitlint

   ```bash [pnpm]
   pnpm i -D cz-git commitizen commitlint
   ```
   > 建议全局安装 `commitizen`,如此一来可以快速使用 `cz` 或 `git cz` 命令进行启动。
   >
2. `package.json` 添加 脚本和 `config` 指定使用的适配器

   ```json [package.json]
   {
     "scripts": {
       "commit": "git-cz" // [!code ++]
     },
     "config": { // [!code ++]
       "commitizen": { // [!code ++]
         "path": "node_modules/cz-git" // [!code ++]
       } // [!code ++]
     } // [!code ++]
   }
   ```
3. 根目录创建 `.commitlintrc.cjs` 配置文件

   ```js [.commitlintrc.cjs]
   /** @type {import('cz-git').UserConfig} */
   module.exports = {
     rules: {
       'subject-empty': [2, 'never']
     },
     prompt: {
       messages: {
         type: '选择你要提交的类型 :',
         scope: '选择一个提交范围（可选）:',
         customScope: '请输入自定义的提交范围 :',
         subject: '填写简短精炼的变更描述 :\n',
         body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
         breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
         footerPrefixesSelect: '选择关联issue前缀（可选）:',
         customFooterPrefix: '输入自定义issue前缀 :',
         footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
         confirmCommit: '是否提交或修改commit ?'
       },
       types: [
         { value: 'feat', name: 'feat:     新增功能 | A new feature' },
         { value: 'fix', name: 'fix:      修复缺陷 | A bug fix' },
         { value: 'docs', name: 'docs:     文档更新 | Documentation only changes' },
         {
           value: 'style',
           name: 'style:    代码格式 | Changes that do not affect the meaning of the code'
         },
         {
           value: 'refactor',
           name: 'refactor: 代码重构 | A code change that neither fixes a bug nor adds a feature'
         },
         { value: 'perf', name: 'perf:     性能提升 | A code change that improves performance' },
         {
           value: 'test',
           name: 'test:     测试相关 | Adding missing tests or correcting existing tests'
         },
         {
           value: 'build',
           name: 'build:    构建相关 | Changes that affect the build system or external dependencies'
         },
         {
           value: 'ci',
           name: 'ci:       持续集成 | Changes to our CI configuration files and scripts'
         },
         { value: 'revert', name: 'revert:   回退代码 | Revert to a commit' },
         {
           value: 'chore',
           name: 'chore:    其他修改 | Other changes that do not modify src or test files'
         }
       ]
     }
   }
   ```
4. 添加 commit-msg 钩子

   ```bash
   npx husky set .husky/commit-msg "npx --no-install commitlint --config .commitlintrc.cjs --edit $1"
   ```
5. 提交执行 `pnpm commit` 即可
