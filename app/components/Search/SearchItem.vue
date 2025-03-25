<template>
  <div
    class="flex flex-col justify-between gap-2 border-2 border-gray-300 rounded-lg border-solid bg-slate-100 px-4 py-2 dark-border-gray-500 hover:border-amber dark:bg-dark"
  >
    <NuxtLink
      :to="data.item.id"
      prefetch
      prefetch-on="interaction"
      class="decoration-none hover:decoration-none"
    >
      <div class="flex flex-col gap-2">
        <div
          name="title"
          class="text-lg text-black font-bold dark:text-gray-300"
          v-html="colorizeText('title', data.item.title)"
        />

        <div v-if="data.item.titles.length" name="titles">
          <span v-for="(item, index) in [...data.item.titles, data.item.title]" :key="index">
            <span class="text-base">{{ item }}</span>
            <Icon
              v-if="index !== data.item.titles.length"
              class="text-gray-400"
              name="lucide:chevron-right"
            />
          </span>
        </div>

        <p
          name="content"
          class="line-clamp-2 text-sm text-gray-600 dark:text-gray-400"
          v-html="colorizeText('content', data.item.content)"
        />
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import type { FuseResult } from 'fuse.js'

const props = defineProps<{
  data: FuseResult<any>
}>()

function colorizeText(key: 'title' | 'titles' | 'content', text: string) {
  const match = props.data.matches?.find(match => match.key === key && match.value === text)
  if (!match || !match.indices?.length) return escapeHtml(text)
  const range = mergeIntervals([...match.indices])

  let result = ''
  let lastIndex = 0

  range.forEach(([start, end]) => {
    result += escapeHtml(text.slice(lastIndex, start))
    result += `<span style="background-color: yellow;">${text.slice(start, end + 1)}</span>`
    lastIndex = end + 1
  })

  result += escapeHtml(text.slice(lastIndex))

  return result
}
</script>
