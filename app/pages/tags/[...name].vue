<template>
  <div>
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
definePageMeta({
  layout: 'tags'
})

const route = useRoute('tags-name')

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
</script>

<style scoped></style>
