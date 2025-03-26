<template>
  <div class="flex items-center justify-between uno-card">
    <div class="flex flex-1 gap-4">
      <img class="h-20 w-20 rounded-lg object-cover" :src="imgSrc" />
      <div class="flex flex-col justify-between">
        <div class="flex items-center gap-2">
          <span class="font-bold">Filename: </span>
          <span>{{ filename }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-bold">Github: </span>
          <NuxtLink :href="githubUrl" target="_blank" class="text-emerald">
            {{ githubUrl }}
          </NuxtLink>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-bold">jsDelivr: </span>
          <NuxtLink :href="jsdelivrUrl" target="_blank" class="text-emerald">
            {{ jsdelivrUrl }}
          </NuxtLink>
          <CodeCopy :code="jsdelivrUrl" />
        </div>
      </div>
    </div>
    <div class="mr-4">
      <UiButton color="red" icon="lucide:trash-2" @click="emit('delete', filename)"></UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { filename, previewUrl, githubUrl, jsdelivrUrl } = defineProps<{
  filename: string
  previewUrl: string | Promise<string>
  githubUrl: string
  jsdelivrUrl: string
}>()

const emit = defineEmits<{
  delete: [filename: string]
}>()

const imgSrc = computedAsync(async () => await previewUrl)
</script>

<style scoped></style>
