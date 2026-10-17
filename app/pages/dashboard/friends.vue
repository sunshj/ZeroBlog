<template>
  <DashboardContentPageEditor :files="files">
    <template #preview="{ contents, loading }">
      <div v-if="loading" class="h-full w-full flex-center">
        <Icon name="lucide:loader-circle" :size="20" class="animate-spin text-gray-400" />
      </div>
      <div v-else class="flex flex-col gap-6">
        <div class="grid gap-4 md:grid-cols-2">
          <FriendCard v-for="friend in parseFriends(contents[dataPath] ?? '')" :key="friend.name" :data="friend" />
        </div>
        <DashboardMarkdownPreview :content="contents[pagePath] ?? ''" />
      </div>
    </template>
  </DashboardContentPageEditor>
</template>

<script lang="ts" setup>
import { parseFrontMatter } from 'remark-mdc'

definePageMeta({
  menu: {
    label: '友链',
    order: 4,
    icon: 'lucide:link'
  },
  layout: 'dashboard'
})

useHead({
  title: 'Dashboard - 友链'
})

const dataPath = 'content/data/friends.yaml'
const pagePath = 'content/friends.md'

const files = [
  { path: dataPath, lang: 'yaml' },
  {
    path: pagePath,
    lang: 'markdown',
    template: `---
title: 友链
path: /friends
ogImage: true
comment: true
---
`
  }
]

function parseFriends(content: string): Friend[] {
  if (!content) return []

  try {
    return (parseFrontMatter(`---\n${content}\n---`).data.friends as Friend[]) ?? []
  } catch {
    return []
  }
}
</script>
