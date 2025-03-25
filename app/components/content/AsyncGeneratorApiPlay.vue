<template>
  <div class="w-full flex flex-col gap-2 md:flex-row">
    <form
      class="h-30 flex flex-col justify-between gap-2 border border-gray-300 rounded-md border-solid p-2"
      @submit.prevent="run"
    >
      <textarea v-model="payloadData" class="uno-input" type="text" placeholder="payload text" />
      <button
        class="w-full flex-center cursor-pointer gap-1 border-1 border-black rounded-md border-solid bg-black p-1 text-base text-white disabled:cursor-not-allowed disabled:bg-gray-600"
        type="submit"
        :disabled="isRunning"
      >
        <Icon
          :name="isRunning ? 'lucide:loader-2' : 'lucide:play'"
          :class="[isRunning ? 'animate-spin' : '']"
        />
        run
      </button>
    </form>
    <div class="h-30 overflow-auto border border-gray-300 rounded-md border-solid p-1 md:flex-1">
      <div v-for="{ msg, error, payload } in histories" :key="msg" class="p-1">
        <div class="flex items-center gap-1 text-sm text-gray-600">
          <Icon
            v-if="msg !== 'error'"
            :name="current?.msg === msg ? 'lucide:loader-2' : 'lucide:circle-check'"
            :class="[current?.msg === msg ? 'animate-spin' : 'text-green-500']"
          />
          <Icon v-else name="lucide:circle-x" class="text-red-500" />
          <span>{{ msg }}</span>
          <span v-if="payload" class="bg-gray-100 px-1 text-gray-400">
            {{ payload }}
          </span>
          <span v-if="error" class="text-red-500">{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { safeDestr } from 'destr'

interface Snapshot {
  msg: string
  payload?: any
  error?: any
}

const payloadData = ref('some payload.')
const current = ref<Snapshot | null>(null)
const isRunning = ref(false)

const histories = ref<Snapshot[]>([])

watchEffect(() => {
  if (current.value) {
    histories.value.push(current.value)
  }
})

function clear() {
  current.value = null
  histories.value = []
}

async function run() {
  isRunning.value = true
  clear()
  const response = await $fetch<ReadableStream>('https://api.sunshj.top/iterator', {
    query: {
      data: payloadData.value
    },
    responseType: 'stream'
  })
  const decoder = new TextDecoder()
  const reader = response.getReader()
  if (!reader) return
  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      current.value = null
      break
    }
    const text = decoder.decode(value, { stream: true })
    current.value = safeDestr(text)
  }
  isRunning.value = false
}

onMounted(run)
</script>
