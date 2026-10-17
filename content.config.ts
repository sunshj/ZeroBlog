import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const articleSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
  tags: z.array(z.string()).default([]),
  sticky: z.number().default(0),
  hidden: z.boolean().default(false),
  comment: z.boolean().optional(),
  center: z.boolean().optional()
})

export default defineContentConfig({
  collections: {
    articles: defineCollection({
      type: 'page',
      source: 'articles/**/*.md',
      schema: articleSchema
    }),
    notes: defineCollection({
      type: 'page',
      source: 'notes/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string(),
        hidden: z.boolean().default(false),
        comment: z.boolean().optional()
      })
    }),
    pages: defineCollection({
      type: 'page',
      source: '*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        comment: z.boolean().optional(),
        center: z.boolean().optional(),
        ogImage: z.boolean().optional()
      })
    }),
    projects: defineCollection({
      type: 'data',
      source: 'data/projects.yaml',
      schema: z.object({
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
    }),
    friends: defineCollection({
      type: 'data',
      source: 'data/friends.yaml',
      schema: z.object({
        friends: z.array(
          z.object({
            name: z.string(),
            link: z.string(),
            avatar: z.string(),
            description: z.string()
          })
        )
      })
    })
  }
})
