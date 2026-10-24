<template>
  <article class="mx-auto mb-10 w-full p-4">
    <!-- 数据还没到位：整块只显示 loading，避免闪出空标题和分割线 -->
    <div v-if="props.pending" class="mt-10 flex-center p-4">
      <Icon class="animate-spin" :size="24" name="lucide:loader" />
    </div>

    <!-- 取数结束但确实没有这篇文章 -->
    <div v-else-if="!props.article" class="mt-10 flex-center p-4">
      <ProseH1>This page is empty</ProseH1>
    </div>

    <template v-else>
      <ProseH1>{{ props.article.title }}</ProseH1>

      <ArticleTags
        :article="props.article"
        :words-count="props.tagOptions?.wordsCount"
        :reading-time="props.tagOptions?.readingTime"
        class="text-dark dark:text-gray-500"
      />

      <ProseHr />

      <div class="mb-15 w-full md:flex md:justify-between">
        <div
          class="w-full flex-1 gap-5"
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

          <ArticleCopyright v-if="props.showCopyright" :title="props.article.title!" :date="props.article.date ?? ''" />

          <div v-if="props.showSurround" class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="flex justify-start">
              <ArticleNavCard
                v-if="prev"
                :to="prev.path ?? ''"
                :title="prev.title"
                :description="<string>prev.description"
                position="left"
              />
            </div>
            <div class="flex justify-end">
              <ArticleNavCard
                v-if="next"
                :to="next.path ?? ''"
                :title="next.title"
                :description="<string>next.description"
                position="right"
              />
            </div>
          </div>
        </div>

        <div v-if="tocLinks.length > 0" class="ml-4">
          <ArticleToc :links="tocLinks" class="scrollbar-hide max-h-[calc(100vh-100px)] overflow-y-auto" />
        </div>
      </div>

      <GiscusRender v-if="props.showComment && props.article.comment !== false" />
    </template>
  </article>

  <BackTop />
  <ArticleTocMenu :links="tocLinks" />
</template>

<script setup lang="ts">
import type { ArticlesCollectionItem, ContentNavigationItem, NotesCollectionItem } from '@nuxt/content'
import type { NuxtError } from '#app'

const props = withDefaults(
  defineProps<{
    article?: ArticlesCollectionItem | NotesCollectionItem | null
    /** 父级还在取数（useAsyncData 的 status === 'pending'），与"确实没有这篇文章"区分开 */
    pending?: boolean
    error?: NuxtError<unknown>
    showComment?: boolean
    showSurround?: boolean
    prev?: ContentNavigationItem | null
    next?: ContentNavigationItem | null
    showCopyright?: boolean
    tagOptions?: {
      wordsCount?: boolean
      readingTime?: boolean
    }
  }>(),
  {
    pending: false,
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
