import { queryCollection } from '@nuxt/content/server'
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

  const articles = await queryCollection(event, 'articles')
    .select('path', 'title', 'description', 'date')
    .where('hidden', '=', false)
    .order('date', 'DESC')
    .all()

  const notes = await queryCollection(event, 'notes')
    .select('path', 'title', 'description', 'date')
    .where('hidden', '=', false)
    .order('date', 'DESC')
    .all()

  ;[...articles, ...notes].forEach(article => {
    if (!article.title) return
    feed.addItem({
      title: article.title,
      id: article.path,
      link: `${site.link}${article.path}`,
      description: article.description,
      date: new Date(article.date)
    })
  })

  setResponseHeader(event, 'Content-Type', 'text/xml')
  return feed.rss2()
})
