<template>
  <div class="h-full w-full flex flex-col bg-gray-1 px-3 dark:bg-dark-8">
    <div class="flex items-center gap-2 py-3">
      <slot name="header"></slot>
    </div>

    <DashboardSplitPane
      :show-second="showPreview"
      :initial="55"
      storage-key="dashboard-editor-preview-split"
      class="flex-1"
    >
      <template #first>
        <div class="h-full bg-white dark:bg-dark">
          <slot>
            <div class="h-full w-full flex-center">
              <Icon class="animate-spin" :size="24" name="lucide:loader" />
            </div>
          </slot>
        </div>
      </template>

      <template #second>
        <div class="h-full overflow-y-auto bg-white p-2 dark:bg-dark">
          <slot name="preview" />
        </div>
      </template>
    </DashboardSplitPane>
  </div>
</template>

<script lang="ts" setup>
const { showPreview = false } = defineProps<{
  showPreview?: boolean
}>()
</script>

<style scoped></style>
