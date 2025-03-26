<template>
  <div
    v-if="error"
    class="aspect-ratio-1 flex-center rounded-full bg-gray-300 text-xl text-gray-700 dark:bg-gray-400"
    :style="{
      width: `${$attrs.width}px`,
      height: `${$attrs.height}px`
    }"
  >
    <slot />
  </div>
  <NuxtImg v-else v-bind="$attrs" @error="error = true" />
</template>

<script lang="ts" setup>
defineOptions({
  inheritAttrs: false
})

const error = ref(false)
</script>

<style scoped></style>
