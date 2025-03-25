<template>
  <Giscus
    :repo="giscus.repo"
    :repo-id="giscus.repoId"
    mapping="pathname"
    :category="giscus.category"
    :category-id="giscus.categoryId"
    reactions-enabled="1"
    emit-metadata="0"
    input-position="bottom"
    :theme="$colorMode.value"
    lang="zh-CN"
    loading="lazy"
  />
</template>

<script lang="ts" setup>
import Giscus from '@giscus/vue'
const { giscus } = useAppConfig()
</script>

<style scoped></style>
