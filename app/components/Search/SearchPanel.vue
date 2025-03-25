<template>
  <Dialog
    v-model="visible"
    :close-on-click-modal="false"
    :show-close="false"
    modal-class="md:h-500px h-full rounded-none md:rounded-lg"
  >
    <div
      class="w-full flex items-center border-b border-gray-200 border-b-solid dark:border-gray-700"
    >
      <Icon name="lucide:search" :size="20" class="ml-4 mr-2 text-gray-500" />
      <input
        ref="searchInputRef"
        v-model="search"
        type="text"
        tabindex="-1"
        class="flex-1 rounded-lg border-none py-4 outline-none focus:border-none dark:bg-dark"
        placeholder="Search"
        @input="handleSearch"
      />
      <Icon
        name="lucide:x"
        :size="18"
        class="mx-4 cursor-pointer text-gray-500 hover:text-gray-700"
        @click="clean"
      />
    </div>
    <div class="h-full flex flex-1 overflow-y-auto p-4">
      <div v-if="results.length > 0" class="w-full">
        <div class="flex flex-col gap-2 pb-4">
          <SearchItem
            v-for="result in results"
            :key="result.refIndex"
            :data="result"
            @click="close"
          />
        </div>
      </div>
      <div v-else class="w-full flex-center flex-col gap-2 text-gray-400">
        <Icon name="lucide:search" :size="50" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import type { FuseResult } from 'fuse.js'

const visible = defineModel({ default: false, required: true })

const search = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
const results = ref<Array<FuseResult<any>>>([])

const handleSearch = useThrottleFn(async () => {
  const data = await fuseSearchContent(search)
  results.value = data.value
}, 100)

watch(search, () => {
  if (!search.value.trim()) {
    results.value = []
  }
})

function clean() {
  if (search.value) {
    search.value = ''
  } else {
    close()
  }
}

function close() {
  visible.value = false
  search.value = ''
  results.value = []
}

const isLocked = useScrollLock(window)

watchEffect(() => {
  isLocked.value = visible.value
  if (visible.value) {
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  } else {
    close()
  }
})
</script>
