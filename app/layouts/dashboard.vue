<template>
  <section class="h-full max-h-screen w-full flex overflow-hidden">
    <DashboardSidebar class="w-48" />
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </section>
</template>

<script lang="ts" setup></script>

<style scoped></style>
