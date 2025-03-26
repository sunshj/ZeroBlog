<template>
  <div
    class="fixed left-50% top-15% z-9999 rounded-md bg-black px-5 py-2.5 text-white -translate-1/2 dark:bg-gray-700"
  >
    {{ message }}
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  message: string
}>()
</script>
