import picomatch from 'picomatch'
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
const SOURCES = Object.entries(collections).flatMap(([name, item]) =>
  item.type === 'page' ? [{ name, schema: item.schema, matches: createMatcher(item.source) }] : []
)

type CollectionSource = string | { include: string; exclude?: readonly string[] }

function createMatcher(source: CollectionSource) {
  if (typeof source === 'string') return picomatch(source)

  return picomatch(source.include, { ignore: [...(source.exclude ?? [])] })
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

  const collection = SOURCES.find(item => item.matches(relPath))

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
        `unknown field "${key}" is not in the "${collection.name}" schema; it will be available as meta.${key}`
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
