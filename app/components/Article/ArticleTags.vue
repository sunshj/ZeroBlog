<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="flex items-center gap-1">
      <Icon name="lucide:calendar" /> {{ dateFormat(props.article.date ?? '') }}
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
      <Icon name="lucide:eye" /> {{ props.article.meta?.readingTime?.words }} words
    </span>

    <span v-if="props.readingTime" class="flex items-center gap-1">
      <Icon name="lucide:clock" /> {{ props.article.meta?.readingTime?.text }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { ArticlesCollectionItem } from '@nuxt/content'
import { dateFormat } from '#shared/datetime'

type ArticleTagItem = Partial<Pick<ArticlesCollectionItem, 'date' | 'tags'>> & {
  meta?: {
    readingTime?: {
      words?: number
      text?: string
    }
  }
}

const props = defineProps<{
  article: ArticleTagItem
  wordsCount?: boolean
  readingTime?: boolean
}>()
</script>

<style scoped></style>
