<template>
  <footer
    class="h-30 w-full flex justify-center border-t border-t-gray-200 border-t-solid p-10 lt-sm:gap-3 dark:border-t-gray-800"
  >
    <div class="max-w-5xl w-5xl flex justify-between gap-4 lt-sm:flex-col lt-sm:items-center">
      <div class="flex flex-col gap-4">
        <div>&copy; {{ footer.since }}-{{ new Date().getFullYear() }} {{ site.title }}</div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex justify-end gap-3 lt-sm:justify-center">
          <NuxtLink
            v-for="{ icon, link, name } in footer.socialLinks"
            :key="link"
            :to="link"
            target="_blank"
            :aria-label="name"
          >
            <Icon :name="icon" :size="20" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const { site, footer } = useAppConfig()
</script>

<style scoped></style>
