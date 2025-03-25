<template>
  <Transition name="drawer-slide">
    <div v-if="visible" class="fixed inset-0 z-500 bg-black/40" @click="visible = false">
      <div
        class="fixed bottom-0 z-550 w-full flex flex-col rounded-t-10px bg-white outline-none transition-transform transition-ease-in dark:bg-dark-800"
        @click.stop
      >
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const visible = defineModel<boolean>({ required: true })

const isLocked = useScrollLock(window)

watchEffect(() => {
  isLocked.value = visible.value
})
</script>
