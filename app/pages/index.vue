<template>
  <div>
    <div
      name="first-screen"
      class="h-screen w-full flex-center animate-fade-in-down-mini bg-cover bg-center"
      style="background-image: url('/images/bg.svg')"
    >
      <Typewriter
        :text="firstScreen.content"
        as="div"
        class="text-8 text-gray-900 font-bold leading-14 dark:text-gray-200"
        :disable-animation="firstScreen.disableTypingAnimation"
      />
    </div>

    <div class="mx-auto mt-10 max-w-5xl flex flex-col gap-10 p-4">
      <div>
        <div class="my-4 text-2xl text-amber font-semibold">Recent Articles</div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
          <ArticleCard v-for="article in articles" :key="article.path" :article="article" />
        </div>
        <div
          class="my-4 uno-card w-fit flex-center cursor-pointer px-4 font-semibold hover:ring-1"
          @click="navigateTo('/articles')"
        >
          See More
          <Icon name="lucide:arrow-right" class="text-amber" :size="18" />
        </div>
      </div>

      <div>
        <div class="my-4 text-2xl text-amber font-semibold">Recent Notes</div>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
          <ArticleCard v-for="note in notes" :key="note.path" :article="note" />
        </div>
        <div
          class="my-4 uno-card w-fit flex-center cursor-pointer px-4 font-semibold hover:ring-1"
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

defineOgImage('BlogPost.takumi', {
  title,
  description
})

const { data: articles } = useAsyncData('recent-articles', () =>
  queryCollection('articles')
    .select('path', 'title', 'description', 'date', 'sticky', 'tags')
    .where('hidden', '=', false)
    .order('date', 'DESC')
    .limit(6)
    .all()
)

const { data: notes } = useAsyncData('recent-notes', () =>
  queryCollection('notes')
    .select('path', 'title', 'date')
    .where('hidden', '=', false)
    .order('date', 'DESC')
    .limit(6)
    .all()
)
</script>
