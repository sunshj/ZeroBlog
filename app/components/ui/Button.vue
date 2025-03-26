<template>
  <button
    class="flex-center cursor-pointer gap-1 rounded-lg p-2"
    :class="{
      'bg-transparent border-none hover:bg-gray-200 dark:hover:bg-gray-600': color === 'ghost',
      'bg-red-500 text-white border-none': color === 'red',
      'bg-black text-white dark:bg-white dark:text-black border-none': !color || color === 'black',
      'bg-white dark:bg-black border-2 border-gray-200 dark:border-neutral-800  dark:text-gray-300 border-solid':
        color === 'gray'
    }"
  >
    <Icon
      v-if="icon"
      :name="icon"
      :size="iconSize"
      :class="{
        'animate-spin': loading
      }"
    />
    <slot />
  </button>
</template>

<script lang="ts" setup>
const {
  icon,
  iconSize,
  loading,
  color = 'black'
} = defineProps<{
  icon?: string
  iconSize?: number
  loading?: boolean
  color?: 'red' | 'black' | 'gray' | 'ghost'
}>()
</script>
