<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="flex items-center gap-1">
      <Icon name="lucide:calendar" /> {{ formatTime(props.article.date ?? '', props.dateFormat) }}
    </span>

    <NuxtLink
      v-for="tag in props.article.tags ?? []"
      :key="tag"
      prefetch
      prefetch-on="interaction"
      class="flex items-center hover:decoration-underline"
      :to="`/tags/${tag}`"
    >
      <Icon name="lucide:hash" /> {{ tag }}
    </NuxtLink>

    <span v-if="props.wordsCount" class="flex items-center gap-1">
      <Icon name="lucide:eye" /> {{ props.article.readingTime?.words }} words
    </span>

    <span v-if="props.readingTime" class="flex items-center gap-1">
      <Icon name="lucide:clock" /> {{ props.article.readingTime?.text }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { ArticlesCollectionItem } from '@nuxt/content'

// 复用 nuxt-content 生成的 ArticlesCollectionItem：date / tags 取自集合项类型；
// readingTime 由内容模块在解析时附加，不在 schema 类型中，这里单独补回。
type ArticleTagItem = Partial<Pick<ArticlesCollectionItem, 'date' | 'tags'>> & {
  readingTime?: {
    words?: number
    text?: string
  }
}

const props = defineProps<{
  article: ArticleTagItem
  dateFormat?: string
  wordsCount?: boolean
  readingTime?: boolean
}>()
</script>

<style scoped></style>
