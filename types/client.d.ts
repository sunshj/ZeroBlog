import type { AppRouter } from '~~/server/trpc/router'
import type { createTRPCNuxtClient } from 'trpc-nuxt/client'

declare module '#app' {
  interface NuxtApp {
    $trpc: ReturnType<typeof createTRPCNuxtClient<AppRouter>>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $trpc: ReturnType<typeof createTRPCNuxtClient<AppRouter>>
  }
}

export {}
