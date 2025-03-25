<template>
  <aside
    class="h-full flex flex-col justify-between border-r border-r-gray-2 border-r-solid bg-gray-50 px-3 py-4"
  >
    <div class="flex flex-col gap-4">
      <div class="w-full flex-center py-2">
        <h1 class="text-2xl text-gray-800 font-bold dark:text-white">ZeroDBlog</h1>
      </div>

      <nav class="flex flex-col gap-2">
        <NuxtLink
          v-for="menu in menus"
          :key="menu.path"
          :to="menu.path"
          active-class="bg-gray-800 !text-white !hover:bg-gray-800"
          class="flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-all hover:bg-gray-2 !no-underline"
        >
          <Icon v-if="menu.meta.menu?.icon" :name="menu.meta.menu.icon" />
          {{ menu.meta.menu?.label }}
        </NuxtLink>
      </nav>
    </div>

    <div v-if="loggedIn" class="group relative">
      <div class="flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-gray-100">
        <img :src="user?.avatar" class="h-8 w-8 rounded-full" />
        <div class="flex flex-col">
          <div class="text-sm">{{ user?.name }}</div>
          <div class="text-xs">{{ user?.email }}</div>
        </div>
      </div>

      <div
        class="absolute bottom-full mb-0 hidden w-full border rounded-lg bg-white shadow-lg group-hover:block"
      >
        <ul class="p-2">
          <li
            class="flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
            @click="signOut"
          >
            <Icon name="lucide:log-out" />
            退出登录
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
const router = useRouter()

const { user, clear, fetch, loggedIn } = useUserSession()

const menus = computed(() =>
  router
    .getRoutes()
    .filter(r => r.meta.layout === 'dashboard' && r.meta.menu)
    .sort((a, b) => (a.meta?.menu?.order ?? 0) - (b.meta.menu?.order ?? 0))
)

async function signOut() {
  await clear()
  await fetch()
  navigateTo('/')
}
</script>

<style scoped></style>
