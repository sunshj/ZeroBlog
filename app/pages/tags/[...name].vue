<template>
  <div>
    <div v-for="[date, articles] of groupByYear" :key="date">
      <ProseH2> {{ date }}</ProseH2>
      <div v-for="article in articles" :key="article.path" class="mb-4">
        <ArticleCard :article="article" />
      </div>
    </div>

    <BackTop />
  </div>
</template>

<script lang="ts" setup>
import { dateFormat } from '#shared/datetime'

definePageMeta({
  layout: 'tags'
})

const route = useRoute('tags-name')

const { data } = useAsyncData(route.path, () =>
  queryCollection('articles')
    .select('path', 'title', 'description', 'date', 'sticky', 'tags')
    .where('tags', 'LIKE', route.params.name ? `%"${route.params.name.join('')}"%` : '%%')
    .where('hidden', '=', false)
    .order('date', 'DESC')
    .all()
)

const groupByYear = computed(() => {
  if (!data.value) return []
  const group = groupBy(data.value, i => dateFormat(i.date, 'YYYY-MM'))
  return Object.entries(group).sort((a, b) => +b[0] - +a[0])
})
</script>

<style scoped></style>
