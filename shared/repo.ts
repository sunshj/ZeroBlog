import { z } from 'zod'

// 读取单个仓库文件（repoFileContent）
export const repoFileQuerySchema = z.object({
  path: z.string(),
  repo: z.string().optional()
})
export type RepoFileQuery = z.infer<typeof repoFileQuerySchema>

// 列举仓库目录（repoFolderContents）
export const repoFolderQuerySchema = z.object({
  folder: z.string(),
  repo: z.string().optional()
})
export type RepoFolderQuery = z.infer<typeof repoFolderQuerySchema>

// 新建/更新文件（upsertRepoFileContent）
export const upsertRepoFileBodySchema = z.object({
  path: z.string(),
  content: z.string(),
  repo: z.string().optional(),
  type: z.enum(['text', 'base64']).optional().default('text'),
  message: z.string().optional()
})
export type UpsertRepoFileBody = z.infer<typeof upsertRepoFileBodySchema>

// 删除文件（deleteRepoFile）
export const deleteRepoFileQuerySchema = z.object({
  path: z.string(),
  repo: z.string().optional(),
  message: z.string().optional()
})
export type DeleteRepoFileQuery = z.infer<typeof deleteRepoFileQuerySchema>

// GitHub Contents API 返回的文件项（含本项目附加的 rawContent / content）
export interface RepoFile {
  name: string
  path: string
  sha: string
  size?: number
  url?: string | null
  html_url?: string | null
  git_url?: string | null
  download_url?: string | null
  type?: string
  content?: string
  encoding?: string
  rawContent?: string
  _links?: Record<string, unknown>
  [key: string]: unknown
}

// 写操作（upsert / delete）的统一返回
export interface RepoWriteResult {
  message: string
}
