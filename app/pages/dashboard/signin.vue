<template>
  <div class="relative h-screen flex-center overflow-hidden bg-gray-50 dark:bg-dark-9">
    <div class="signin-bg pointer-events-none absolute inset-0" aria-hidden="true" />

    <div class="absolute top-4 right-4">
      <ColorModeToggle />
    </div>

    <div
      class="relative w-96 max-w-[calc(100vw-2rem)] flex flex-col gap-6 animate-fade-in-down-mini border border-gray-200 rounded-2xl border-solid bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-dark"
    >
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="h-12 w-12 flex-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
          <Icon name="lucide:pen-line" :size="22" />
        </div>
        <div class="text-xs font-medium tracking-widest text-gray-400 uppercase dark:text-gray-500">
          {{ site.title }}
        </div>
        <h1 class="text-2xl font-bold">欢迎回来</h1>
        <p class="text-sm text-gray-500">使用 GitHub 账号登录后台</p>
      </div>

      <UiButton
        icon="fa6-brands:github"
        :loading="pending"
        class="w-full font-medium hover:!bg-gray-800 active:scale-98 dark:hover:!bg-gray-100"
        @click="signIn"
      >
        使用 GitHub 登录
      </UiButton>

      <div class="flex flex-col gap-3 text-center">
        <div class="h-px w-full bg-gray-100 dark:bg-gray-700" />
        <NuxtLink
          to="/"
          class="text-sm text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          ← 返回首页
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false
})

useHead({
  title: 'Dashboard - 登录'
})

const { openInPopup, loggedIn } = useUserSession()
const site = useAppConfig().site

const pending = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function signIn() {
  if (pending.value) return
  pending.value = true

  openInPopup('/auth/github')

  timer = setTimeout(() => {
    pending.value = false
  }, 15_000)
}

watch(loggedIn, logged => {
  if (logged) navigateTo('/dashboard')
})

onUnmounted(() => clearTimeout(timer))
</script>

<style scoped>
.signin-bg {
  background:
    radial-gradient(600px 320px at 50% -10%, rgb(251 191 36 / 0.18), transparent 70%),
    radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.08) 1px, transparent 0);
  background-size:
    auto,
    24px 24px;
}
:global(.dark) .signin-bg {
  background:
    radial-gradient(600px 320px at 50% -10%, rgb(251 191 36 / 0.12), transparent 70%),
    radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.06) 1px, transparent 0);
  background-size:
    auto,
    24px 24px;
}
</style>
