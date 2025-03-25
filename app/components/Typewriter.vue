<template>
  <component :is="as" v-if="disableAnimation">
    {{ text }}
  </component>
  <component :is="as" v-else>
    {{ words.join('') }}
    <span class="animate-blink-caret" :class="{ hidden: words.length === props.text.length }"
      >｜</span
    >
  </component>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    text: string
    as?: string
    interval?: number
    disableAnimation?: boolean
  }>(),
  {
    as: 'h1',
    interval: 100,
    disableAnimation: false
  }
)

const emit = defineEmits(['finished'])

const words = ref<string[]>([])

useIntervalFn(() => {
  if (props.disableAnimation || words.value.length === props.text.length) {
    emit('finished')
    return
  }

  if (words.value.length < props.text.length) {
    words.value.push(props.text[words.value.length]!)
  }
}, props.interval)
</script>
