<template>
  <div>
    <ArticleRender
      :article="page"
      :error="error"
      :show-comment="page?.comment ?? notesConfig.comment"
      :show-copyright="notesConfig.copyright"
      :show-surround="notesConfig.surround"
      :tag-options="{ readingTime: false, wordsCount: false }"
      :prev="prev"
      :next="next"
    />
  </div>
</template>

<script lang="ts" setup>
import { withoutTrailingSlash } from 'ufo'

definePageMeta({
  isArticlePage: true
})

const route = useRoute()
const path = computed(() => withoutTrailingSlash(route.path))

const { site, notesConfig } = useAppConfig()

const { data: page, error } = useAsyncData(path.value, () => queryContent(path.value).findOne())

const title = () => page.value?.title || site.title
const description = () => page.value?.description || site.description

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

defineOgImageComponent('BlogPost', {
  title,
  description
})

watchEffect(() => {
  if (!page.value) return
  route.meta.title = page.value.title
})

const { data: surround } = useAsyncData(`prev-next-${path.value}`, () =>
  queryContent('/notes')
    .only(['_path', 'title', 'description'])
    .where({ hidden: false })
    .sort({ date: -1 })
    .findSurround(path.value)
)
const prev = computed(() => surround.value?.[0])
const next = computed(() => surround.value?.[1])
</script>

<style scoped></style>
