<template>
  <div class="h-full flex-center flex-col gap-4xl">
    <div class="text-5xl">404 Not Found</div>
    <button
      class="cursor-pointer border-2 border-gray-2 rounded-lg border-solid bg-white px-4 py-2 dark:border-gray-600 hover:border-amber hover:border-solid dark:bg-dark"
      @click="$router.push('/')"
    >
      Back Home
    </button>
  </div>
</template>

<script lang="ts" setup></script>
