<template>
  <div
    class="fixed z-99 h-60px w-full flex items-center justify-around px-2 transition-all"
    :class="{
      'shadow-sm bg-opacity-50 backdrop-blur-xl': showShadow && !isOpen,
      'bg-light dark:bg-dark  bg-opacity-100': isOpen
    }"
  >
    <div class="mr-4 h-45px w-45px flex cursor-pointer items-center justify-center rounded-3">
      <NuxtImg
        :src="site.avatar"
        :alt="site.author"
        format="webp"
        class="h-full rounded-3 object-cover shadow-2xl"
        :width="60"
        :height="60"
        @click="handleFaviconClick"
      />
    </div>
    <div class="max-w-5xl w-full flex-center lg:w-4/5">
      <div class="w-full flex items-center justify-around">
        <div name="title" class="flex flex-1">
          <Transition name="slide">
            <div
              v-if="!isFixed"
              class="max-w-50 overflow-hidden truncate text-ellipsis whitespace-nowrap text-xl sm:max-w-unset"
            >
              {{ route.meta?.title }}
            </div>
          </Transition>
        </div>
        <div
          class="z-100 hidden items-center justify-center sm:flex"
          :class="{ fixed: isFixed, relative: !isFixed }"
        >
          <header
            ref="headerRef"
            class="mx-auto flex-center"
            :style="{
              ...styles,
              position: isFixed ? 'relative' : 'fixed'
            }"
          >
            <div
              class="h-40px w-fit flex items-center gap-4 border rounded-full px-4 transition-all"
              :class="{
                'mt-52px dark:border-[#222] border-[#eee] bg-light dark:bg-dark shadow-sm backdrop-blur-2xl':
                  !isFixed,
                'dark:border-[#222] border-[#eee]  bg-light dark:bg-dark shadow-sm backdrop-blur-2xl dark:bg-opacity-50 bg-opacity-50':
                  !showShadow,
                'border-transparent': isTransparent
              }"
            >
              <NuxtLink
                v-for="link in header.navLinks"
                :key="link.to"
                class="flex gap-4 font-medium decoration-none transition-all hover:text-amber hover:decoration-none"
                :class="{ 'text-amber': link.to === route.path }"
                :to="link.to"
                prefetch
              >
                {{ link.name }}
              </NuxtLink>
            </div>
          </header>
        </div>
        <div name="rate" class="hidden flex-1 justify-end sm:flex">
          <Transition name="slide">
            <div v-if="!isFixed">{{ readProgress }} <span class="text-amber">%</span></div>
          </Transition>
        </div>
        <div class="flex items-center gap-3 sm:hidden" name="openMenu">
          <SearchButton v-show="!isOpen" @click="openSearch()" />
          <Icon v-if="isOpen" name="lucide:x" :size="30" @click="toggleOpen()" />
          <Icon v-else name="lucide:menu" :size="30" @click="toggleOpen()" />
        </div>
      </div>
    </div>

    <div class="ml-4 hidden items-center gap-3 sm:flex">
      <SearchButton @click="openSearch()" />
      <ColorModeToggle />
    </div>
  </div>

  <div
    name="header"
    class="fixed top-60px z-110 h-0 w-full flex justify-end bg-light transition-all sm:hidden dark:bg-dark"
    :class="{ 'h-full': isOpen }"
  >
    <Transition name="slide-fade">
      <div v-if="isOpen" class="flex flex-col items-end">
        <NuxtLink
          v-for="link in header.navLinks"
          :key="link.to"
          :to="link.to"
          class="my-1 ml-1 mr-2 px-3 py-2 text-2xl font-500 lh-12 transition-all duration-150 hover:cursor-pointer hover:text-amber"
          :class="{ 'text-amber': link.to === route.path }"
          prefetch
          @click="toggleOpen()"
        >
          {{ link.name }}
        </NuxtLink>

        <div
          class="my-1 ml-1 mr-2 px-3 py-2 text-2xl font-500 lh-12 transition-all duration-150 hover:cursor-pointer hover:text-amber"
        >
          <ColorModeToggle />
        </div>
      </div>
    </Transition>
  </div>

  <SearchPanel v-model="searchVisible" />
</template>

<script setup lang="ts">
import { useFixedHeader } from 'vue-use-fixed-header'

const route = useRoute()
const { header, site } = useAppConfig()
const { y } = useWindowScroll()
const showTitleY = 80

const headerRef = ref(null)

const isArticlePage = computed(() => route.meta.isArticlePage)
const isFixed = computed(() => !isArticlePage.value || y.value < showTitleY)
const showShadow = computed(() => !isFixed.value || y.value > showTitleY)
const isTransparent = computed(() => (isArticlePage.value ? false : y.value > showTitleY))

const { styles } = useFixedHeader(headerRef, {
  watch: isFixed
})

const readProgress = ref(0)
const { height } = useWindowSize()

watchEffect(() => {
  if (import.meta.client) {
    const calc = (y.value - showTitleY) / (document.body.scrollHeight - height.value - showTitleY)
    if (calc < 0) {
      readProgress.value = 0
    } else if (calc >= 1) {
      readProgress.value = 100
    } else {
      readProgress.value = Math.round(calc * 100)
    }
  }
})

const isOpen = useScrollLock(window)
const toggleOpen = useToggle(isOpen)

function handleFaviconClick() {
  navigateTo('/')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const searchVisible = ref(false)
function openSearch() {
  searchVisible.value = true
}

watch(
  () => route.path,
  () => {
    searchVisible.value = false
  }
)

const { Meta_K, Ctrl_K } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
    }
  }
})

watch([Meta_K, Ctrl_K], ([metaK, ctrlK]) => {
  if (metaK || ctrlK) {
    openSearch()
  }
})
</script>
