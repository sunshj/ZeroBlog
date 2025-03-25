import { parseBlob } from 'music-metadata'

export interface Lyric {
  time: number
  text: string
}

function parseTime(time: string): number {
  const [minutes, seconds] = time.split(':')
  return Number(minutes) * 60 + Number(seconds)
}

export function formatPlayTime(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

function parseLyric(lyric: string) {
  const lines = lyric.split('\n').filter(Boolean)
  const result: Lyric[] = []

  for (const line of lines) {
    const [time, text] = line.split(']')
    if (!text) continue
    if (['ti', 'ar', 'al', 'by', 'offset', 'kana'].some(v => time?.includes(v))) continue
    const timeNum = parseTime(time!.slice(1))
    result.push({ time: timeNum, text })
  }

  return result
}

async function toFurigana<T extends Lyric[]>(lyricUrl: string, lyrics: T) {
  const { data: cached } = useNuxtData<Lyric[]>(`${lyricUrl}-furigana`)

  if (!cached.value) {
    if (lyrics.some(v => v.text === undefined)) throw new Error('每一项必须有一个 `text`')

    const { data } = await $fetch<{ data: Lyric[] }>('https://api.sunshj.top/open/kana', {
      method: 'POST',
      body: {
        text: lyrics
      }
    })

    cached.value = data
  }

  return cached.value.map(({ text, ...items }) => {
    return {
      ...items,
      text: text.replaceAll('<rt', "<rt style='font-size:12px;font-weight:normal' ")
    }
  })
}

export async function queryLyricData(lyricUrl: string, enableFurigana = false) {
  const { data: cached } = useNuxtData<string>(lyricUrl)
  if (!cached.value) {
    cached.value = await $fetch<string>(lyricUrl, { responseType: 'text' })
  }

  const parsedLyric = parseLyric(cached.value)
  if (!enableFurigana) return parsedLyric
  return await toFurigana(lyricUrl, parsedLyric)
}

export async function getAudioFileMetadata(file: File) {
  const { common } = await parseBlob(file)

  const filename = file.name.slice(0, file.name.lastIndexOf('.'))
  const [_title, _artist] = filename.split(' - ')

  const title = common.title || _title || filename
  const artist = common.artist || _artist || filename

  return {
    title,
    artist
  }
}

export async function getLyricFromRemote(name: string, artist: string) {
  const BASE_URL = 'https://api.timelessq.com/music/tencent'

  const data = await $fetch<any>(`${BASE_URL}/search`, { query: { keyword: name } })
  if (!data?.data?.list?.length) return

  const song =
    data?.data?.list?.find((song: any) => song.singer.find((v: any) => v.name === artist)) ||
    data?.data?.list?.[0]

  if (!song) return

  const res = await $fetch<any>(`${BASE_URL}/lyric`, {
    query: { songmid: song.songmid }
  })

  if (!res.data.lyric) return

  const lyricFile = new File([res.data.lyric], `${name}.lrc`, { type: 'text/plain' })
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(lyricFile)

  return {
    lyricFile,
    dataTransfer
  }
}
