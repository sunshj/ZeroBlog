<template>
  <div>
    <Transition name="zoom">
      <div
        v-if="visible"
        class="fixed inset-0 z-210 h-full w-full flex-center transition-all duration-300"
        @click="handleModalClick"
      >
        <div
          class="relative z-250 max-w-3xl w-full flex flex-col animate-zoom-in animate-duration-300 rounded-lg bg-white dark:bg-dark"
          :class="props.modalClass"
          :style="props.modalStyle"
          @click.stop
        >
          <Icon
            v-if="props.showClose"
            name="lucide:x"
            :size="20"
            class="absolute right-0 top-0 m-4 cursor-pointer text-gray-500 hover:text-gray-700"
            @click="close"
          />
          <slot />
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-200 bg-black opacity-50" />
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import type { StyleValue } from 'vue'

const props = withDefaults(
  defineProps<{
    showClose?: boolean
    closeOnClickModal?: boolean
    modalClass?: string
    modalStyle?: StyleValue
  }>(),
  {
    showClose: true,
    closeOnClickModal: true
  }
)
const visible = defineModel({ default: false, required: true })

const emit = defineEmits(['close'])

function handleModalClick() {
  if (props.closeOnClickModal) {
    close()
  }
}

function close() {
  visible.value = false
  emit('close')
}

onKeyStroke('Escape', e => {
  if (visible.value) {
    e.preventDefault()
    close()
  }
})
</script>

<style scoped></style>
