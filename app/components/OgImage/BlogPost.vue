<template>
  <div
    class="h-full w-full flex items-start justify-start"
    style="
      background-image: linear-gradient(to right, #24243e, #302b63, #0f0c29);
      font-family: 'AlibabaPuHui' sans-serif;
    "
  >
    <div class="h-full flex items-start justify-start">
      <div class="h-full w-full flex flex-col justify-between p-20">
        <img src="/images/avatar.png" style="height: 50px; width: 50px" />
        <h1 class="m-0 mb-30px text-75px text-white font-bold">
          {{ title }}
        </h1>
        <p class="text-left text-35px text-white font-bold">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Title',
    description: 'description'
  }
)
</script>
