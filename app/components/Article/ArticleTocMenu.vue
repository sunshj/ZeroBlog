<template>
  <div>
    <div v-if="props.links?.length" class="float-btn md:hidden" @click="open = true">
      <Icon name="lucide:list" :size="24" class="dark:text-light-800" />
    </div>

    <Drawer v-model="open" class="md:hidden">
      <div class="h-auto max-h-50vh min-h-30vh flex flex-col">
        <div class="my-4 text-center text-base font-medium">文章目录</div>
        <div class="mx-auto w-full flex-1 overflow-y-auto px-4">
          <div class="pb-15">
            <NuxtLink
              v-for="link in props.links"
              :key="link.id"
              :to="{ path: $route.path, hash: `#${link.id}` }"
              class="mb-2 block text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              :class="{
                'font-semibold text-gray-700 dark:text-gray-200': $route.hash === `#${link.id}`
              }"
              :style="{ paddingLeft: `${(link.depth - 1) * 15}px` }"
              @click="open = false"
            >
              {{ link.text }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
import type { TocLink } from '@nuxt/content'

const props = defineProps<{
  links?: TocLink[]
}>()

const open = ref(false)
</script>
