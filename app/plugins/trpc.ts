import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { AppRouter } from '~~/server/trpc/router'

export default defineNuxtPlugin(() => {
  const trpc = createTRPCNuxtClient<AppRouter>({
    links: [httpBatchLink({ url: '/api/trpc' })]
  })

  return {
    provide: {
      trpc
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $trpc: ReturnType<typeof createTRPCNuxtClient<AppRouter>>
  }
}
