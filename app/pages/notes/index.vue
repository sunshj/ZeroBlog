<template>
  <div>
    <div class="flex flex-col p-4">
      <ProseH1 class="text-amber">Notes</ProseH1>
      <div v-for="[date, notes] of groupByYear" :key="date">
        <ProseH2> {{ date }}</ProseH2>
        <div v-for="note in notes" :key="note._path" class="mb-4">
          <ArticleCard :article="note" />
        </div>
      </div>
    </div>
    <BackTop />
  </div>
</template>

<script lang="ts" setup>
const { site } = useAppConfig()

const title = '小记'
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

const { data } = await useAsyncData('notes', () =>
  queryContent('/notes')
    .only(['_path', 'title', 'date'])
    .where({ hidden: false })
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
