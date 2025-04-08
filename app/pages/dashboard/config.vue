<template>
  <DashboardEditorFrame class="w-full">
    <template #header>
      <UiButton icon="lucide:cloud-upload" @click="push">推送</UiButton>
    </template>

    <MonacoEditor
      v-if="data?.content"
      v-model="data.content"
      :options="{
        theme: $colorMode.value === 'dark' ? 'vs-dark' : 'vs-light'
      }"
      class="h-full"
      lang="typescript"
    />
  </DashboardEditorFrame>
</template>

<script lang="ts" setup>
definePageMeta({
  menu: {
    label: '配置',
    order: 5,
    icon: 'lucide:settings'
  },
  layout: 'dashboard'
})

useHead({
  title: 'Dashboard - 配置'
})

const { $trpc } = useNuxtApp()

const { data } = $trpc.repoFileContent.useQuery({ path: 'app/app.config.ts' }, { deep: true })

const toast = useToast()

async function push() {
  const confirmPush = window.confirm('确定要推送吗？')
  if (!confirmPush) return
  toast.show('正在推送，请稍等...')
  const { message } = await $trpc.upsertRepoFileContent.mutate({
    path: 'app/app.config.ts',
    content: data.value?.content ?? ''
  })

  window.alert(message)
}
</script>
