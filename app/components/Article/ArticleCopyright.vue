<template>
  <div
    class="relative flex flex-col justify-between gap-5 overflow-hidden rounded-lg bg-light px-6 py-4 transition-all dark:bg-dark"
  >
    <div>
      <div class="text-xl text-gray-900 dark:text-gray-100">
        {{ props.title }}
      </div>
      <div class="text-gray-500">{{ permalink }}</div>
    </div>

    <div class="flex gap-3 text-gray-500">
      <div class="flex flex-col justify-between">
        <div>作者</div>
        <div class="text-dark-200 dark:text-gray-400">{{ site.author }}</div>
      </div>

      <div class="flex flex-col justify-between">
        <div>发布于</div>
        <div class="text-dark-200 dark:text-gray-400">
          {{ formatTime(props.date, 'YYYY-MM-DD HH:mm') }}
        </div>
      </div>

      <div class="flex flex-col justify-between">
        <div>许可</div>
        <NuxtLink
          title="CC BY-NC-SA 4.0"
          target="_blank"
          to="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans"
          class="h-18px flex gap-1 text-dark-200 dark:text-gray-400"
        >
          <Icon name="fa6-brands:creative-commons" />
          <Icon name="fa6-brands:creative-commons-by" />
          <Icon name="fa6-brands:creative-commons-nc" />
          <Icon name="fa6-brands:creative-commons-sa" />
        </NuxtLink>
      </div>
    </div>

    <div class="absolute right-10 top-1/2 transform -translate-y-1/2">
      <Icon name="fa6-solid:copyright" class="text-14rem text-[#50505c1f]" />
    </div>

    <CodeCopy title="复制版权信息" class="absolute right-4 top-4" :code="copyRightText" />
  </div>
</template>

<script lang="ts" setup>
const { site } = useAppConfig()

const props = defineProps<{
  title: string
  date: string
}>()

const url = useRequestURL()

const permalink = computed(() => url.origin + url.pathname)

const copyRightText = computed(() => {
  return `原文作者：${site.author}\n原文链接：${permalink.value}\n版权声明：本博客所有文章除特别声明外，均采用 CC BY-NC-SA 4.0 许可协议。转载请注明出处！`
})
</script>
