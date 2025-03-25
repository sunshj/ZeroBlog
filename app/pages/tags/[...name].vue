<template>
  <div class="p-4">
    <ProseH1>{{ tagName }}</ProseH1>

    <div class="flex flex-wrap gap-2">
      <div v-for="[tag, { count, href }] of tags" :key="tag">
        <NuxtLink
          prefetch
          prefetch-on="interaction"
          :to="href"
          class="decoration-none hover:decoration-none"
        >
          <div
            class="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 dark:bg-dark"
            :class="{
              'ring-2 ring-inset ring-amber': isSamePath(href, route.path)
            }"
          >
            <span>{{ tag }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ count }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div v-for="[date, articles] of groupByYear" :key="date">
      <ProseH2> {{ date }}</ProseH2>
      <div v-for="article in articles" :key="article._path" class="mb-4">
        <ArticleCard :article="article" />
      </div>
    </div>

    <BackTop />
  </div>
</template>

<script lang="ts" setup>
import { isSamePath } from 'ufo'

const route = useRoute('tags-name')
const tagName = computed(() => route.params.name?.at(0) ?? 'Tags')

const { site } = useAppConfig()

const title = () => tagName.value
const description = site.description

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

const { data } = useAsyncData(route.path, () =>
  queryContent('/articles')
    .only(['_path', 'title', 'description', 'date', 'sticky', 'tags'])
    .where({ tags: { $contains: route.params.name || [] }, hidden: false })
    .sort({ date: -1 })
    .find()
)

const groupByYear = computed(() => {
  if (!data.value) return []
  const group = groupBy(data.value, i => formatTime(i.date, 'YYYY-MM'))
  return Object.entries(group).sort((a, b) => +b[0] - +a[0])
})

const { data: tagsData } = await useAsyncData('tags-data', () =>
  queryContent('/articles')
    .only(['tags'])
    .where({ tags: { $exists: true }, hidden: false })
    .find()
)

const tags = computed(() => {
  return tagsData.value?.reduce(
    (acc, article) => {
      acc.set('All', {
        count: tagsData.value?.flat().length || 0,
        href: '/tags'
      })
      article.tags.forEach((tag: string) => {
        acc.set(tag, {
          count: (acc.get(tag)?.count || 0) + 1,
          href: `/tags/${tag}`
        })
      })
      return acc
    },
    new Map<
      string,
      {
        count: number
        href: string
      }
    >()
  )
})
</script>

<style scoped></style>
