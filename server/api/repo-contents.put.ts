import { Octokit } from 'octokit'
import { textToBase64 } from 'undio'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)

  const { githubRepo } = useRuntimeConfig()
  const { path, content } = await readBody(event)

  const octokit = new Octokit({ auth: session.secure?.accessToken })
  const file = await event.$fetch('/api/repo-contents', { query: { path } })

  if (content === file.content) return { message: 'No changes detected' }

  // 更新/创建 文件
  await octokit
    .request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: session.user.name,
      repo: githubRepo,
      path,
      message: `docs: ${file.sha ? 'update' : 'add'} ${path}`,
      content: textToBase64(content, { dataURL: false }),
      sha: file.sha
    })
    .catch(error => {
      throw createError(error)
    })

  return { message: 'File updated successfully' }
})
