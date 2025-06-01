<template>
  <section class="h-full w-full flex flex-col items-center">
    <AppHeader />
    <main class="w-full flex-1">
      <slot />
    </main>
    <AppFooter />
  </section>
</template>

<script lang="ts" setup></script>

<style scoped></style>
