<template>
  <NuxtLink :to="props.data.link" target="_blank" class="decoration-none hover:decoration-none">
    <div class="flex items-center px-3 uno-card">
      <Avatar
        class="rounded-full"
        :width="60"
        :height="60"
        :src="props.data.avatar"
        :alt="props.data.name"
      >
        {{ props.data.name.slice(0, 1).toUpperCase() }}
      </Avatar>

      <div class="flex flex-col justify-around p-2">
        <div class="text-xl">{{ props.data.name }}</div>
        <div class="line-clamp-2 text-sm text-gray-500">{{ props.data.description }}</div>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps<{
  data: Friend
}>()
</script>

<style scoped />
