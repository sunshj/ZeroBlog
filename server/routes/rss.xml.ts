import { serverQueryContent } from '#content/server'
import { Feed } from 'feed'

export default defineEventHandler(async event => {
  const { site } = useAppConfig()

  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: site.link,
    link: site.link,
    language: 'zh-CN',
    favicon: `${site.link}/favicon.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${site.author}`,
    generator: 'Nuxt static site generation + Feed for Node.js'
  })

  const articles = await serverQueryContent(event, '/articles')
    .only(['_path', 'title', 'description', 'date'])
    .find()

  const notes = await serverQueryContent(event, '/notes')
    .only(['_path', 'title', 'description', 'date'])
    .find()

  ;[...articles, ...notes].forEach(article => {
    if (!article.title) return
    feed.addItem({
      title: article.title,
      id: article._path,
      link: `${site.link}${article._path}`,
      description: article.description,
      date: new Date(article.date)
    })
  })

  setResponseHeader(event, 'Content-Type', 'text/xml')
  return feed.rss2()
})
