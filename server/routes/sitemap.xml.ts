import { serverQueryContent } from '#content/server'
import { SitemapStream, streamToPromise } from 'sitemap'

export default defineEventHandler(async event => {
  const { siteUrl } = useRuntimeConfig(event)
  const docs = await serverQueryContent(event).only(['_path']).find()
  const sitemap = new SitemapStream({
    hostname: siteUrl
  })

  for (const doc of docs) {
    sitemap.write({
      url: doc._path,
      changefreq: 'monthly'
    })
  }
  sitemap.end()

  return streamToPromise(sitemap)
})
