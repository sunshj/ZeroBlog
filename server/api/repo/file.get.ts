import { getRepoFile } from '~~/server/utils/repo'
import { repoFileQuerySchema, type RepoFile } from '#shared/repo'

export default defineEventHandler(async (event): Promise<RepoFile | undefined> => {
  const session = await requireUserSession(event)
  const runtimeConfig = useRuntimeConfig(event)
  const query = await getValidatedQuery(event, repoFileQuerySchema.parse)

  const file = await getRepoFile({
    authToken: session.secure?.accessToken,
    owner: session.user.name,
    repo: query.repo ?? runtimeConfig.githubRepo,
    path: query.path
  })

  return file ?? undefined
})
