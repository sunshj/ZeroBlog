import { queryCollection } from '@nuxt/content/server'
import { SitemapStream, streamToPromise } from 'sitemap'

export default defineEventHandler(async event => {
  const { siteUrl } = useRuntimeConfig(event)

  const docs = [
    ...(await queryCollection(event, 'pages').select('path').all()),
    ...(await queryCollection(event, 'articles').select('path').all()),
    ...(await queryCollection(event, 'notes').select('path').all())
  ]

  const sitemap = new SitemapStream({
    hostname: siteUrl
  })

  for (const doc of docs) {
    sitemap.write({
      url: doc.path,
      changefreq: 'monthly'
    })
  }
  sitemap.end()

  return streamToPromise(sitemap)
})
