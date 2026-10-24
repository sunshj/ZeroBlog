<template>
  <DashboardContentPageEditor :key="filePath" :files="files" push-label="推送文章">
    <template #leading>
      <UiButton
        icon="lucide:arrow-left"
        color="ghost"
        :icon-size="18"
        title="返回列表"
        class="h-8 w-8"
        @click="goBack"
      />
    </template>

    <template #actions>
      <UiButton icon="lucide:trash-2" color="red" @click="remove">删除文章</UiButton>
    </template>

    <template #preview="{ contents, loading }">
      <div v-if="loading" class="h-full w-full flex-center">
        <Icon name="lucide:loader-circle" :size="20" class="animate-spin text-gray-400" />
      </div>
      <DashboardArticlePreview v-else :content="contents[filePath] ?? ''" />
    </template>
  </DashboardContentPageEditor>
</template>

<script lang="ts" setup>
import { dateFormat } from '#shared/datetime'
import type { RepoWriteResult } from '#shared/repo'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Dashboard - 编辑文章'
})

const route = useRoute('dashboard-scope-slug')

const filePath = `content/${route.params.scope}/${route.params.slug}.md`

function goBack() {
  navigateTo(`/dashboard/${route.params.scope}`)
}

const files = [
  {
    path: filePath,
    lang: 'markdown',
    template: `---
title: 新建文章
path: /${route.params.scope}/${route.params.slug}
date: '${dateFormat(Date.now())}'
---
`
  }
]

async function remove() {
  const confirmDelete = window.confirm('确定要删除文章吗？')
  if (!confirmDelete) return

  const { message } = await $fetch<RepoWriteResult>('/api/repo/file', {
    method: 'DELETE',
    query: { path: filePath }
  })
  window.alert(message)
}

onMounted(() => {
  window.addEventListener('beforeunload', e => {
    e.preventDefault()
  })
})
</script>
