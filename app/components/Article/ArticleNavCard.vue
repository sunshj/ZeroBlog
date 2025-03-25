<template>
  <div
    class="relative h-full flex flex-1 flex-col cursor-pointer border border-gray-300 rounded-lg border-solid p-4 transition-all dark:border-gray-800 hover:bg-light dark:hover:bg-dark"
    :class="{
      'items-end text-right': position === 'right'
    }"
  >
    <span
      class="text-primary pointer-events-none mb4 h-7 w-7 inline-flex flex-none items-center text-lg"
    >
      <Icon :name="position === 'left' ? 'lucide:arrow-left' : 'lucide:arrow-right'" />
    </span>
    <div class="my-0 text-lg font-semibold">
      {{ title }}
    </div>
    <div class="line-clamp-2 mb-0 mt-1 text-[14px] op50">
      {{ description }}
      <slot />
    </div>
    <NuxtLink prefetch-on="interaction" :to="to" prefetch class="absolute inset-0" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string
    title?: string
    description?: string
    position: 'left' | 'right'
  }>(),
  {
    to: '',
    title: '',
    description: ''
  }
)
</script>
