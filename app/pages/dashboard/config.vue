<template>
  <DashboardContentPageEditor :files="files" />
</template>

<script lang="ts" setup>
definePageMeta({
  menu: {
    label: '配置',
    order: 5,
    icon: 'lucide:settings'
  },
  layout: 'dashboard'
})

useHead({
  title: 'Dashboard - 配置'
})

const files = [{ path: 'app/app.config.ts', lang: 'typescript' }]
</script>
