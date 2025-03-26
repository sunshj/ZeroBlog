import { Octokit } from 'octokit'
import { z } from 'zod'

const schema = z.object({
  path: z.string(),
  repo: z.string().optional(),
  message: z.string().optional()
})

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)

  const { githubRepo } = useRuntimeConfig()
  const { repo, path, message } = await readValidatedBody(event, schema.parse)

  const file = await event.$fetch('/api/repo-contents', {
    query: { path, repo: repo ?? githubRepo }
  })

  if (!file) return { message: 'File not found' }
  if (Array.isArray(file)) return { message: 'Can not delete a directory' }

  const octokit = new Octokit({ auth: session.secure?.accessToken })
  const { data } = await octokit
    .request('DELETE /repos/{owner}/{repo}/contents/{path}', {
      owner: session.user.name,
      repo: repo ?? githubRepo,
      path,
      message: message ?? `docs: deleted ${path}`,
      sha: file.sha
    })
    .catch(() => ({ data: null }))

  if (!data) return { message: 'Delete failed' }
  return { message: 'Delete successful' }
})
