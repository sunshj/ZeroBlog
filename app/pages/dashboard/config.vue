<template>
  <DashboardEditorFrame class="w-full">
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

useServerHead({
  title: 'Dashboard - 配置'
})

const { data } = useFetch('/api/repo-contents', {
  query: {
    path: 'app/app.config.ts'
  },
  deep: true
})

const toast = useToast()

async function push() {
  const confirmPush = window.confirm('确定要推送吗？')
  if (!confirmPush) return
  toast.show('正在推送，请稍等...')
  const { message } = await $fetch('/api/repo-contents', {
    method: 'PUT',
    body: {
      path: 'app/app.config.ts',
      content: data.value?.content
    }
  })

  window.alert(message)
}
</script>
