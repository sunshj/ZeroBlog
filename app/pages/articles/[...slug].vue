<template>
  <div>
    <ArticleRender
      :article="page"
      :pending="status === 'pending'"
      :error="error"
      :show-comment="page?.comment ?? articleConfig.comment"
      :show-copyright="articleConfig.copyright"
      :show-surround="articleConfig.surround"
      :prev="prev"
      :next="next"
    />
  </div>
</template>

<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'

definePageMeta({
  isArticlePage: true
})

const route = useRoute()
const path = computed(() => withoutTrailingSlash(route.path))
const { site, articleConfig } = useAppConfig()

const {
  data: page,
  error,
  status
} = useAsyncData(path.value, () => queryCollection('articles').path(path.value).first())

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
  queryCollectionItemSurroundings('articles', path.value, {
    before: 1,
    after: 1,
    fields: ['path', 'title', 'description']
  })
)
const prev = computed(() => surround.value?.[0] ?? null)
const next = computed(() => surround.value?.[1] ?? null)
</script>
