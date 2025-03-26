<template>
  <DashboardEditorFrame show-preview class="w-full">
    <template #header>
      <UiButton icon="lucide:cloud-upload" @click="push">推送文章</UiButton>
      <UiButton icon="lucide:trash-2" color="red" @click="remove">删除文章</UiButton>
    </template>

    <MonacoEditor
      v-if="status === 'success'"
      v-model="content"
      :options="{
        minimap: { autohide: true },
        theme: $colorMode.value === 'dark' ? 'vs-dark' : 'vs-light'
      }"
      class="h-full"
      lang="markdown"
    />

    <template #preview>
      <ArticleRender :article="article" :tag-options="{ readingTime: false, wordsCount: false }" />
    </template>
  </DashboardEditorFrame>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Dashboard - 编辑文章'
})

const route = useRoute('dashboard-scope-slug')

const { data, status } = useFetch<{ content: string }>('/api/repo-contents', {
  query: {
    path: `content/${route.params.scope}/${route.params.slug}.md`
  }
})

const content = ref('')

watchEffect(() => {
  if (data.value) {
    content.value = data.value.content
  } else {
    content.value = `---
title: 新建文章
path: /${route.params.scope}/${route.params.slug}
date: '${formatTime(Date.now())}'
---
`
  }
})

const article = computedAsync(async () => {
  const { body, data } = await parseMarkdown(content.value)
  return { body, ...data }
})

const toast = useToast()

async function push() {
  const confirmPush = window.confirm('确定要推送文章吗？')
  if (!confirmPush) return
  toast.show('正在推送文章，请稍等...')
  const { message } = await $fetch('/api/repo-contents', {
    method: 'PUT',
    body: {
      path: `content/${route.params.scope}/${route.params.slug}.md`,
      content: content.value
    }
  })

  window.alert(message)
}

async function remove() {
  const confirmDelete = window.confirm('确定要删除文章吗？')
  if (!confirmDelete) return
  const { message } = await $fetch('/api/repo-file', {
    method: 'DELETE',
    body: { path: `content/${route.params.scope}/${route.params.slug}.md` }
  })

  window.alert(message)
}

onUnmounted(() => {
  content.value = ''
  article.value = undefined
})
</script>
