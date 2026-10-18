<template>
  <div class="h-full w-full overflow-y-auto p-4">
    <ContentRenderer v-if="doc" :value="doc" />
    <div v-else class="h-full w-full flex-center text-sm text-gray-400">暂无内容</div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  content?: string
}>()

const doc = ref<Record<string, unknown> | null>(null)

watch(
  () => props.content,
  async content => {
    if (!content?.trim()) {
      doc.value = null
      return
    }

    try {
      const { body, data } = await parsePreviewMarkdown(content)
      doc.value = { body, ...data }
    } catch {
      doc.value = null
    }
  },
  { immediate: true }
)
</script>

<style scoped></style>
