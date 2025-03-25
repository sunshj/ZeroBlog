<template>
  <div class="flex flex-col gap-4 p-6">
    <div class="text-left">
      <div class="text-xl font-bold">Custom Play</div>
      <div class="text-sm text-gray-500">Customize the music and lyrics.</div>
    </div>
    <form class="flex flex-col items-start gap-2" @submit.prevent="handleSubmit">
      <div class="w-full flex flex-col gap-1 text-left">
        <label for="music-name">name</label>
        <input
          id="music-name"
          v-model="musicForm.name"
          type="text"
          class="uno-input"
          required
          @change="musicForm.name = ($event.target as HTMLInputElement).value"
        />
      </div>

      <div class="w-full flex flex-col gap-1 text-left">
        <label for="music-artist">artist</label>
        <input
          id="music-artist"
          v-model="musicForm.artist"
          type="text"
          required
          class="uno-input"
          @change="musicForm.artist = ($event.target as HTMLInputElement).value"
        />
      </div>

      <div class="w-full flex flex-col gap-1 text-left">
        <label for="music-audio">audio</label>
        <input
          id="music-audio"
          type="file"
          required
          accept=".mp3,.wav,.ogg,.flac"
          class="uno-input-file"
          @change="onAudioFileChange"
        />
      </div>

      <div class="w-full flex flex-col gap-1 text-left">
        <label for="music-lyric">lyric</label>
        <input
          id="music-lyric"
          ref="lyricFileRef"
          type="file"
          accept=".lrc"
          required
          class="uno-input-file"
          @change="musicForm.lyric = ($event.target as HTMLInputElement)?.files?.[0]"
        />
      </div>

      <button
        type="submit"
        class="mt-4 w-full cursor-pointer border-1 border-black rounded-md border-solid bg-black p-2 text-base text-white"
      >
        提交
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
export interface MusicForm {
  name: string
  artist: string
  audio?: File
  lyric?: File
}

const emit = defineEmits<{
  (e: 'submit', form: MusicForm): void
}>()

const musicForm = reactive<MusicForm>({
  name: '',
  artist: '',
  audio: undefined,
  lyric: undefined
})

const toast = useToast()
const lyricFileRef = ref<HTMLInputElement | null>(null)

async function onAudioFileChange(e: Event) {
  const [file] = (e.target as HTMLInputElement).files!
  if (!file) return
  musicForm.audio = file
  const { title, artist } = await getAudioFileMetadata(file)
  musicForm.name = title
  musicForm.artist = artist

  const remoteLyric = await getLyricFromRemote(title, artist)
  if (!remoteLyric) {
    toast.show('未找到歌词，请手动上传歌词文件')
    return
  }
  musicForm.lyric = remoteLyric.lyricFile
  lyricFileRef.value!.files = remoteLyric.dataTransfer.files
}

function handleSubmit() {
  emit('submit', musicForm)
}
</script>

<style scoped></style>
