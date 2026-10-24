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
 * content/data/projects.yaml
 */
export const projectsSchema = z.object({
  projects: z.array(
    z.object({
      name: z.string(),
      link: z.string().optional(),
      repo: z.string().optional(),
      npm: z.string().optional(),
      description: z.string(),
      techStack: z.array(z.string()).optional()
    })
  )
})

/**
 * content/data/friends.yaml
 */
export const friendsSchema = z.object({
  friends: z.array(
    z.object({
      name: z.string(),
      link: z.string(),
      avatar: z.string(),
      description: z.string()
    })
  )
})

/**
 * 顺序即匹配优先级：先命中者胜，与 Nuxt Content 的行为一致。
 */
export const collections = {
  articles: { type: 'page', source: 'articles/**/*.md', schema: articleSchema },
  notes: { type: 'page', source: 'notes/**/*.md', schema: noteSchema },
  pages: { type: 'page', source: '*.md', schema: pageSchema },
  projects: { type: 'data', source: 'data/projects.yaml', schema: projectsSchema },
  friends: { type: 'data', source: 'data/friends.yaml', schema: friendsSchema }
} as const
