import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globbySync } from 'globby'
import { parse as parseYaml } from 'yaml'
import { articleSchema, noteSchema, pageSchema } from '../shared/content-schemas.ts'

type RuleContext = {
  filename: string
  report: (options: { node: unknown; message: string }) => void
}

const ANCHOR = 'shared/content-schemas.ts'

export default {
  rules: {
    'validate-markdown': {
      meta: { type: 'problem', schema: [] },
      create(context: RuleContext) {
        if (!context.filename.replaceAll('\\', '/').endsWith(ANCHOR)) return {}
        return {
          Program(node: unknown) {
            for (const { relPath, message } of collectFrontmatterErrors()) {
              context.report({ node, message: `${relPath}: ${message}` })
            }
          }
        }
      }
    }
  }
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT_DIR = join(ROOT, 'content')

const COLLECTIONS = [
  { name: 'articles', pattern: 'articles/**/*.md', schema: articleSchema },
  { name: 'notes', pattern: 'notes/**/*.md', schema: noteSchema },
  { name: 'pages', pattern: '*.md', schema: pageSchema }
]

/** Nuxt Content 保留字段(从文件路径生成);写进 schema 会把生成的 `path: string` 类型覆盖为 optional */
const RESERVED_FIELDS = new Set(['path'])

interface FrontmatterError {
  relPath: string
  message: string
}

type CollectionDef = (typeof COLLECTIONS)[number]

/** 文件 → collection 映射,先定义者胜(与 Nuxt Content 一致) */
function buildCollectionIndex(): Map<string, CollectionDef> {
  const index = new Map<string, CollectionDef>()
  for (const collection of COLLECTIONS) {
    for (const file of globbySync(collection.pattern, { cwd: CONTENT_DIR })) {
      if (!index.has(file)) index.set(file, collection)
    }
  }
  return index
}

function extractFrontmatter(text: string): string | null {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  return match ? match[1] : null
}

function lintFile(relPath: string, collection: CollectionDef | undefined, raw: string): FrontmatterError[] {
  if (!collection) {
    return [{ relPath, message: 'no collection source pattern matches this file; it will never be rendered' }]
  }

  const rawFrontmatter = extractFrontmatter(raw)
  if (rawFrontmatter === null) {
    return [{ relPath, message: `missing frontmatter block (required by "${collection.name}" schema)` }]
  }

  let frontmatter: unknown
  try {
    frontmatter = parseYaml(rawFrontmatter)
  } catch (error) {
    return [{ relPath, message: `invalid YAML: ${(error as Error).message.split('\n')[0]}` }]
  }

  const record =
    frontmatter && typeof frontmatter === 'object' && !Array.isArray(frontmatter)
      ? (frontmatter as Record<string, unknown>)
      : null

  // YAML 空值(`key:`)视为未设置
  if (record) {
    for (const key of Object.keys(record)) {
      if (record[key] === null) delete record[key]
    }
  }

  const errors: FrontmatterError[] = []

  if (record && 'shape' in collection.schema) {
    const declared = new Set(Object.keys(collection.schema.shape))
    for (const key of Object.keys(record)) {
      if (!declared.has(key) && !RESERVED_FIELDS.has(key)) {
        errors.push({
          relPath,
          message: `unknown field "${key}" is not declared in the "${collection.name}" schema; Nuxt Content drops undeclared frontmatter fields`
        })
      }
    }
  }

  const result = collection.schema.safeParse(record)
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push({
        relPath,
        message: `invalid field "${issue.path.join('.')}": ${issue.message}`
      })
    }
  }

  return errors
}

function collectFrontmatterErrors(): FrontmatterError[] {
  const index = buildCollectionIndex()
  const errors: FrontmatterError[] = []
  for (const relPath of globbySync('**/*.md', { cwd: CONTENT_DIR })) {
    const raw = readFileSync(join(CONTENT_DIR, relPath), 'utf8')
    errors.push(...lintFile(relPath, index.get(relPath), raw))
  }
  return errors
}
