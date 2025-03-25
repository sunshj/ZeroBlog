<template>
  <DashboardEditorFrame show-preview class="w-full">
    <template #header>
      <button class="border rounded px-2 py-1" @click="updateArticle">更新文章</button>
    </template>

    <MonacoEditor
      v-if="!!article"
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
  query: {
    path: `content/articles/${route.params.slug}.md`
  }
})

// const oldData = useCloned(data, { flush: 'sync' })
const oldData = data.value

const article = computedAsync(async () => await parseMarkdown(data.value!))

function updateArticle() {
  if (oldData === data.value) {
    window.alert('没有改动')
    return
  }
}
</script>
