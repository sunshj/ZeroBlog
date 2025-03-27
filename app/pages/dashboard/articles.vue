<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex gap-2">
      <UiButton icon="lucide:plus" @click="createArticle">新建文章</UiButton>
      <input v-model="searchText" class="w-fit uno-input" :placeholder="`搜索文章(${total}篇)`" />
    </div>
    <div class="flex flex-col gap-2 rounded-md">
      <div class="flex items-center justify-between gap-2 px-4 font-bold">
        <div class="flex-1">路径</div>
        <div class="flex-1">标题</div>
        <div class="flex-1">标签</div>
        <div class="flex-1">日期</div>
        <div>操作</div>
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
            <div
              v-for="tag in item.tags"
              :key="tag"
              class="rounded-lg bg-gray-1 px-2 py-1 text-sm dark:bg-gray-8"
            >
              {{ tag }}
            </div>
          </div>

          <div class="flex-1">{{ formatTime(item.date) }}</div>
          <div>
            <UiButton
              icon="lucide:trash-2"
              color="red"
              @click.prevent="deleteArticle(item._path!)"
            ></UiButton>
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

useHead({
  title: 'Dashboard - 文章'
})

const searchText = ref('')

const { data: total } = useAsyncData('total-articles', () =>
  queryContent('/articles').where({ hidden: false }).count()
)

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

async function deleteArticle(path: string) {
  const confirmDelete = window.confirm(`确定删除 ${path} 吗？`)
  if (!confirmDelete) return
  const { message } = await $fetch('/api/repo-file', {
    method: 'DELETE',
    body: { path: `content${path}.md` }
  })

  toast.show(message)
}
</script>

<style scoped></style>
