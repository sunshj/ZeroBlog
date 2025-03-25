<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="flex items-center gap-1">
      <Icon name="lucide:calendar" /> {{ formatTime(props.article.date, props.dateFormat) }}
    </span>

    <NuxtLink
      v-for="tag in props.article.tags"
      :key="tag"
      prefetch
      prefetch-on="interaction"
      class="flex items-center hover:decoration-underline"
      :to="`/tags/${tag}`"
    >
      <Icon name="lucide:hash" /> {{ tag }}
    </NuxtLink>

    <span v-if="props.wordsCount" class="flex items-center gap-1">
      <Icon name="lucide:eye" /> {{ props.article.readingTime.words }} words
    </span>

    <span v-if="props.readingTime" class="flex items-center gap-1">
      <Icon name="lucide:clock" /> {{ props.article.readingTime.text }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { ParsedContent } from '@nuxt/content'

const props = defineProps<{
  article: Partial<ParsedContent>
  dateFormat?: string
  wordsCount?: boolean
  readingTime?: boolean
}>()
</script>

<style scoped></style>
