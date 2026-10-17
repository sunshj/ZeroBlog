<template>
  <DashboardContentPageEditor :files="files">
    <template #preview="{ contents, loading }">
      <div v-if="loading" class="h-full w-full flex-center">
        <Icon name="lucide:loader-circle" :size="20" class="animate-spin text-gray-400" />
      </div>
      <div v-else class="grid gap-4 md:grid-cols-2">
        <ProjectCard v-for="project in parseProjects(contents[dataPath] ?? '')" :key="project.name" :data="project" />
      </div>
    </template>
  </DashboardContentPageEditor>
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

const dataPath = 'content/data/projects.yaml'

const files = [{ path: dataPath, lang: 'yaml' }]

function parseProjects(content: string): Project[] {
  if (!content) return []

  try {
    return (parseFrontMatter(`---\n${content}\n---`).data.projects as Project[]) ?? []
  } catch {
    return []
  }
}
</script>
