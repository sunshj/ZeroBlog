import { initTRPC } from '@trpc/server'
import type { H3Event } from 'h3'

export async function createTRPCContext(event: H3Event) {
  const session = await requireUserSession(event)
  const runtimeConfig = useRuntimeConfig(event)

  return { session, runtimeConfig }
}

type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<TRPCContext>().create()

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
