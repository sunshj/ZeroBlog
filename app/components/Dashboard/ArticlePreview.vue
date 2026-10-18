<template>
  <ArticleRender :article="article" :tag-options="{ readingTime: false, wordsCount: false }" />
</template>

<script lang="ts" setup>
import type { ArticlesCollectionItem } from '@nuxt/content'

const props = defineProps<{
  content?: string
}>()

const article = computedAsync(async () => {
  if (!props.content?.trim()) return undefined

  try {
    const { body, data } = await parsePreviewMarkdown(props.content)
    // 后台预览用 mdc 的 parseMarkdown 解析，body 为 MDCRoot（与内容集合的 MarkdownRoot 不同），
    // 这里复用 nuxt-content 生成的 ArticlesCollectionItem 类型做桥接。
    return { body, ...data } as unknown as ArticlesCollectionItem
  } catch {
    return undefined
  }
})
</script>

<style scoped></style>
