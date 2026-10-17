<template>
  <div class="h-full flex flex-col">
    <div class="h-7 flex shrink-0 items-center gap-1 px-3 text-xs text-gray-400">
      <Icon :name="iconOf(lang)" :size="12" />
      {{ path }}
    </div>

    <LazyMonacoEditor v-if="loaded" v-model="content" :options="options" class="min-h-0 flex-1" :lang="lang" />
    <div v-else-if="error" class="min-h-0 flex flex-center flex-1 text-sm text-gray-400">加载失败</div>
    <div v-else class="min-h-0 flex flex-center flex-1">
      <Icon name="lucide:loader-circle" :size="20" class="animate-spin text-gray-400" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  path: string
  lang: string
  loaded: boolean
  error: boolean
  options: Record<string, unknown>
}>()

const content = defineModel<string>({ default: '' })

function iconOf(lang: string) {
  if (lang === 'yaml') return 'lucide:database'
  if (lang === 'typescript') return 'lucide:file-code'
  return 'lucide:file-text'
}
</script>

<style scoped></style>
