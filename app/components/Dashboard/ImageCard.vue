<template>
  <div class="flex items-center justify-between uno-card" :title="mini ? filename : ''">
    <div class="flex flex-1 gap-4">
      <img class="h-20 w-20 rounded-lg object-cover" :src="imgSrc" />
      <div class="flex flex-col justify-between">
        <div class="flex items-center gap-2">
          <span class="font-bold">File: </span>
          <p class="line-clamp-1 break-all">{{ filename }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-bold">Github: </span>
          <NuxtLink v-if="!mini" :href="githubUrl" target="_blank" class="text-emerald">
            {{ githubUrl }}
          </NuxtLink>
          <NuxtLink v-else :href="githubUrl" target="_blank" class="text-emerald"> Link </NuxtLink>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-bold">jsDelivr: </span>
          <NuxtLink v-if="!mini" :href="jsdelivrUrl" target="_blank" class="text-emerald">
            {{ jsdelivrUrl }}
          </NuxtLink>
          <NuxtLink v-else :href="jsdelivrUrl" target="_blank" class="text-emerald">
            Link
          </NuxtLink>

          <CodeCopy :code="jsdelivrUrl" />
        </div>
      </div>
    </div>

    <UiButton
      :class="[!mini && 'mr-4']"
      class="h-8 w-8"
      color="red"
      icon="lucide:trash-2"
      @click="emit('delete', filename)"
    ></UiButton>
  </div>
</template>

<script lang="ts" setup>
const { filename, previewUrl, githubUrl, jsdelivrUrl, mini } = defineProps<{
  filename: string
  previewUrl: string | Promise<string>
  githubUrl: string
  jsdelivrUrl: string
  mini?: boolean
}>()

const emit = defineEmits<{
  delete: [filename: string]
}>()

const imgSrc = computedAsync(async () => await previewUrl)
</script>

<style scoped></style>
