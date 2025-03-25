<template>
  <div class="flex items-center gap-4 py-4 text-lg text-gray-800 dark:text-gray-400">
    <div class="h-8 w-8 flex-center cursor-pointer rounded-lg" @click="emit('change', 1)">
      <Icon name="lucide:chevrons-left" />
    </div>
    <div class="h-8 w-8 flex-center cursor-pointer rounded-lg" @click="prevPage">
      <Icon name="lucide:chevron-left" />
    </div>

    <div name="page-list" class="flex gap-1 dark:text-gray-500">
      <ClientOnly>
        <div
          v-for="pageNum in props.pageCount"
          :key="pageNum"
          class="h-8 w-8 flex-center cursor-pointer rounded-lg transition-all hover:bg-gray-1"
          :class="{
            'bg-gray-1 text-gray-800 dark:bg-gray-3 dark:hover:bg-gray-3':
              props.currentPage === pageNum
          }"
          @click="emit('change', pageNum)"
        >
          {{ pageNum }}
        </div>
      </ClientOnly>
    </div>

    <div class="h-8 w-8 flex-center cursor-pointer rounded-lg" @click="nextPage">
      <Icon name="lucide:chevron-right" />
    </div>
    <div
      class="h-8 w-8 flex-center cursor-pointer rounded-lg"
      @click="emit('change', props.pageCount)"
    >
      <Icon name="lucide:chevrons-right" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    currentPage: number
    pageCount: number
  }>(),
  {
    currentPage: 1,
    pageCount: 1
  }
)

const emit = defineEmits<{
  (e: 'change', pageNum: number): void
}>()

function prevPage() {
  if (props.currentPage > 1) {
    emit('change', props.currentPage - 1)
  } else {
    emit('change', 1)
  }
}

function nextPage() {
  if (props.currentPage < props.pageCount) {
    emit('change', props.currentPage + 1)
  } else {
    emit('change', props.pageCount)
  }
}
</script>

<style scoped></style>
