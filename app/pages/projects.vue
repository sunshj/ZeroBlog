<template>
  <div class="flex flex-col gap-10 p-4">
    <ProseH1 class="text-amber">Projects</ProseH1>
    <div class="grid gap-4 md:grid-cols-2">
      <ProjectCard v-for="project in projects" :key="project.name" :data="project" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { site } = useAppConfig()

const title = '项目'
const description = site.description

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

defineOgImageComponent('BlogPost', {
  title,
  description
})

const { data } = useAsyncData('projects-data', () => queryContent('/data/projects').findOne())
const projects = computed<Project[]>(() => data.value?.projects ?? [])

defineOgImageComponent('BlogPost')
</script>

<style scoped></style>
