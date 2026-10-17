import { Octokit } from 'octokit'
import { base64ToText } from 'undio'
import type { RepoFile } from '#shared/repo'

export interface GetRepoContentPayload {
  authToken?: string
  owner: string
  repo: string
  path: string
}

/** 读取单个仓库文件，返回解码后的内容；路径不存在或指向目录时返回 null */
export async function getRepoFile(payload: GetRepoContentPayload): Promise<RepoFile | null> {
  const { authToken, owner, repo, path } = payload
  const octokit = new Octokit({ auth: authToken })

  const { data } = await octokit
    .request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path
    })
    .catch(() => ({ data: null }))

  if (!data || Array.isArray(data)) return null
  if (!('content' in data)) return null

  return {
    ...data,
    rawContent: data.content.replaceAll('\n', ''),
    content: base64ToText(data.content, { dataURL: false })
  }
}

/** 列举仓库目录，返回文件项数组（每项附 rawContent） */
export async function getRepoFolder(payload: GetRepoContentPayload): Promise<RepoFile[]> {
  const { authToken, owner, repo, path } = payload
  const octokit = new Octokit({ auth: authToken })

  const { data } = await octokit
    .request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path
    })
    .catch(() => ({ data: null }))

  if (!Array.isArray(data)) return []

  return data
}
