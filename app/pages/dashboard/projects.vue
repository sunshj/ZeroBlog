<template>
  <DashboardEditorFrame show-preview class="w-full">
    <template #header>
      <button class="flex items-center gap-1 uno-btn" @click="push">
        <Icon name="lucide:cloud-upload" />
        <div>推送</div>
      </button>
    </template>

    <MonacoEditor
      v-if="status === 'success' && data?.content"
      v-model="data.content"
      :options="{
        minimap: { autohide: true },
        theme: $colorMode.value === 'dark' ? 'vs-dark' : 'vs-light'
      }"
      class="h-full"
      lang="yaml"
    />

    <template #preview>
      <div class="grid gap-4 md:grid-cols-2">
        <ProjectCard v-for="project in projects" :key="project.name" :data="project" />
      </div>
    </template>
  </DashboardEditorFrame>
</template>

<script lang="ts" setup>
import { parseFrontMatter } from 'remark-mdc'

definePageMeta({
  menu: {
    label: '项目',
    order: 3,
    icon: 'lucide:code-xml'
  },
  layout: 'dashboard'
})

useServerHead({
  title: 'Dashboard | Projects'
})

const { data, status } = useFetch('/api/repo-contents', {
  query: {
    path: 'content/data/projects.yaml'
  },
  deep: true
})

const projects = computed(() => parseFrontMatter(`---\n${data.value?.content}\n---`).data.projects)

const toast = useToast()

async function push() {
  const confirmPush = window.confirm('确定要推送吗？')
  if (!confirmPush) return
  toast.show('正在推送，请稍等...')
  const { message } = await $fetch('/api/repo-contents', {
    method: 'PUT',
    body: {
      path: 'content/data/projects.yaml',
      content: data.value?.content
    }
  })

  window.alert(message)
}
</script>
