<template>
  <DashboardEditorFrame :show-preview="hasPreview" class="w-full">
    <template #header>
      <slot name="leading" />

      <div class="flex-1" />

      <slot name="actions" />

      <UiButton icon="lucide:cloud-upload" :loading="pushing" @click="push">
        {{ pushLabel }}
      </UiButton>
    </template>

    <DashboardSplitPane
      v-if="editors.length > 1"
      direction="vertical"
      storage-key="dashboard-editor-files-split"
      class="h-full"
    >
      <template #first>
        <DashboardEditorPane
          v-model="editors[0]!.content"
          :path="editors[0]!.path"
          :lang="editors[0]!.lang"
          :loaded="editors[0]!.loaded"
          :error="editors[0]!.error"
          :options="editorOptions"
        />
      </template>

      <template #second>
        <DashboardEditorPane
          v-model="editors[1]!.content"
          :path="editors[1]!.path"
          :lang="editors[1]!.lang"
          :loaded="editors[1]!.loaded"
          :error="editors[1]!.error"
          :options="editorOptions"
        />
      </template>
    </DashboardSplitPane>

    <DashboardEditorPane
      v-else-if="editors[0]"
      v-model="editors[0].content"
      :path="editors[0].path"
      :lang="editors[0].lang"
      :loaded="editors[0].loaded"
      :error="editors[0].error"
      :options="editorOptions"
      class="h-full"
    />

    <template v-if="hasPreview" #preview>
      <slot name="preview" :contents="contents" :loading="!loaded" />
    </template>
  </DashboardEditorFrame>
</template>

<script lang="ts" setup>
import { formatIssue, lintMarkdownFrontmatter } from '#shared/frontmatter'
import type { RepoFile, RepoWriteResult } from '#shared/repo'

interface EditorFile {
  /** 仓库内文件路径，例如 content/friends.md */
  path: string
  /** Monaco 语言，默认按扩展名推断 */
  lang?: string
  /** 远端还没有该文件时，编辑器里的初始内容 */
  template?: string
}

interface EditorState {
  path: string
  lang: string
  template: string
  content: string
  loaded: boolean
  error: boolean
}

interface FileLoadResult {
  path: string
  content?: string
  error: boolean
}

const props = withDefaults(
  defineProps<{
    files: EditorFile[]
    pushLabel?: string
  }>(),
  {
    pushLabel: '推送'
  }
)

const slots = useSlots()
const hasPreview = computed(() => Boolean(slots.preview))

function createEditor(file: EditorFile): EditorState {
  return {
    path: file.path,
    lang: file.lang ?? guessLang(file.path),
    template: file.template ?? '',
    content: '',
    loaded: false,
    error: false
  }
}

const editors = reactive<EditorState[]>(props.files.map(createEditor))

/**
 * 按路径同步编辑器列表。
 * 保留仍然存在的编辑器状态，避免父组件更新 props 时覆盖用户输入。
 */
watch(
  () => props.files,
  files => {
    const previous = new Map(editors.map(editor => [editor.path, editor]))

    const next = files.map(file => {
      const editor = previous.get(file.path)

      if (!editor) return createEditor(file)

      editor.lang = file.lang ?? guessLang(file.path)
      editor.template = file.template ?? ''

      return editor
    })

    editors.splice(0, editors.length, ...next)
  },
  { deep: false }
)

/**
 * 路径列表变化时重新加载。
 * 使用路径列表作为响应式依赖，而不是数组索引。
 */
const filePaths = computed(() => props.files.map(file => file.path).join('\0'))

const { data: fileResults } = await useAsyncData<FileLoadResult[]>(
  () => `dashboard-editor-files:${filePaths.value}`,
  () => {
    const files = props.files.map(file => ({
      path: file.path,
      template: file.template ?? ''
    }))

    return Promise.all(
      files.map(async file => {
        try {
          const result = await $fetch<RepoFile | undefined>('/api/repo/file', {
            query: { path: file.path }
          })

          return {
            path: file.path,
            content: result?.content ?? file.template,
            error: false
          }
        } catch {
          return {
            path: file.path,
            content: file.template,
            error: true
          }
        }
      })
    )
  },
  {
    lazy: true,
    default: () => []
  }
)

/**
 * 将加载结果同步到编辑器。
 * 每次请求结果更新时，按路径查找对应编辑器。
 */
watch(
  fileResults,
  results => {
    if (!results) return

    for (const result of results) {
      const editor = editors.find(item => item.path === result.path)

      if (!editor) continue

      editor.error = result.error

      if (result.error) {
        editor.loaded = false
        continue
      }

      editor.content = result.content ?? editor.template
      editor.loaded = true
    }
  },
  { immediate: true }
)

const contents = computed(() => Object.fromEntries(editors.map(editor => [editor.path, editor.content])))

const loaded = computed(() => editors.every(editor => editor.loaded || editor.error))

const colorMode = useColorMode()

const editorOptions = computed(() => ({
  minimap: { autohide: 'mouseover' as const },
  theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light'
}))

const toast = useToast()
const pushing = ref(false)

async function push() {
  const issues = editors.flatMap(editor => lintMarkdownFrontmatter(editor.path, editor.content))
  const errors = issues.filter(issue => issue.severity === 'error').map(formatIssue)
  const warnings = issues.filter(issue => issue.severity === 'warning').map(formatIssue)

  if (errors.length > 0) {
    window.alert(`Frontmatter 校验未通过，已取消推送：\n\n${[...errors, ...warnings].join('\n')}`)
    return
  }

  const confirmMessage = warnings.length
    ? `Frontmatter 有 ${warnings.length} 条警告：\n\n${warnings.join('\n')}\n\n仍要推送吗？`
    : '确定要推送吗？'

  if (!window.confirm(confirmMessage)) return

  toast.show('正在推送，请稍等...')
  pushing.value = true

  try {
    const tasks = editors
      .filter(editor => editor.content.trim())
      .map(editor =>
        $fetch<RepoWriteResult>('/api/repo/file', {
          method: 'PUT',
          body: {
            path: editor.path,
            content: editor.content
          }
        })
      )

    if (!tasks.length) {
      window.alert('没有可推送的内容')
      return
    }

    const results = await Promise.all(tasks)
    window.alert(results.map(result => result.message).join('\n'))
  } finally {
    pushing.value = false
  }
}

function guessLang(path: string) {
  if (/\.ya?ml$/.test(path)) return 'yaml'
  if (path.endsWith('.ts')) return 'typescript'
  if (path.endsWith('.json')) return 'json'
  return 'markdown'
}
</script>

<style scoped></style>
