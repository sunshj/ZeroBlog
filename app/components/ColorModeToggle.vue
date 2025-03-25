<template>
  <button class="bg-white icon-btn dark:bg-black" @click="toggleColorMode">
    <ClientOnly>
      <Icon :size="24" :name="icon" />
      <template #fallback>
        <span class="h-6 w-6">
          <Icon :size="24" name="lucide:loader-circle" class="animate-spin" />
        </span>
      </template>
    </ClientOnly>
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const icon = computed(() => {
  return colorMode.preference === 'dark'
    ? 'lucide:moon'
    : colorMode.preference === 'light'
      ? 'lucide:sun'
      : 'lucide:contrast'
})

const { next } = useCycleList(['system', 'light', 'dark'], {
  initialValue: colorMode.preference
})

function toggle() {
  colorMode.preference = next()
}

const isDark = computed(() => colorMode.preference === 'dark')

function toggleColorMode(event: MouseEvent) {
  const isAppearanceTransition =
    typeof document.startViewTransition !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition) {
    toggle()
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const transition = document.startViewTransition(async () => {
    toggle()
    await nextTick()
  })
  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath
      },
      {
        duration: 400,
        easing: 'ease-out',
        pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    )
  })
}
</script>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-old(root) {
  z-index: 1;
}
::view-transition-new(root) {
  z-index: 9999;
}
.dark::view-transition-old(root) {
  z-index: 9999;
}
.dark::view-transition-new(root) {
  z-index: 1;
}
</style>
