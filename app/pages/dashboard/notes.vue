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
        <div class="flex items-center justify-between">
          <div class="flex-1">{{ item._path }}</div>
          <div class="flex-1">{{ item.title }}</div>

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
    label: '小记',
    order: 2,
    icon: 'lucide:notebook-pen'
  },
  layout: 'dashboard'
})

useHead({
  title: 'Dashboard - 小记'
})

const searchText = ref('')

const { data: total } = useAsyncData('total-notes', () =>
  queryContent('/notes').where({ hidden: false }).count()
)
const { data } = await useAsyncData(
  'notes',
  () =>
    queryContent('/notes')
      .only(['_path', 'title', 'date'])
      .where({
        hidden: false,
        $or: [
          { title: { $contains: searchText.value } },
          { _path: { $contains: searchText.value } }
        ]
      })
      .sort({ date: -1 })
      .find(),

  {
    watch: [searchText]
  }
)

async function createArticle() {
  const path = window.prompt('请输入文章id，这将作为路径和唯一标识符')
  if (!path) return
  await navigateTo(`/dashboard/notes/${path}`)
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
