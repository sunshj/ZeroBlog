<template>
  <NuxtLayout name="default">
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

      <slot />

      <BackTop />
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { isSamePath } from 'ufo'

const route = useRoute('tags-name')
const tagName = computed(() => route.params.name?.at(0) ?? 'Tags')

const { site } = useAppConfig()

const title = () => (tagName.value === 'Tags' ? 'Tags' : `Tag: ${tagName.value}`)
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

const { data } = await useAsyncData('tags-data', () =>
  queryContent('/articles')
    .only(['tags'])
    .where({ tags: { $exists: true }, hidden: false })
    .find()
)

interface TagValue {
  count: number
  href: string
}

const tags = computed(() => {
  return data.value?.reduce((acc, article) => {
    acc.set('All', {
      count: data.value?.flat().length || 0,
      href: '/tags'
    })
    article.tags.forEach((tag: string) => {
      acc.set(tag, {
        count: (acc.get(tag)?.count || 0) + 1,
        href: `/tags/${tag}`
      })
    })
    return acc
  }, new Map<string, TagValue>())
})
</script>

<style scoped></style>
