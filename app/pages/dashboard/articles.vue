<template>
  <div class="flex flex-col gap-4 p-2">
    <div class="flex gap-2">
      <button class="flex uno-btn items-center gap-1" @click="createArticle">
        <Icon name="lucide:plus" />
        <div>新建文章</div>
      </button>
      <input v-model="searchText" class="w-fit uno-input" placeholder="搜索文章" />
    </div>
    <div class="flex flex-col gap-2 rounded-md p-2">
      <div class="flex items-center justify-between gap-2 px-4 font-bold">
        <div class="flex-1">路径</div>
        <div class="flex-1">标题</div>
        <div class="flex-1">标签</div>
        <div class="flex-1">日期</div>
      </div>

      <NuxtLink
        v-for="item in data"
        :key="item._path"
        prefetch
        prefetch-on="interaction"
        class="p-4 uno-card !no-underline"
        :to="`/dashboard${item._path}`"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex-1">{{ item._path }}</div>
          <div class="flex flex-1 gap-1">
            <div v-if="item.sticky > 0" class="rounded-lg bg-amber px-2 py-1 text-sm">置顶</div>
            <div>{{ item.title }}</div>
          </div>

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
    order: 1,
    icon: 'lucide:file-pen'
  },
  layout: 'dashboard'
})

const searchText = ref('')

const { data } = await useAsyncData(
  'articles',
  () =>
    queryContent('/articles')
      .only(['_path', 'title', 'date', 'sticky', 'tags'])
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

async function createArticle() {
  const path = window.prompt('请输入文章id，这将作为路径和唯一标识符')
  if (!path) return
  await navigateTo(`/dashboard/articles/${path}`)
}

const toast = useToast()

function deleteArticle(path: string) {
  const confirmDelete = window.confirm(`确定删除 ${path} 吗？`)
  console.log('confirmDelete: ', confirmDelete)
  toast.show('删除成功')
}
</script>

<style scoped></style>
