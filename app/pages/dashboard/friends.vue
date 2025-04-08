<template>
  <DashboardEditorFrame show-preview class="w-full">
    <template #header>
      <UiButton icon="lucide:cloud-upload" @click="push">推送</UiButton>
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

useHead({
  title: 'Dashboard - 友链'
})

const { $trpc } = useNuxtApp()

const { data } = $trpc.repoFileContent.useQuery(
  { path: 'content/data/friends.yaml' },
  {
    deep: true
  }
)

const friends = computed(() => parseFrontMatter(`---\n${data.value?.content}\n---`).data.friends)

const toast = useToast()

async function push() {
  const confirmPush = window.confirm('确定要推送吗？')
  if (!confirmPush) return
  toast.show('正在推送，请稍等...')
  const { message } = await $trpc.upsertRepoFileContent.mutate({
    path: 'content/data/friends.yaml',
    content: data.value?.content ?? ''
  })

  window.alert(message)
}
</script>
