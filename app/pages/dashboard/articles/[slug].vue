<template>
  <DashboardEditorFrame show-preview class="w-full">
    <template #header>
      <button class="flex uno-btn items-center gap-1" @click="updateArticle">
        <Icon name="lucide:cloud-upload" />
        <div>更新文章</div>
      </button>
    </template>

    <MonacoEditor
      v-if="!!data"
      v-model="data"
      :options="{ minimap: { autohide: true } }"
      class="h-full"
      lang="markdown"
    />

    <template #preview>
      <ContentRenderer :value="article">
        <template #empty>
          <div class="h-full w-full flex-center">
            <Icon class="animate-spin" :size="24" name="lucide:loader" />
          </div>
        </template>
      </ContentRenderer>
    </template>
  </DashboardEditorFrame>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard'
})

const route = useRoute('dashboard-articles-slug')

const { data } = useFetch('/api/repo-contents', {
  default: () => `---
title: 新建文章
path: /articles/${route.params.slug}
date: ${formatTime(Date.now())}
---

新建文章`,
  query: {
    path: `content/articles/${route.params.slug}.md`
  }
})

const oldData = useCloned(data, { immediate: false })

const article = computedAsync(async () => await parseMarkdown(data.value!))

function updateArticle() {
  if (oldData.cloned.value === data.value) {
    window.alert('没有改动')
    return
  }
}
</script>
