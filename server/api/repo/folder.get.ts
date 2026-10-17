import { getRepoFolder } from '~~/server/utils/repo'
import { repoFolderQuerySchema, type RepoFile } from '#shared/repo'

export default defineEventHandler(async (event): Promise<RepoFile[]> => {
  const session = await requireUserSession(event)
  const runtimeConfig = useRuntimeConfig(event)
  const query = await getValidatedQuery(event, repoFolderQuerySchema.parse)

  return getRepoFolder({
    authToken: session.secure?.accessToken,
    owner: session.user.name,
    repo: query.repo ?? runtimeConfig.githubRepo,
    path: query.folder
  })
})
