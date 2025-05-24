<template>
  <div>
    <div class="flex flex-col gap-10 p-4">
      <ProseH1 class="text-amber">Articles</ProseH1>
      <div v-if="articles?.length">
        <div v-for="article in articles" :key="article._path" class="mb-4">
          <ArticleCard :article="article" show-sticky />
        </div>

        <Pagination
          :page-count="pageCount"
          :current-page="currentPage"
          class="flex-center"
          @change="onPageChange"
        />
      </div>
      <div v-else class="flex-center">
        <div>No articles found.</div>
      </div>
    </div>
    <BackTop />
  </div>
</template>

<script lang="ts" setup>
const { site } = useAppConfig()

useSeoMeta({
  title: `Articles | ${site.title}`,
  description: site.description
})

const pageSize = 6
const currentPage = ref(1)

const { data: total } = useAsyncData('total-articles', () =>
  queryContent('/articles').where({ hidden: false }).count()
)

const { data: articles } = useAsyncData(
  `articles-page-${currentPage.value}`,
  () =>
    queryContent('/articles')
      .only(['_path', 'title', 'description', 'date', 'sticky', 'tags'])
      .where({ hidden: false })
      .sort({ date: -1, sticky: -1 })
      .skip((currentPage.value - 1) * pageSize)
      .limit(pageSize)
      .find(),
  {
    watch: [currentPage]
  }
)

const pageCount = computed(() => Math.ceil((total.value ?? 0) / pageSize))

function onPageChange(page: number) {
  currentPage.value = page
}
</script>
