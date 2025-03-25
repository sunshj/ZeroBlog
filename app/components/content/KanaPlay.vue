<template>
  <div class="w-full flex flex-col gap-2 overflow-hidden md:h-400px md:flex-row">
    <form
      class="flex flex-col gap-4 border border-gray-300 rounded-md border-solid p-4"
      @submit.prevent="refresh()"
    >
      <div class="flex flex-col gap-1">
        <label for="kana-play-text">文本</label>
        <textarea
          id="kana-play-text"
          v-model="form.text"
          :rows="4"
          class="uno-input"
          required
          type="text"
          placeholder="请输入要转换的日文"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="kana-play-mode">mode</label>
        <select id="kana-play-mode" v-model="form.mode" class="uno-input">
          <option v-for="mode in modeOptions" :key="mode" :value="mode">{{ mode }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label for="kana-play-to">to</label>
        <select id="kana-play-to" v-model="form.to" class="uno-input">
          <option v-for="to in toOptions" :key="to" :value="to">{{ to }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-2">
        <button
          class="w-full flex-center cursor-pointer gap-1 border-1 border-black rounded-md border-solid bg-black p-1 text-base text-white disabled:bg-gray-600"
          type="submit"
          :disabled="status === 'pending'"
        >
          <Icon
            v-if="status === 'pending'"
            name="lucide:loader"
            :class="{
              'animate-spin': status === 'pending'
            }"
          />
          转换
        </button>

        <button
          class="w-full cursor-pointer border-1 border-red-600 rounded-md border-solid bg-red-600 p-1 text-base text-white"
          type="button"
          @click="clean"
        >
          清空
        </button>
      </div>
    </form>

    <div
      class="flex flex-1 flex-col gap-4 overflow-auto border border-gray-300 rounded-md border-solid p-4"
    >
      <div>{{ output }}</div>
      <div
        v-if="output"
        class="rounded bg-gray-100 p-2 pt-4 lh-loose dark:bg-dark"
        v-html="output"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const modeOptions = ['normal', 'spaced', 'okurigana', 'furigana']
const toOptions = ['hiragana', 'katakana', 'romaji']

const form = reactive({
  text: '感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！',
  mode: 'furigana',
  to: 'hiragana'
})

const output = ref('')

const { data, refresh, status } = await useAsyncData(
  'kana-play',
  () =>
    $fetch<{ data: string }>('https://api.sunshj.top/open/kana', {
      method: 'POST',
      body: form
    }),
  { server: false }
)

watchEffect(() => {
  output.value = data.value?.data || ''
})

function clean() {
  form.text = ''
  output.value = ''
}
</script>
