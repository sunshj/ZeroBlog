<template>
  <Giscus
    :repo="$config.public.giscusRepo as any"
    :repo-id="$config.public.giscusRepoId"
    mapping="pathname"
    :category="$config.public.giscusCategory"
    :category-id="$config.public.giscusCategoryId"
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
</script>

<style scoped></style>
