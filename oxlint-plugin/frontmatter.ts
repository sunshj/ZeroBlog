import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { formatIssue, lintMarkdownFrontmatter, type FrontmatterIssue } from '../shared/frontmatter.ts'

type Position = { line: number; column: number }

type RuleContext = {
  filename: string
  report: (options: { node: unknown; loc?: { start: Position; end: Position }; message: string }) => void
}

/**
 * oxlint 不解析 markdown：.md 根本不在它的文件集合里（`oxlint x.md` 会直接报 "No files found to lint"），
 * 所以没有"按 md 文件触发"的规则形态。这里借 shared/collections.ts 的 Program 当唯一触发器：
 * 全量 lint 时它必然被访问一次，此时一次性扫完 content/ 下所有 md。
 *
 * 诊断只能挂在锚点文件上，所以做了两件事：
 * - 消息带 `content/<path>:<line>` 前缀，终端与 CI 日志可直接点击跳转
 * - 上报时给一个 1 行的 loc，否则 oxlint 会按 Program 节点把整个锚点文件当代码帧打出来
 *
 * 锚点必须留在 lint 覆盖范围内：`pnpm lint` 是全量，lint-staged 里显式带上了它。
 */
const ANCHOR = 'shared/collections.ts'
const LOC = { start: { line: 1, column: 0 }, end: { line: 1, column: 1 } }

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT_DIR = join(ROOT, 'content')

export default {
  rules: {
    'no-invalid-field': createRule(issue => issue.severity === 'error'),
    'no-unknown-field': createRule(issue => issue.code === 'unknown-field')
  }
}

/**
 * 严重级别由规则配置决定、不能按条切换，所以按语义拆成两条规则：
 * no-invalid-field 覆盖所有 error（缺字段、类型不对、解析失败等），配置为 error；
 * no-unknown-field 只覆盖 schema 里没声明的字段，配置为 warn，不阻断 CI。
 */
function createRule(match: (issue: FrontmatterIssue) => boolean) {
  return {
    meta: { type: 'problem' as const, schema: [] },
    create(context: RuleContext) {
      if (!context.filename.replaceAll('\\', '/').endsWith(ANCHOR)) return {}

      let reported = false

      return {
        Program(node: unknown) {
          if (reported) return
          reported = true

          const issues = collectIssues()
          const selected = issues.filter(match)

          if (selected.length === 0) return

          context.report({
            node,
            loc: LOC,
            message: [...selected.map(formatIssue), summarize(issues)].join('\n')
          })
        }
      }
    }
  }
}

function collectIssues(): FrontmatterIssue[] {
  return readdirSync(CONTENT_DIR, { recursive: true })
    .map(relPath => String(relPath).replaceAll('\\', '/'))
    .filter(relPath => relPath.endsWith('.md'))
    .flatMap(relPath => lintMarkdownFrontmatter(`content/${relPath}`, readFileSync(join(CONTENT_DIR, relPath), 'utf8')))
}

function summarize(issues: FrontmatterIssue[]): string {
  const errors = issues.filter(issue => issue.severity === 'error').length
  const files = new Set(issues.map(issue => issue.relPath)).size

  return `frontmatter: ${errors} error(s), ${issues.length - errors} warning(s) across ${files} file(s) under content/`
}
