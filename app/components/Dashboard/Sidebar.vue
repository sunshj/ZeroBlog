<template>
  <aside
    class="h-full flex flex-col justify-between border-r border-r-gray-2 border-r-solid bg-gray-50 px-2 py-4 transition-all dark:border-r-gray-7 dark:bg-dark-9"
    :class="collapsed ? 'w-16' : 'w-48'"
  >
    <div class="flex flex-col gap-4">
      <div
        class="w-full flex items-center py-2"
        :class="collapsed ? 'justify-center' : 'justify-between pl-4'"
      >
        <ColorModeToggle />
        <UiButton
          v-if="!collapsed"
          title="Toggle Sidebar"
          icon="lucide:panel-left-close"
          :icon-size="16"
          color="ghost"
          class="h-8 w-8"
          @click="toggleCollapse(true)"
        />
      </div>

      <nav class="flex flex-col gap-2">
        <NuxtLink
          v-for="menu in menus"
          :key="menu.path"
          :to="menu.path"
          active-class="bg-gray-800 !text-white !hover:bg-gray-800"
          class="flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-all hover:bg-gray-2 dark:text-gray-4 !no-underline dark:hover:bg-gray-800"
          :class="{
            'justify-center': collapsed
          }"
        >
          <Icon v-if="menu.meta.menu?.icon" :name="menu.meta.menu.icon" :size="18" />
          <div v-if="!collapsed">{{ menu.meta.menu?.label }}</div>
        </NuxtLink>
      </nav>
    </div>

    <div>
      <div v-if="collapsed" class="w-full flex-center">
        <UiButton
          icon="lucide:panel-left-open"
          title="Toggle Sidebar"
          :icon-size="16"
          color="ghost"
          class="h-8 w-8 flex-center"
          @click="toggleCollapse(false)"
        />
      </div>

      <div v-if="loggedIn" class="group relative">
        <div
          class="flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <img :src="user?.avatar" class="h-8 w-8 rounded-full" />
          <div v-if="!collapsed" class="flex flex-col">
            <div class="text-sm">{{ user?.name }}</div>
            <div class="text-xs">{{ user?.email }}</div>
          </div>
        </div>

        <div
          class="absolute bottom-0 left-full z-50 mb-0 hidden w-44 border rounded-lg bg-white shadow-lg transition-all group-hover:block dark:bg-dark"
        >
          <ul class="p-2">
            <li
              class="flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-dark-700"
              @click="signOut"
            >
              <Icon name="lucide:log-out" />
              退出登录
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { breakpointsTailwind } from '@vueuse/core'

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

const collapsed = ref(false)
const toggleCollapse = useToggle(collapsed)

const { smaller } = useBreakpoints(breakpointsTailwind)
const smallerThanMd = smaller('md')

watch(smallerThanMd, () => {
  toggleCollapse(smallerThanMd.value)
})
</script>

<style scoped></style>
