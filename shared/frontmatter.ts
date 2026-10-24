import { isMap, isScalar, LineCounter, parseDocument } from 'yaml'
import { collections } from './collections.ts'

export type IssueCode =
  | 'no-collection'
  | 'missing-frontmatter'
  | 'unclosed-frontmatter'
  | 'invalid-yaml'
  | 'unknown-field'
  | 'invalid-field'

export interface FrontmatterIssue {
  /** 相对 content/ 目录的路径，例如 articles/hello-world.md */
  relPath: string
  code: IssueCode
  /** 只影响展示优先级；推送门禁按"有任何 issue 即拦截"处理 */
  severity: 'error' | 'warning'
  message: string
  /** markdown 文件内 1-based 行号 */
  line: number
}

/** 与 content.config.ts 共用同一份定义，只取 type 为 page 的 markdown 集合 */
const SOURCES = Object.entries(collections)
  .filter(([, item]) => item.type === 'page')
  .map(([name, item]) => ({ name, schema: item.schema, pattern: globToRegExp(item.source) }))

/**
 * 仅支持 `*` 和 `**\/` 的 glob → RegExp。这个模块要进浏览器包，所以不引 globby/picomatch；
 * 不支持的语法直接抛错，避免静默匹配不到、把文件误判成"无集合"。
 */
function globToRegExp(pattern: string) {
  if (/[?[\]{}!]/.test(pattern.replaceAll('**/', '').replaceAll('*', ''))) {
    throw new Error(`[frontmatter] unsupported glob "${pattern}"; only "*" and "**/" are supported`)
  }

  return new RegExp(
    `^${pattern
      .replaceAll(/[.+^${}()|[\]\\]/g, '\\$&')
      .replaceAll('**/', '\u0000')
      .replaceAll('*', '[^/]*')
      .replaceAll('\u0000', '(?:[^/]+/)*')}$`
  )
}

/** 统一的诊断文案，终端与 CI 可点击跳转 */
export function formatIssue(issue: FrontmatterIssue) {
  const label = issue.severity === 'warning' ? 'warning  ' : ''
  return `content/${issue.relPath}:${issue.line}  ${label}${issue.message} (${issue.code})`
}

/**
 * 校验单个 markdown 文件的 frontmatter：纯函数、无 I/O、只解析一次 YAML。
 * 浏览器（Monaco 标记）与 CI（oxlint 插件）跑的是同一份实现。
 */
export function lintMarkdownFrontmatter(path: string, content: string): FrontmatterIssue[] {
  const normalized = path.replaceAll('\\', '/')

  if (!normalized.startsWith('content/') || !normalized.endsWith('.md')) return []

  const relPath = normalized.slice('content/'.length)
  const issue = (code: IssueCode, line: number, message: string): FrontmatterIssue => ({
    relPath,
    code,
    severity: code === 'unknown-field' ? 'warning' : 'error',
    message,
    line
  })

  const collection = SOURCES.find(item => item.pattern.test(relPath))

  if (!collection)
    return [issue('no-collection', 1, 'no collection source matches this file; it will never be rendered')]

  // 逐行切 frontmatter：结束分隔符必须独占一行，正文里的 `---` 不会被误判
  const lines = content.replace(/^\uFEFF/, '').split(/\r?\n/)

  if (lines[0] !== '---') return [issue('missing-frontmatter', 1, 'missing frontmatter block')]

  const end = lines.indexOf('---', 1)

  if (end === -1) return [issue('unclosed-frontmatter', 1, 'frontmatter is never closed with "---"')]

  const counter = new LineCounter()
  const document = parseDocument(lines.slice(1, end).join('\n'), { lineCounter: counter })

  if (document.errors.length > 0) {
    return document.errors.map(error => {
      const { line } = counter.linePos(error.pos[0])
      return issue('invalid-yaml', line + 1, `invalid YAML: ${error.message.split('\n')[0]}`)
    })
  }

  // 顶层 key → 文件行号，用于把诊断钉到对应行
  const lineOf = new Map<string, number>()

  for (const { key } of isMap(document.contents) ? document.contents.items : []) {
    if (isScalar(key) && key.range) lineOf.set(String(key.value), counter.linePos(key.range[0]).line + 1)
  }

  const data = (document.toJSON() ?? {}) as Record<string, unknown>

  // YAML 空值（`key:`）视为未设置
  for (const key of Object.keys(data)) {
    if (data[key] === null) delete data[key]
  }

  const issues: FrontmatterIssue[] = []

  for (const key of Object.keys(data)) {
    if (key in collection.schema.shape || key === 'path') continue

    issues.push(
      issue(
        'unknown-field',
        lineOf.get(key) ?? 1,
        `unknown field "${key}" is not in the "${collection.name}" schema; Nuxt Content drops it`
      )
    )
  }

  const result = collection.schema.safeParse(data)

  if (!result.success) {
    for (const problem of result.error.issues) {
      const key = String(problem.path[0] ?? '')
      issues.push(
        issue('invalid-field', lineOf.get(key) ?? 1, `invalid field "${key || '(root)'}": ${problem.message}`)
      )
    }
  }

  return issues.sort((left, right) => left.line - right.line)
}
