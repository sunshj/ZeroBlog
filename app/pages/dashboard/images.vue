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

    <div class="flex items-center justify-between">
      <div class="flex gap-2">
        <div>
          <span class="font-bold">存储仓库：</span>
          <ProseCode> github.com/{{ user?.name }}/{{ dashboard.imageBed.repo }} </ProseCode>
        </div>
        <div>
          <span class="font-bold">存储目录：</span>
          <ProseCode> {{ dashboard.imageBed.path }} </ProseCode>
        </div>
      </div>
      <button class="flex-center gap-1 text-lg uno-btn" @click="uploadImages">
        <Icon
          :class="{
            'animate-spin': loading
          }"
          :name="loading ? 'lucide:loader-circle' : 'lucide:cloud-upload'"
        />上传全部
      </button>
    </div>

    <div class="w-full flex flex-col gap-4">
      <div
        v-for="file in files"
        :key="file.name"
        class="flex items-center justify-between uno-card"
      >
        <div class="flex flex-1 gap-4">
          <img class="h-20 w-20 rounded-lg object-cover" :src="getObjectUrl(file)" />
          <div class="flex flex-col justify-between">
            <div class="flex items-center gap-2">
              <span class="font-bold">Filename: </span>
              <span>{{ file.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-bold">Github: </span>
              <NuxtLink :href="getGithubUrl(file)" target="_blank" class="text-emerald">
                {{ getGithubUrl(file) }}
              </NuxtLink>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-bold">jsDelivr: </span>
              <NuxtLink :href="getJsDelivrUrl(file)" target="_blank" class="text-emerald">
                {{ getJsDelivrUrl(file) }}
              </NuxtLink>
              <CodeCopy :code="getJsDelivrUrl(file)" />
            </div>
          </div>
        </div>
        <div>
          <button
            class="flex-center cursor-pointer rounded-md border-none bg-red-500 p-2 text-white"
            @click="removeImage(file.name)"
          >
            <Icon name="lucide:trash-2" />
          </button>
        </div>
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

useServerHead({
  title: 'Dashboard - 图床'
})

const { dashboard } = useAppConfig()
const { user } = useUserSession()

const files = ref<File[]>([])

function handleDrop(event: DragEvent) {
  files.value = uniqueBy([...files.value, ...(event.dataTransfer?.files ?? [])], 'name')
}

function onFileChange(event: any) {
  files.value = uniqueBy([...files.value, ...(event.target?.files ?? [])], 'name')
}

function getObjectUrl(file: File) {
  return URL.createObjectURL(file)
}

function getGithubUrl(file: File) {
  return `https://github.com/${user.value?.name}/${dashboard.imageBed.repo}/blob/master/${dashboard.imageBed.path}/${file.name}`
}

function getJsDelivrUrl(file: File) {
  return `https://cdn.jsdelivr.net/gh/${user.value?.name}/${dashboard.imageBed.repo}/${dashboard.imageBed.path}/${file.name}`
}

const toast = useToast()

const loading = ref(false)

const bus = useEventBus('mdc:copied')
bus.on(() => {
  toast.show('已复制到剪切板')
})

function removeImage(name: string) {
  const confirmDelete = window.confirm('确认删除该图片，此操作不会删除仓库文件')
  if (!confirmDelete) return
  files.value = files.value.filter(f => f.name !== name)
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
        repo: dashboard.imageBed.repo,
        path: `${dashboard.imageBed.path}/${img.name}`,
        content: await blobToBase64(img),
        type: 'base64',
        message: `Upload ${dashboard.imageBed.path}/${img.name}`
      }
    })

    toast.show(message)
  }
  loading.value = false
}
</script>
