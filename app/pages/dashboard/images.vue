<template>
  <div class="flex flex-col gap-4 p-4">
    <div
      class="w-full flex items-center justify-center"
      @dragover.prevent
      @dragenter.prevent
      @drop.prevent="handleDrop"
    >
      <label
        for="dropzone-file"
        class="h-64 w-full flex flex-col cursor-pointer items-center justify-center border-2 border-gray-300 rounded-lg border-dashed bg-gray-50 transition-all dark:border-gray-600 dark:bg-gray-700 hover:bg-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-800"
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

    <div class="flex items-center justify-between">
      <div class="flex gap-2">
        <div>
          <span class="font-bold">存储仓库：</span>
          <ProseCode> github.com/{{ user?.name }}/{{ imageBedRepo }} </ProseCode>
        </div>
        <div>
          <span class="font-bold">存储目录：</span>
          <ProseCode> {{ imageBedFolder }} </ProseCode>
        </div>
      </div>

      <div class="flex gap-2">
        <UiSegmentedButton :options="layoutOptions" @change="onLayoutViewChange" />

        <UiButton
          :loading="loading"
          :icon="loading ? 'lucide:loader-circle' : 'lucide:cloud-upload'"
          @click="uploadImages"
        >
          上传全部
        </UiButton>
      </div>
    </div>

    <!-- upload images -->
    <div class="w-full flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <div class="text-3xl font-bold">本地图片列表</div>
        <UiButton
          v-if="files.length > 0"
          class="h-8"
          icon="lucide:trash-2"
          :icon-size="18"
          color="red"
          @click="files.length = 0"
          >删除全部</UiButton
        >
      </div>
      <div
        :class="{
          'grid grid-cols-4 gap-2': layoutView === 'grid',
          'flex flex-col gap-4': layoutView === 'list'
        }"
      >
        <DashboardImageCard
          v-for="file in files"
          :key="file.name"
          :mini="layoutView === 'grid'"
          :filename="file.name"
          :preview-url="getPreviewUrl(file)"
          :github-url="getGithubUrl(file.name)"
          :jsdelivr-url="getJsDelivrUrl(file.name)"
          @delete="removeImage"
        />
      </div>
    </div>

    <!-- exists images -->
    <div class="w-full flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <div class="text-3xl font-bold">远程图片列表</div>

        <UiButton
          class="h-8 w-8"
          icon="lucide:refresh-ccw"
          :icon-size="18"
          :loading="status === 'pending'"
          @click="refresh"
        />
      </div>

      <div
        :class="{
          'grid grid-cols-4 gap-2': layoutView === 'grid',
          'flex flex-col gap-4': layoutView === 'list'
        }"
      >
        <DashboardImageCard
          v-for="file in images"
          :key="file.name"
          :mini="layoutView === 'grid'"
          :filename="file.name"
          :preview-url="getPreviewUrl(getJsDelivrUrl(file.name))"
          :github-url="getGithubUrl(file.name)"
          :jsdelivr-url="getJsDelivrUrl(file.name)"
          @delete="deleteRemoteImage"
        />
      </div>
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

useHead({
  title: 'Dashboard - 图床'
})

const { imageBedRepo, imageBedFolder } = useNuxtApp().$config.public
const { user } = useUserSession()

const files = ref<File[]>([])

const layoutOptions = [
  {
    label: 'Grid View',
    value: 'grid',
    icon: 'lucide:layout-grid'
  },
  {
    label: 'List View',
    value: 'list',
    icon: 'lucide:layout-list'
  }
]
const layoutView = ref('grid')

function onLayoutViewChange(option: any) {
  layoutView.value = option.value
}

const {
  data: images,
  refresh,
  status
} = await useFetch<any[]>('/api/repo-contents', {
  query: {
    repo: imageBedRepo,
    path: imageBedFolder
  }
})

function handleDrop(event: DragEvent) {
  files.value = uniqueBy([...files.value, ...(event.dataTransfer?.files ?? [])], 'name')
}

function onFileChange(event: any) {
  files.value = uniqueBy([...files.value, ...(event.target?.files ?? [])], 'name')
}

function getPreviewUrl(fileOrUrl: string | File) {
  return compressImage(fileOrUrl, 0.1)
}

function getGithubUrl(filename: string) {
  return `https://github.com/${user.value?.name}/${imageBedRepo}/blob/master/${imageBedFolder}/${filename}`
}

function getJsDelivrUrl(filename: string) {
  return `https://cdn.jsdelivr.net/gh/${user.value?.name}/${imageBedRepo}/${imageBedFolder}/${filename}`
}

const toast = useToast()

const loading = ref(false)

const bus = useEventBus('mdc:copied')
bus.on(() => {
  toast.show('已复制到剪切板')
})

function removeImage(name: string) {
  files.value = files.value.filter(f => f.name !== name)
}

async function deleteRemoteImage(name: string) {
  const confirmDelete = window.confirm('确认删除该图片，此操作将从远程仓库中移除该图片')
  if (!confirmDelete) return

  const { message } = await $fetch('/api/repo-file', {
    method: 'DELETE',
    body: {
      repo: imageBedRepo,
      path: `${imageBedFolder}/${name}`
    }
  })
  toast.show(message)
  await refresh()
}

async function uploadImages() {
  if (files.value.length === 0) {
    toast.show('请先添加图片')
    return
  }
  loading.value = true
  for (const img of files.value) {
    const { message } = await $fetch('/api/repo-contents', {
      method: 'PUT',
      body: {
        repo: imageBedRepo,
        path: `${imageBedFolder}/${img.name}`,
        content: await blobToBase64(img),
        type: 'base64',
        message: `Upload ${imageBedFolder}/${img.name}`
      }
    })

    toast.show(message)
  }
  loading.value = false
  refresh()
}
</script>
