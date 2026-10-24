import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { articleSchema, noteSchema, pageSchema } from './shared/content-schemas'

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
      schema: noteSchema
    }),
    pages: defineCollection({
      type: 'page',
      source: '*.md',
      schema: pageSchema
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
