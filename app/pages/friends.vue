<template>
  <div class="flex flex-col gap-10 p-4">
    <ProseH1 class="text-amber">Friends</ProseH1>
    <div class="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
      <FriendCard v-for="friend in friends" :key="friend.name" :data="friend" />
    </div>
    <ContentRenderer :value="page">
      <template #empty>
        <div class="mt-10 flex-center p-4">
          <ProseH1 v-if="error">This page is empty</ProseH1>
          <Icon v-else class="animate-spin" :size="24" name="lucide:loader" />
        </div>
      </template>
    </ContentRenderer>
    <GiscusRender v-if="page?.comment" />
  </div>
</template>

<script lang="ts" setup>
const { site } = useAppConfig()

const { data: page, error } = useAsyncData('friends', () => queryContent('/friends').findOne())
const { data } = useAsyncData('friends-data', () => queryContent('/data/friends').findOne())
const friends = computed<Friend[]>(() => data.value?.friends ?? [])

const title = () => page.value?.title || site.title
const description = () => page.value?.description || site.description

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
</script>

<style scoped></style>
