import { createTRPCContext } from '~~/server/trpc/init'
import { appRouter } from '~~/server/trpc/router'
import { createTRPCNuxtHandler } from 'trpc-nuxt/server'

export default createTRPCNuxtHandler({
  endpoint: '/api/trpc',
  router: appRouter,
  createContext: createTRPCContext
})
