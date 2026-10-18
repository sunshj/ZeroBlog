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

const { data: page, error } = useAsyncData(path.value, () => queryCollection('notes').path(path.value).first())

const title = () => page.value?.title || site.title
const description = () => page.value?.description || site.description

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

defineOgImage('BlogPost.takumi', {
  title,
  description
})

watchEffect(() => {
  if (!page.value) return
  route.meta.title = page.value.title
})

const { data: surround } = useAsyncData(`prev-next-${path.value}`, () =>
  queryCollectionItemSurroundings('notes', path.value, {
    before: 1,
    after: 1,
    fields: ['path', 'title', 'description']
  })
)
const prev = computed(() => surround.value?.[0] ?? null)
const next = computed(() => surround.value?.[1] ?? null)
</script>

<style scoped></style>
