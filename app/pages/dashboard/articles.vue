<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex gap-2">
      <UiButton icon="lucide:plus" @click="createArticle">新建文章</UiButton>
      <input v-model="searchText" class="uno-input w-fit" :placeholder="`搜索文章(${total}篇)`" />
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
        :key="item.path"
        prefetch
        prefetch-on="interaction"
        class="uno-card p-4 !no-underline"
        :to="`/dashboard${item.path}`"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex-1">{{ item.path }}</div>
          <div class="flex flex-1 gap-1">
            <div v-if="(item.sticky ?? 0) > 0" class="rounded-lg bg-amber px-2 py-1 text-sm">置顶</div>
            <div>{{ item.title }}</div>
          </div>

          <div class="flex flex-1 gap-2">
            <div v-for="tag in item.tags" :key="tag" class="rounded-lg bg-gray-1 px-2 py-1 text-sm dark:bg-gray-8">
              {{ tag }}
            </div>
          </div>

          <div class="flex-1">{{ formatTime(item.date) }}</div>
          <div class="flex items-center gap-1">
            <UiButton
              icon="lucide:navigation"
              title="查看文章"
              color="gray"
              @click.prevent="navigateTo(item.path)"
            ></UiButton>
            <UiButton icon="lucide:trash-2" color="red" @click.prevent.stop="deleteArticle(item.path)"></UiButton>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RepoWriteResult } from '#shared/repo'

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
  queryCollection('articles').where('hidden', '=', false).count()
)

const { data } = await useAsyncData(
  'articles',
  () =>
    queryCollection('articles')
      .select('path', 'title', 'date', 'sticky', 'tags')
      .where('hidden', '=', false)
      .order('date', 'DESC')
      .order('sticky', 'DESC')
      .all(),

  {
    watch: [searchText],
    transform: items =>
      items.filter(
        item =>
          item.title?.toLowerCase().includes(searchText.value.toLowerCase()) ||
          item.path?.toLowerCase().includes(searchText.value.toLowerCase())
      )
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
  const { message } = await $fetch<RepoWriteResult>('/api/repo/file', {
    method: 'DELETE',
    query: { path: `content${path}.md` }
  })
  toast.show(message)
}
</script>

<style scoped></style>
