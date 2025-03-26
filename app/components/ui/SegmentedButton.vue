<template>
  <div
    class="h-9 w-full inline-flex items-baseline justify-start rounded-lg bg-gray-100 p-1 sm:w-auto dark:bg-gray-8"
  >
    <button
      v-for="(option, index) in options"
      :key="index"
      type="button"
      class="group h-7 min-w-[32px] w-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none px-3 py-2 align-middle text-xs font-semibold transition-all duration-300 ease-in-out sm:w-auto disabled:cursor-not-allowed"
      :class="{
        'bg-white  dark:bg-black dark:text-gray-4  rounded-md shadow text-slate-950 stroke-blue-700 drop-shadow':
          activeIndex === index,
        'bg-transparent !text-slate-600 stroke-blue-700 hover:stroke-blue-950 hover:text-blue-950':
          activeIndex !== index
      }"
      @click="setActive(index)"
    >
      <div v-if="option.icon" class="flex items-center">
        <slot name="icon">
          <Icon :size="16" :name="option.icon" />
        </slot>
      </div>
      <div v-if="option.label">{{ option.label }}</div>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label?: string
  value: string | number | boolean
  icon?: string
}

const { options } = defineProps<{
  options: Option[]
}>()

const emit = defineEmits<{
  change: [option: Option]
}>()

const activeIndex = ref(0)

function setActive(index: number) {
  activeIndex.value = index
  emit('change', options[index]!)
}
</script>
