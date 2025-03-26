<template>
  <DashboardEditorFrame show-preview class="w-full">
    <template #header>
      <button class="flex items-center gap-1 uno-btn" @click="push">
        <Icon name="lucide:cloud-upload" />
        <div>推送</div>
      </button>
    </template>

    <MonacoEditor
      v-if="data?.content"
      v-model="data.content"
      :options="{
        minimap: { autohide: true },
        theme: $colorMode.value === 'dark' ? 'vs-dark' : 'vs-light'
      }"
      class="h-full"
      lang="yaml"
    />

    <template #preview>
      <div class="grid gap-4 md:grid-cols-2">
        <FriendCard v-for="friend in friends" :key="friend.name" :data="friend" />
      </div>
    </template>
  </DashboardEditorFrame>
</template>

<script lang="ts" setup>
import { parseFrontMatter } from 'remark-mdc'

definePageMeta({
  menu: {
    label: '友链',
    order: 4,
    icon: 'lucide:link'
  },
  layout: 'dashboard'
})

useServerHead({
  title: 'Dashboard - 友链'
})

const { data } = useFetch('/api/repo-contents', {
  query: {
    path: 'content/data/friends.yaml'
  },
  deep: true
})

const friends = computed(() => parseFrontMatter(`---\n${data.value?.content}\n---`).data.friends)

const toast = useToast()

async function push() {
  const confirmPush = window.confirm('确定要推送吗？')
  if (!confirmPush) return
  toast.show('正在推送，请稍等...')
  const { message } = await $fetch('/api/repo-contents', {
    method: 'PUT',
    body: {
      path: 'content/data/friends.yaml',
      content: data.value?.content
    }
  })

  window.alert(message)
}
</script>
