<template>
  <div>
    <div class="flex flex-col gap-10 p-4">
      <ProseH1 class="text-amber">Articles</ProseH1>
      <div v-if="articles?.length">
        <div v-for="article in articles" :key="article.path" class="mb-4">
          <ArticleCard :article="article" show-sticky />
        </div>

        <Pagination :page-count="pageCount" :current-page="currentPage" class="flex-center" @change="onPageChange" />
      </div>
      <div v-else class="flex-center">
        <div>No articles found.</div>
      </div>
    </div>
    <BackTop />
  </div>
</template>

<script lang="ts" setup>
const { site, pagination } = useAppConfig()

useSeoMeta({
  title: `Articles | ${site.title}`,
  description: site.description
})

const route = useRoute('articles-page-num')
const pageSize = pagination.pageSize
const currentPage = +route.params.num

const { data: total } = useAsyncData('total-articles', () =>
  queryCollection('articles').where('hidden', '=', false).count()
)

const { data: articles } = useAsyncData(`articles-page-${currentPage}`, () =>
  queryCollection('articles')
    .select('path', 'title', 'description', 'date', 'sticky', 'tags')
    .where('hidden', '=', false)
    .order('date', 'DESC')
    .order('sticky', 'DESC')
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize)
    .all()
)

const pageCount = computed(() => Math.ceil((total.value ?? 0) / pageSize))

function onPageChange(page: number) {
  navigateTo(`/articles/page/${page}`)
}
</script>
