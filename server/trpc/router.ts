import { baseProcedure, createTRPCRouter } from '~~/server/trpc/init'
import { Octokit } from 'octokit'
import { base64ToText, textToBase64 } from 'undio'
import { z } from 'zod'

interface RepoFileContentsPayload {
  authToken?: string
  owner: string
  repo: string
  path: string
}

async function getRepoFileContents(payload: RepoFileContentsPayload) {
  const { authToken, owner, repo, path } = payload
  const octokit = new Octokit({ auth: authToken })

  const { data } = await octokit
    .request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path
    })
    .catch(() => ({ data: null }))

  if (Array.isArray(data))
    return data.map(file => ({ ...file, rawContent: file.content?.replaceAll('\n', '') }))

  if (!data || !('content' in data)) return []

  return [
    {
      ...data,
      rawContent: data.content.replaceAll('\n', ''),
      content: base64ToText(data.content, { dataURL: false })
    }
  ]
}

export const appRouter = createTRPCRouter({
  repoFileContent: baseProcedure
    .input(
      z.object({
        path: z.string(),
        repo: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const [file] = await getRepoFileContents({
        authToken: ctx.session.secure?.accessToken,
        owner: ctx.session.user.name,
        repo: input.repo ?? ctx.runtimeConfig.githubRepo,
        path: input.path
      })
      return file
    }),

  repoFolderContents: baseProcedure
    .input(
      z.object({
        folder: z.string(),
        repo: z.string().optional()
      })
    )
    .query(({ ctx, input }) => {
      return getRepoFileContents({
        authToken: ctx.session.secure?.accessToken,
        owner: ctx.session.user.name,
        repo: input.repo ?? ctx.runtimeConfig.githubRepo,
        path: input.folder
      })
    }),

  upsertRepoFileContent: baseProcedure
    .input(
      z.object({
        path: z.string(),
        content: z.string(),
        repo: z.string().optional(),
        type: z.enum(['text', 'base64']).optional().default('text'),
        message: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session, runtimeConfig } = ctx
      const { type, content, path, message, repo = runtimeConfig.githubRepo } = input
      const base64Content = type === 'text' ? textToBase64(content, { dataURL: false }) : content

      const [file] = await getRepoFileContents({
        authToken: session.secure?.accessToken,
        owner: session.user.name,
        repo,
        path
      })

      if (base64Content === file?.rawContent) return { message: 'No changes detected' }

      const octokit = new Octokit({ auth: session.secure?.accessToken })

      // 更新/创建 文件
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
    }),

  deleteRepoFile: baseProcedure
    .input(
      z.object({
        path: z.string(),
        repo: z.string().optional(),
        message: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session, runtimeConfig } = ctx
      const { path, message, repo = runtimeConfig.githubRepo } = input
      const [file] = await getRepoFileContents({
        authToken: session.secure?.accessToken,
        owner: session.user.name,
        path,
        repo
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
})

// export type definition of API
export type AppRouter = typeof appRouter
