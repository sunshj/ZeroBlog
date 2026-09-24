<template>
  <UiButton color="gray" class="!p-1" title="Toggle Color Mode" @click="toggleColorMode">
    <ClientOnly>
      <Icon :size="24" :name="icon" />
      <template #fallback>
        <span class="h-6 w-6">
          <Icon :size="24" name="lucide:loader-circle" class="animate-spin" />
        </span>
      </template>
    </ClientOnly>
  </UiButton>
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
    // 以切换后 html 上真实生效的主题判断方向，保证动画图层与 CSS 中的层级一致
    // （preference 为 system 时，其值与实际主题可能不同）
    const isDark = document.documentElement.classList.contains('dark')
    document.documentElement.animate(
      {
        clipPath: isDark ? [...clipPath].reverse() : clipPath
      },
      {
        duration: 400,
        easing: 'ease-out',
        // 动画结束后保留结束状态，否则 clip-path 会在视图过渡销毁前恢复为 none，
        // 旧主题快照会整屏重现，导致切换时闪一下
        fill: 'forwards',
        pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
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
