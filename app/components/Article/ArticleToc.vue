<template>
  <div class="pos-sticky right-0 top-20 hidden h-fit w-40 flex-col gap-2 lg:flex">
    <NuxtLink
      v-for="link in props.links"
      :key="link.id"
      class="block text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
      :class="{
        'font-semibold text-gray-700 dark:text-gray-300': $route.hash === `#${link.id}`
      }"
      :style="{ paddingLeft: `${(link.depth - 1) * 10}px` }"
      :to="{ path: $route.path, hash: `#${link.id}` }"
    >
      {{ link.text }}
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import type { TocLink } from '@nuxt/content'

const props = defineProps<{
  links?: TocLink[]
}>()
</script>
