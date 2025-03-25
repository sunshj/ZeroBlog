<template>
  <DashboardEditorFrame show-preview class="w-full">
    <template #header>
      <button class="flex uno-btn items-center gap-1" @click="push">
        <Icon name="lucide:cloud-upload" />
        <div>推送文章</div>
      </button>
      <button class="flex uno-btn items-center gap-1 border-red-5 bg-red-500" @click="remove">
        <Icon name="lucide:trash-2" />
        <div>删除文章</div>
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

const route = useRoute('dashboard-scope-slug')

const { data, status } = useFetch('/api/repo-contents', {
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
date: ${formatTime(Date.now())}
---
`
  }
})

const article = computedAsync(async () => await parseMarkdown(content.value))

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

function remove() {
  const confirmDelete = window.confirm('确定要删除文章吗？')
  if (!confirmDelete) return
  // TODO: 删除文章
}

onUnmounted(() => {
  content.value = ''
  article.value = undefined
})
</script>
