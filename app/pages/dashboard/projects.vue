<template>
  <DashboardEditorFrame show-preview class="w-full">
    <template #header>
      <UiButton icon="lucide:cloud-upload" @click="push">推送</UiButton>
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

useHead({
  title: 'Dashboard - 项目'
})

const { data, status } = useFetch<{ content: string }>('/api/repo-contents', {
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
