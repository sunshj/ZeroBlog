<template>
  <div class="flex flex-col gap-4 p-2">
    <input v-model="searchText" class="w-fit uno-input" placeholder="搜索文章" />

    <div class="flex flex-col gap-2">
      <NuxtLink
        v-for="item in data"
        :key="item._path"
        prefetch
        prefetch-on="interaction"
        class="p-4 no-underline uno-card"
        :to="`/dashboard${item._path}`"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">{{ item._path }}</div>
          <div class="flex-1">{{ item.title }}</div>

          <div class="flex flex-1 gap-2">
            <div v-for="tag in item.tags" :key="tag" class="rounded-lg bg-gray-1 px-2 py-1 text-sm">
              {{ tag }}
            </div>
          </div>

          <div class="flex-1">{{ formatTime(item.date) }}</div>
          <div>
            <button
              class="flex-center cursor-pointer rounded-md border-none bg-red-500 p-2 text-white"
              @click.prevent="deleteArticle(item._path!)"
            >
              <Icon name="lucide:trash-2" />
            </button>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  menu: {
    label: '文章',
    order: 2,
    icon: 'lucide:file-pen'
  },
  layout: 'dashboard'
})

const searchText = ref('')

const { data } = await useAsyncData(
  'articles',
  () =>
    queryContent('/articles')
      .only(['_path', 'title', 'description', 'date', 'sticky', 'tags'])
      .where({
        hidden: false,
        $or: [
          { title: { $contains: searchText.value } },
          { _path: { $contains: searchText.value } }
        ]
      })
      .sort({ date: -1, sticky: -1 })
      .find(),

  {
    watch: [searchText]
  }
)

function deleteArticle(path: string) {
  console.log('item: ', path)
}
</script>

<style scoped></style>
