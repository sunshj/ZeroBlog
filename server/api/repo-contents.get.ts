import { Octokit } from 'octokit'
import { base64ToText } from 'undio'
import { z } from 'zod'

const schema = z.object({
  repo: z.string().optional(),
  path: z.string()
})

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)

  const { githubRepo } = useRuntimeConfig()
  const { path, repo } = await getValidatedQuery(event, schema.parse)

  const octokit = new Octokit({ auth: session.secure?.accessToken })
  const { data } = await octokit
    .request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: session.user.name,
      repo: repo ?? githubRepo,
      path
    })
    .catch(() => {
      return { data: null }
    })

  if (!data || !('content' in data)) return null

  return {
    ...data,
    content: base64ToText(data.content, { dataURL: false })
  }
})
