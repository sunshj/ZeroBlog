<template>
  <div class="flex flex-col justify-between bg-slate-100 p-0 uno-card dark:bg-dark">
    <div class="flex items-center justify-between p-4">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <div class="text-md text-dark font-bold dark:text-gray-300">
            {{ props.data.name }}
          </div>
          <span class="flex gap-2">
            <Icon v-for="stackIcon in props.data.techStack" :key="stackIcon" :name="stackIcon" />
          </span>
        </div>

        <p class="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {{ props.data.description }}
        </p>
      </div>
      <div class="flex gap-2 text-gray-600 dark:text-gray-300">
        <NuxtLink v-if="props.data.link" :target="linkTarget" title="Website" :to="props.data.link">
          <Icon name="lucide:globe" :size="20" />
        </NuxtLink>
        <NuxtLink v-if="props.data.repo" target="_blank" title="Github Repo" :to="props.data.repo">
          <Icon name="lucide:github" :size="20" />
        </NuxtLink>
        <NuxtLink v-if="props.data.npm" target="_blank" title="Npm Package" :to="props.data.npm">
          <Icon name="lucide:package" :size="20" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  data: Project
}>()

const linkTarget = computed(() => {
  return props.data.link?.startsWith('/') && !props.data.link?.startsWith('//') ? '_self' : '_blank'
})
</script>
