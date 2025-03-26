import { Octokit } from 'octokit'
import { textToBase64 } from 'undio'
import { z } from 'zod'

const schema = z.object({
  repo: z.string().optional(),
  path: z.string(),
  content: z.string(),
  message: z.string().optional(),
  type: z.enum(['text', 'base64']).optional().default('text')
})

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)

  const { githubRepo } = useRuntimeConfig()
  const { repo, path, content, type, message } = await readValidatedBody(event, schema.parse)

  const base64Content = type === 'text' ? textToBase64(content, { dataURL: false }) : content

  const octokit = new Octokit({ auth: session.secure?.accessToken })
  const file = await event.$fetch('/api/repo-contents', {
    query: { path, repo: repo ?? githubRepo }
  })
  if (base64Content === file?.content) return { message: 'No changes detected' }

  // 更新/创建 文件
  await octokit
    .request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: session.user.name,
      repo: repo ?? githubRepo,
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
