<template>
  <article class="mx-auto mb-10 w-full p-4">
    <ProseH1>{{ props.article?.title }}</ProseH1>

    <ArticleTags
      v-if="props.article"
      :article="props.article"
      :date-format="props.tagOptions?.dateFormat"
      :words-count="props.tagOptions?.wordsCount"
      :reading-time="props.tagOptions?.readingTime"
      class="text-dark dark:text-gray-500"
    />

    <ProseHr />

    <div class="mb-15 w-full md:flex md:justify-between">
      <div
        class="flex-1 gap-5"
        :class="{
          'flex flex-col': tocLinks.length === 0,
          'grid grid-cols-1': tocLinks.length > 0
        }"
      >
        <ContentRenderer :value="props.article">
          <template #empty>
            <div class="mt-10 flex-center p-4">
              <ProseH1 v-if="props.error">This page is empty</ProseH1>
              <Icon v-else class="animate-spin" :size="24" name="lucide:loader" />
            </div>
          </template>
        </ContentRenderer>

        <ProseHr v-if="props.showCopyright || props.showComment" />

        <ArticleCopyright
          v-if="props.showCopyright && props.article"
          :title="props.article.title!"
          :date="props.article.date"
        />

        <div v-if="props.showSurround" class="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div class="flex justify-start">
            <ArticleNavCard
              v-if="prev"
              :to="prev._path"
              :title="prev?.title"
              :description="prev.description"
              position="left"
            />
          </div>
          <div class="flex justify-end">
            <ArticleNavCard
              v-if="next"
              :to="next._path"
              :title="next.title"
              :description="next.description"
              position="right"
            />
          </div>
        </div>
      </div>

      <div v-if="tocLinks.length > 0" class="ml-4">
        <ArticleToc
          :links="tocLinks"
          class="scrollbar-hide max-h-[calc(100vh-100px)] overflow-y-auto"
        />
      </div>
    </div>

    <GiscusRender v-if="props.showComment && props.article?.comment !== false" />
  </article>

  <BackTop />
  <ArticleTocMenu :links="tocLinks" />
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'
import type { NuxtError } from '#app'

const props = withDefaults(
  defineProps<{
    article?: Partial<ParsedContent>
    error?: NuxtError<unknown>
    showComment?: boolean
    showSurround?: boolean
    prev?: Partial<ParsedContent>
    next?: Partial<ParsedContent>
    showCopyright?: boolean
    tagOptions?: {
      dateFormat?: string
      wordsCount: boolean
      readingTime: boolean
    }
  }>(),
  {
    showComment: false,
    showSurround: false,
    showCopyright: false,
    tagOptions: () => ({
      readingTime: true,
      wordsCount: true
    })
  }
)

const tocLinks = computed(() => flattenTree(props.article?.body?.toc?.links ?? []))
</script>

<style>
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
