<template>
  <div class="h-full w-full flex flex-col bg-gray-1 dark:bg-dark-8">
    <div class="flex items-center gap-2 px-4 py-3">
      <slot name="header"></slot>
    </div>
    <div class="flex flex-1 overflow-hidden p-2">
      <div class="flex-1 bg-white dark:bg-dark">
        <slot>
          <div class="h-full w-full flex-center">
            <Icon class="animate-spin" :size="24" name="lucide:loader" />
          </div>
        </slot>
      </div>

      <div v-if="showPreview" class="flex-1 overflow-y-auto bg-white p-2 dark:bg-dark">
        <slot name="preview" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { showPreview = false } = defineProps<{
  showPreview?: boolean
}>()
</script>

<style scoped></style>
