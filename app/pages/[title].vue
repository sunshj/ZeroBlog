<template>
  <div class="flex flex-col gap-10 p-4">
    <ProseH1 class="text-amber">{{ titleCase(route.params.title) }}</ProseH1>
    <ContentRenderer
      v-if="page"
      :value="page"
      :class="{
        'text-center': page.center
      }"
    >
      <template #empty>
        <div class="mt-10 flex-center p-4">
          <ProseH1 v-if="error">This page is empty</ProseH1>
          <Icon v-else class="animate-spin" :size="24" name="lucide:loader" />
        </div>
      </template>
    </ContentRenderer>
    <ProseH1 v-else class="mt-10 flex-center p-4">This page is empty</ProseH1>
    <GiscusRender v-if="page?.comment" />
  </div>
</template>

<script lang="ts" setup>
import { titleCase } from 'scule'
import { withLeadingSlash } from 'ufo'

const { site } = useAppConfig()
const route = useRoute()

const { data: page, error } = await useAsyncData(
  () => route.params.title,
  () => queryCollection('pages').path(withLeadingSlash(route.params.title)).first()
)

if (!page.value)
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found'
  })

const title = () => page.value?.title || site.title
const description = () => page.value?.description || site.description

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
</script>

<style scoped></style>
