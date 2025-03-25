<template>
  <DashboardEditorFrame class="w-full">
    <template #header>
      <button class="flex uno-btn items-center gap-1" @click="push">
        <Icon name="lucide:cloud-upload" />
        <div>推送</div>
      </button>
    </template>

    <MonacoEditor
      v-if="data?.content"
      v-model="data.content"
      :options="{ minimap: { autohide: true } }"
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
