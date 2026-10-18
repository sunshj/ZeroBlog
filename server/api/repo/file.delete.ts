import { Octokit } from 'octokit'
import { getRepoFile } from '~~/server/utils/repo'
import { deleteRepoFileQuerySchema, type RepoWriteResult } from '#shared/repo'

export default defineEventHandler(async (event): Promise<RepoWriteResult> => {
  const session = await requireUserSession(event)
  const runtimeConfig = useRuntimeConfig(event)
  const query = await getValidatedQuery(event, deleteRepoFileQuerySchema.parse)
  const { path, message, repo = runtimeConfig.githubRepo } = query

  const file = await getRepoFile({
    authToken: session.secure?.accessToken,
    owner: session.user.name,
    repo,
    path
  })
  if (!file) return { message: 'File not found' }

  const octokit = new Octokit({ auth: session.secure?.accessToken })
  const { data } = await octokit
    .request('DELETE /repos/{owner}/{repo}/contents/{path}', {
      owner: session.user.name,
      repo,
      path,
      message: message ?? `docs: deleted ${path}`,
      sha: file.sha
    })
    .catch(() => ({ data: null }))

  if (!data) return { message: 'Delete failed' }
  return { message: 'Delete successful' }
})
