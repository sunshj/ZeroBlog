<template>
  <ArticleRender :article="article" :tag-options="{ readingTime: false, wordsCount: false }" />
</template>

<script lang="ts" setup>
const props = defineProps<{
  content?: string
}>()

const article = computedAsync(async () => {
  if (!props.content?.trim()) return undefined

  try {
    const { body, data } = await parsePreviewMarkdown(props.content)
    return { body, ...data }
  } catch {
    return undefined
  }
})
</script>

<style scoped></style>
