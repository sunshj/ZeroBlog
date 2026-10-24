import { z } from 'zod'
import { DATETIME_FORMAT, isDateTime } from './datetime.ts'

export const datetimeSchema = z.string().refine(isDateTime, `日期格式应为 ${DATETIME_FORMAT}`)

/**
 * content/articles/**\/*.md
 */
export const articleSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: datetimeSchema,
  tags: z.array(z.string()).default([]),
  sticky: z.number().default(0),
  hidden: z.boolean().default(false),
  comment: z.boolean().optional(),
  center: z.boolean().optional()
})

/**
 * content/notes/**\/*.md
 */
export const noteSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: datetimeSchema,
  hidden: z.boolean().default(false),
  comment: z.boolean().optional()
})

/**
 * content/*.md
 */
export const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  comment: z.boolean().optional(),
  center: z.boolean().optional(),
  ogImage: z.boolean().optional()
})

/**
 * 顺序即匹配优先级：先命中者胜，与 Nuxt Content 的行为一致。
 * data 是兜底集合：content/data 下所有 yaml / json 都归它，新增文件不用改配置，字段不做校验。
 */
export const collections = {
  articles: { type: 'page', source: 'articles/**/*.md', schema: articleSchema },
  notes: { type: 'page', source: 'notes/**/*.md', schema: noteSchema },
  pages: {
    type: 'page',
    source: { include: '**/*.md', exclude: ['articles/**', 'notes/**'] },
    schema: pageSchema
  },
  data: {
    type: 'data',
    source: 'data/**/*.{yaml,json}',
    schema: z.record(z.string(), z.unknown())
  }
} as const
