<template>
  <div class="h-screen text-center">
    <div
      ref="volumeControlRef"
      name="volume-controll"
      class="fixed inset-0 z-10 hidden h-full w-1/3 opacity-0 md:flex"
    />
    <div class="h-full flex flex-col items-center overflow-hidden">
      <audio
        ref="audioRef"
        :volume="0.2"
        class="z-50 my-4 h-10 w-[400px] lt-sm:w-95%"
        :src="source.audioUrl"
        controls
        loop
      />
      <div
        ref="containerRef"
        name="container"
        class="w-full flex-1 overflow-x-hidden scroll-smooth pb-[45vh]"
        :class="[isPlaying ? 'overflow-y-hidden' : 'overflow-y-auto']"
      >
        <ul ref="lyricsRef" class="transition duration-700">
          <li
            v-for="(item, index) in lyrics"
            :key="item.time"
            :time="formatPlayTime(item.time)"
            class="relative h-10 flex-center cursor-pointer overflow-hidden leading-10 transition-all duration-200 hover:bg-gray-100 hover:after:absolute hover:after:right-24 dark:hover:bg-gray-700 hover:after:text-xl hover:after:text-gray-3 hover:after:font-bold hover:after:content-[attr(time)] lt-sm:hover:after:hidden"
            :class="{
              'text-base': index !== activeIndex,
              'dark:text-light font-semibold text-xl': index === activeIndex
            }"
            @click="onLyricClick(item.time)"
            v-html="item.text"
          />
        </ul>
      </div>

      <button
        aria-label="Custom Play"
        class="bottom-25 right-12 bg-black text-white float-btn"
        @click="open = true"
      >
        <Icon
          class="hover:animate-bounce-scale"
          name="material-symbols:dashboard-customize-rounded"
          :size="24"
        />
      </button>

      <ColorModeToggle class="bottom-10 right-12 border-1 p-2 float-btn" />

      <Dialog v-model="open" class="hidden sm:flex" modal-style="width: 500px">
        <MusicForm @submit="handleSubmit" />
      </Dialog>

      <Drawer v-model="open" class="flex sm:hidden">
        <div class="h-60vh flex flex-col">
          <MusicForm @submit="handleSubmit" />
        </div>
      </Drawer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTitle } from '@vueuse/core'
import type { MusicForm } from '~/components/MusicForm.vue'

definePageMeta({
  layout: false
})

const toast = useToast()

const volumeControlRef = ref<HTMLDivElement>()
const containerRef = ref<HTMLDivElement>()
const audioRef = ref<HTMLAudioElement>()
const lyricsRef = ref<HTMLUListElement>()

const source = reactive({
  name: '優しい彗星',
  artist: 'YOASOBI',
  audioUrl: '/audio/yasashii-suisei.mp3',
  lyricUrl: '/audio/yasashii-suisei.lrc'
})

useTitle(() => `${source.name} | ${source.artist}`)

const enableFurigana = ref(false)

const { data: lyrics, refresh } = useAsyncData('lyrics', () =>
  queryLyricData(source.lyricUrl, enableFurigana.value)
)

const { pause, resume } = watch(lyrics, _lyrics => {
  if (_lyrics?.length) {
    enableFurigana.value = true
    pause()
    refresh()
  }
})

watch(
  () => source.lyricUrl,
  async () => {
    enableFurigana.value = false
    await refresh()
    resume()
  }
)

useEventListener(volumeControlRef, 'wheel', e => {
  if (!audioRef.value) return
  let { volume } = audioRef.value
  const delta = e.deltaY

  if (delta > 0 && volume >= 0.1) {
    volume -= 0.1
    audioRef.value.volume = Number.parseFloat(volume.toFixed(1))
  } else if (delta < 0 && volume <= 0.9) {
    volume += 0.1
    audioRef.value.volume = Number.parseFloat(volume.toFixed(1))
  }
  toast.show(`音量: ${audioRef.value.volume * 100}%`)
})

function calcOffsetAndScroll(index: number) {
  if (!containerRef.value || !lyricsRef.value) return
  const container = containerRef.value
  const containerHeight = container.clientHeight
  const liHeight = lyricsRef.value.children[0]!.clientHeight!

  const offset = liHeight * index + liHeight / 2 - containerHeight / 2
  const toTargetOffset = offset >= 0 ? offset : 0

  container.style.transition = `all 200ms ease-in-out`
  container.scroll({ top: toTargetOffset })

  nextTick(() => {
    container.style.transition = ''
  })
}

const activeIndex = ref(0)
const isPlaying = ref(false)

useEventListener(audioRef, 'play', () => {
  isPlaying.value = true
})

useEventListener(audioRef, 'pause', () => {
  isPlaying.value = false
})

// listen Space key
onKeyStroke(' ', e => {
  if (audioRef.value) {
    e.preventDefault()
    if (isPlaying.value) {
      audioRef.value?.pause()
    } else {
      audioRef.value?.play()
    }
  }
})

function findActiveIndex(curTime: number) {
  if (!lyrics.value) return 0
  for (let i = 0; i < lyrics.value.length; i++) {
    if (+curTime.toFixed(2) < +lyrics.value![i]!.time.toFixed(2)) return i - 1
  }
  return lyrics.value.length - 1
}

useEventListener(audioRef, 'timeupdate', e => {
  const { currentTime } = e.target as HTMLAudioElement
  const index = findActiveIndex(currentTime)
  activeIndex.value = index
  calcOffsetAndScroll(index)
})

function onLyricClick(time: number) {
  if (!audioRef.value) return
  audioRef.value.currentTime = time
}

const open = ref(false)

function handleSubmit(musicForm: MusicForm) {
  if (!musicForm.audio || !musicForm.lyric) {
    toast.show('请上传音频和歌词文件')
    return
  }
  source.name = musicForm.name
  source.artist = musicForm.artist
  source.audioUrl = URL.createObjectURL(musicForm.audio)
  source.lyricUrl = URL.createObjectURL(musicForm.lyric)
  open.value = false
}
</script>
