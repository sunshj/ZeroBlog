<template>
  <section class="h-full w-full flex flex-col items-center">
    <AppHeader />
    <main class="mt-15 max-w-5xl w-full flex-1">
      <slot />
    </main>
    <AppFooter />
  </section>
</template>

<script lang="ts" setup>
const route = useRoute()

onMounted(() => {
  if (!route.hash) {
    window.scrollTo(0, 0)
  }
})
</script>

<style scoped></style>
