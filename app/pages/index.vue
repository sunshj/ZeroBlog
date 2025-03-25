<template>
  <div>
    <div
      name="first-screen"
      class="h-screen w-full flex-center animate-fade-in-down-mini bg-cover bg-center"
      :style="`background-image: url(${firstScreen.backgroundImage})`"
    >
      <Typewriter
        :text="firstScreen.content"
        as="div"
        class="text-8 text-gray-900 font-bold leading-14 dark:text-gray-200"
        :disable-animation="firstScreen.disableFirstScreenTypingAnimation"
      />
    </div>

    <div class="mx-auto mt-10 max-w-5xl flex flex-col gap-10 p-4">
      <div>
        <div class="my-4 text-2xl text-amber font-semibold">Recent Articles</div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
          <ArticleCard v-for="article in articles" :key="article._path" :article="article" />
        </div>
        <div
          class="my-4 w-fit flex-center cursor-pointer px-4 font-semibold uno-card hover:ring-1"
          @click="navigateTo('/articles')"
        >
          See More
          <Icon name="lucide:arrow-right" class="text-amber" :size="18" />
        </div>
      </div>

      <div>
        <div class="my-4 text-2xl text-amber font-semibold">Recent Notes</div>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
          <ArticleCard v-for="note in notes" :key="note._path" :article="note" />
        </div>
        <div
          class="my-4 w-fit flex-center cursor-pointer px-4 font-semibold uno-card hover:ring-1"
          @click="navigateTo('/notes')"
        >
          See More
          <Icon name="lucide:arrow-right" class="text-amber" :size="18" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'

definePageMeta({
  layout: 'home'
})

const { site, firstScreen } = useAppConfig()

const title = site.title
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

const { data: articles } = useAsyncData('recent-articles', () =>
  queryContent('/articles')
    .only(['_path', 'title', 'description', 'date', 'sticky', 'tags'])
    .where({ hidden: false })
    .sort({ date: -1 })
    .limit(6)
    .find()
)

const { data: notes } = useAsyncData('recent-notes', () =>
  queryContent('/notes')
    .only(['_path', 'title', 'date'])
    .where({ hidden: false })
    .sort({ date: -1 })
    .limit(6)
    .find()
)
</script>
