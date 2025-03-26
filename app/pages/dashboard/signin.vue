<template>
  <div class="h-screen flex-center flex-col">
    <div
      class="h-fit w-80 flex-center flex-col gap-4 border border-gray-200 rounded-xl border-solid p-6 shadow dark:border-gray-700"
    >
      <div class="flex-center flex-col gap-1">
        <div class="text-xl font-bold">Welcome back</div>
        <div class="text-sm text-gray-500">Continue with your Github account</div>
      </div>
      <button
        class="w-full flex-center cursor-pointer gap-2 border border-gray-300 rounded-md border-solid bg-black p-2 text-white transition-all ease-in-out dark:border-gray-600"
        @click="openInPopup('/auth/github')"
      >
        <Icon name="fa6-brands:github" />
        <div class="font-bold">Login with Github</div>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'empty'
})

useServerHead({
  title: 'Dashboard - 登录'
})

const { openInPopup, loggedIn } = useUserSession()

watch(loggedIn, logged => {
  if (logged) navigateTo('/dashboard')
})
</script>

<style scoped></style>
