import { z } from 'zod'

/**
 * content/articles/**\/*.md
 */
export const articleSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
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
  date: z.string(),
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
