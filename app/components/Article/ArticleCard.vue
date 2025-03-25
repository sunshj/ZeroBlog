<template>
  <div class="relative flex flex-col justify-between p-4 uno-card">
    <NuxtLink :to="props.article._path" prefetch class="decoration-none hover:decoration-none">
      <div class="flex flex-col gap-2">
        <div class="text-2xl text-black dark:text-gray-300">
          {{ props.article.title }}
        </div>

        <p class="line-clamp-2 text-gray-600 dark:text-gray-400">{{ props.article.description }}</p>
      </div>
    </NuxtLink>

    <div class="text-sm text-gray-500 dark:text-gray-500">
      <ArticleTags :article="props.article" date-format="YYYY-MM-DD" />
    </div>

    <div
      v-if="props.showSticky && props.article.sticky"
      class="absolute right-2 top-2 flex items-center gap-1 rounded px-1 py-1px text-xs text-gray-400 md:bg-gray-100 md:dark:bg-gray-800"
    >
      <Icon name="fa6-solid:thumbtack" class="lt-md:rotate-45 md:text-10px" />
      <div class="hidden md:block">置顶</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ParsedContent } from '@nuxt/content'

const props = defineProps<{
  article: Partial<ParsedContent>
  showSticky?: boolean
}>()
</script>
