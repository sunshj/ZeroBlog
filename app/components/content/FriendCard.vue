<template>
  <NuxtLink :to="props.link" target="_blank" class="decoration-none hover:decoration-none">
    <div class="uno-card flex items-center px-3">
      <UiAvatar class="rounded-full" :width="60" :height="60" :src="props.avatar" :alt="props.name">
        {{ props.name.slice(0, 1).toUpperCase() }}
      </UiAvatar>

      <div class="min-w-0 flex flex-col justify-around p-2">
        <div class="text-xl">{{ props.name }}</div>
        <div class="line-clamp-2 text-sm text-gray-500">{{ props.description }}</div>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
interface Friend {
  name: string
  link: string
  avatar: string
  description: string
}

const props = defineProps<Friend>()
</script>

<style scoped />
