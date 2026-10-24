<template>
  <div class="uno-card flex flex-col justify-between bg-slate-100 p-0 dark:bg-dark">
    <div class="flex items-center justify-between p-4">
      <div class="min-w-0 flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <div class="text-md text-dark font-bold dark:text-gray-300">
            {{ props.name }}
          </div>
          <span class="flex gap-2">
            <Icon v-for="stackIcon in props.techStack" :key="stackIcon" :name="stackIcon" />
          </span>
        </div>

        <p class="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {{ props.description }}
        </p>
      </div>
      <div class="flex gap-2 text-gray-600 dark:text-gray-300">
        <NuxtLink v-if="props.link" :target="linkTarget" title="Website" :to="props.link">
          <Icon name="lucide:globe" :size="20" />
        </NuxtLink>
        <NuxtLink v-if="props.repo" target="_blank" title="Github Repo" :to="props.repo">
          <Icon name="lucide:github" :size="20" />
        </NuxtLink>
        <NuxtLink v-if="props.npm" target="_blank" title="Npm Package" :to="props.npm">
          <Icon name="lucide:package" :size="20" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Project {
  name: string
  link?: string
  repo?: string
  npm?: string
  description: string
  techStack?: string[]
}

const props = defineProps<Project>()

const linkTarget = computed(() => {
  return props.link?.startsWith('/') && !props.link?.startsWith('//') ? '_self' : '_blank'
})
</script>
