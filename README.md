# ZeroDBlog

ZeroDBlog 是一个基于Nuxt3和Nuxt Content的博客系统。无需数据库存储，通过Github API 更新数据，基于Github和Vercel自动化搭建博客。

## 快速开始

### 必要环境变量

```env
# Seo
NUXT_SITE_URL="https://<your-domain>"
NUXT_SITE_NAME="My Blog"

# Github Repo
NUXT_GITHUB_REPO="nuxt-blog"

# Auth Utils (32位字符)
NUXT_SESSION_PASSWORD="********************************"
# Github OAuth
NUXT_OAUTH_GITHUB_CLIENT_ID="********************"
NUXT_OAUTH_GITHUB_CLIENT_SECRET="****************************************"

```

### 创建Github OAuth App

1. 访问 https://github.com/settings/developers
2. 点击 New OAuth App
3. 填写应用信息
   - Application name: ZeroDBlog
   - Homepage URL: `<your-blog-url>`
   - Authorization callback URL: `<your-blog-url>`/auth/github
4. 获取 Client ID 和 Client Secret

## 在线编写博客

访问 `<your-blog-url>`/dashboard，使用Github账号登录，即可在线编写博客。

> 点击推送按钮后，会自动将修改后的文章提交到Github仓库并触发Vercel 部署，等待大约1分钟，即可查看修改后的文章。
