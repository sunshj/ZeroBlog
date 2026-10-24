import { defineCollection, defineContentConfig } from '@nuxt/content'
import { collections } from './shared/collections'

/**
 * source、type、schema 全部来自 shared/collections.ts，
 * 这里只做注册，保证 content.config.ts 与 frontmatter 校验器共用同一份定义。
 */
export default defineContentConfig({
  collections: Object.fromEntries(Object.entries(collections).map(([name, item]) => [name, defineCollection(item)]))
})
