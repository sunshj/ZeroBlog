<template>
  <div class="flex flex-col gap-4 p-4">
    <ClientOnly>
      <div
        class="w-full flex items-center justify-center"
        @dragover.prevent
        @dragenter.prevent
        @drop.prevent="handleDrop"
      >
        <label
          for="dropzone-file"
          class="h-64 w-full flex flex-col cursor-pointer items-center justify-center border-2 border-gray-300 rounded-lg border-dashed bg-gray-50 dark:border-gray-600 dark:bg-gray-700 hover:bg-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:hover:bg-gray-800"
        >
          <div class="flex flex-col items-center justify-center pb-6 pt-5">
            <Icon
              class="mb-2 text-gray-500 dark:text-gray-400"
              name="lucide:cloud-upload"
              :size="32"
            />
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold">点击或拖拽添加图片</span>
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
          </div>
          <input id="dropzone-file" multiple type="file" class="hidden" @change="onFileChange" />
        </label>
      </div>
    </ClientOnly>

    <div class="flex gap-2">
      <img
        v-for="file in files"
        :key="file.name"
        class="h-20 w-20 rounded-lg object-cover"
        :src="getObjectUrl(file)"
      />
    </div>

    <div class="flex justify-end">
      <button class="flex-center gap-1 text-lg uno-btn" @click="uploadImages">
        <Icon name="lucide:cloud-upload" />上传
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  menu: {
    label: '图床',
    order: 6,
    icon: 'lucide:image-up'
  },
  layout: 'dashboard'
})

useServerHead({
  title: 'Dashboard - 图床'
})

const { dashboard } = useAppConfig()

const files = ref<File[]>([])

function handleDrop(event: DragEvent) {
  files.value = uniqueBy([...files.value, ...(event.dataTransfer?.files ?? [])], 'name')
}

function onFileChange(event: any) {
  files.value = uniqueBy([...files.value, ...(event.target?.files ?? [])], 'name')
}

watchEffect(() => {
  console.log('files.value: ', files.value)
})

function getObjectUrl(file: File) {
  return URL.createObjectURL(file)
}

const toast = useToast()

async function uploadImages() {
  if (files.value.length === 0) {
    toast.show('请先添加图片')
    return
  }
  for (const img of files.value) {
    const { message } = await $fetch('/api/repo-contents', {
      method: 'PUT',
      body: {
        repo: dashboard.imageBed.repo,
        path: `${dashboard.imageBed.path}/${img.name}`,
        content: await blobToBase64(img),
        type: 'base64',
        message: `Upload ${dashboard.imageBed.path}/${img.name}`
      }
    })

    toast.show(message)
  }
}
</script>
