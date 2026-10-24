<template>
  <div class="h-full flex flex-col">
    <div class="h-7 flex shrink-0 items-center gap-1 px-3 text-xs text-gray-400">
      <Icon :name="iconOf(lang)" :size="12" />
      {{ path }}
      <span
        v-if="issues.length"
        class="ml-auto flex items-center gap-1"
        :class="errorCount ? 'text-red-500' : 'text-amber-500'"
        :title="issues.map(formatIssue).join('\n')"
      >
        <Icon name="lucide:circle-alert" :size="12" />
        {{ issues.length }}
      </span>
    </div>

    <LazyMonacoEditor
      v-if="loaded"
      v-model="content"
      :options="options"
      class="min-h-0 flex-1"
      :lang="lang"
      @load="onEditorLoad"
    />
    <div v-else-if="error" class="min-h-0 flex flex-center flex-1 text-sm text-gray-400">加载失败</div>
    <div v-else class="min-h-0 flex flex-center flex-1">
      <Icon name="lucide:loader-circle" :size="20" class="animate-spin text-gray-400" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { editor as MonacoEditorApi } from 'monaco-editor'
import { formatIssue, lintMarkdownFrontmatter, type FrontmatterIssue } from '#shared/frontmatter'

const props = defineProps<{
  path: string
  lang: string
  loaded: boolean
  error: boolean
  options: Record<string, unknown>
}>()

const content = defineModel<string>({ default: '' })

const issues = ref<FrontmatterIssue[]>([])

const errorCount = computed(() => issues.value.filter(issue => issue.severity === 'error').length)

let editor: MonacoEditorApi.IStandaloneCodeEditor | undefined
let monaco: typeof import('monaco-editor') | undefined

const MARKER_OWNER = 'frontmatter'

async function onEditorLoad(instance: MonacoEditorApi.IStandaloneCodeEditor) {
  editor = instance
  monaco = await useMonaco()
  validate()
}

function validate() {
  const model = editor?.getModel()
  const api = monaco

  if (!editor || !api || !model) return

  issues.value = lintMarkdownFrontmatter(props.path, content.value)

  api.editor.setModelMarkers(
    model,
    MARKER_OWNER,
    issues.value.map(issue => {
      const line = Math.min(issue.line, model.getLineCount())

      return {
        startLineNumber: line,
        endLineNumber: line,
        startColumn: 1,
        endColumn: model.getLineMaxColumn(line),
        message: issue.message,
        code: issue.code,
        severity: issue.severity === 'error' ? api.MarkerSeverity.Error : api.MarkerSeverity.Warning
      }
    })
  )
}

watchDebounced([content, () => props.path], validate, { debounce: 300 })

function iconOf(lang: string) {
  if (lang === 'yaml') return 'lucide:database'
  if (lang === 'typescript') return 'lucide:file-code'
  return 'lucide:file-text'
}
</script>

<style scoped></style>
