<template>
  <DashboardEditorFrame show-preview class="w-full">
    <template #header>
      <button class="flex uno-btn items-center gap-1" @click="push">
        <Icon name="lucide:cloud-upload" />
        <div>推送文章</div>
      </button>
    </template>

    <MonacoEditor
      v-if="status === 'success'"
      v-model="content"
      :options="{ minimap: { autohide: true } }"
      class="h-full"
      lang="markdown"
    />

    <template #preview>
      <ContentRenderer :value="article">
        <template #empty>
          <div class="h-full w-full flex-center">
            <div class="flex flex-col items-center gap-2">
              <div class="text-4xl">
                <Icon name="lucide:file-text" />
              </div>
              <div>没有可渲染的内容</div>
            </div>
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

const route = useRoute('dashboard-notes-slug')

const { data, status } = useFetch('/api/repo-contents', {
  query: {
    path: `content/notes/${route.params.slug}.md`
  }
})

const content = ref('')

watchEffect(() => {
  if (data.value) {
    content.value = data.value.content
  } else {
    content.value = `---
title: 新建文章
path: /notes/${route.params.slug}
date: ${formatTime(Date.now())}
---
`
  }
})

const article = computedAsync(async () => await parseMarkdown(content.value))

const toast = useToast()

async function push() {
  toast.show('正在推送文章，请稍等...')
  const { message } = await $fetch('/api/repo-contents', {
    method: 'PUT',
    body: {
      path: `content/notes/${route.params.slug}.md`,
      content: content.value
    }
  })

  window.alert(message)
}

onUnmounted(() => {
  content.value = ''
  article.value = undefined
})
</script>
