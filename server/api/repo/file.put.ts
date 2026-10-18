import { Octokit } from 'octokit'
import { textToBase64 } from 'undio'
import { getRepoFile } from '~~/server/utils/repo'
import { upsertRepoFileBodySchema, type RepoWriteResult } from '#shared/repo'

export default defineEventHandler(async (event): Promise<RepoWriteResult> => {
  const session = await requireUserSession(event)
  const runtimeConfig = useRuntimeConfig(event)
  const body = await readValidatedBody(event, upsertRepoFileBodySchema.parse)
  const { type, content, path, message, repo = runtimeConfig.githubRepo } = body

  const base64Content = type === 'text' ? textToBase64(content, { dataURL: false }) : content

  const file = await getRepoFile({
    authToken: session.secure?.accessToken,
    owner: session.user.name,
    repo,
    path
  })

  if (base64Content === file?.rawContent) return { message: 'No changes detected' }

  const octokit = new Octokit({ auth: session.secure?.accessToken })
  await octokit
    .request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: session.user.name,
      repo,
      path,
      message: message ?? `docs: ${file?.sha ? 'update' : 'add'} ${path}`,
      content: base64Content,
      sha: file?.sha
    })
    .catch(error => {
      throw createError(error)
    })

  return { message: `File ${file?.sha ? 'updated' : 'created'} successfully` }
})
