<template>
  <Splitpanes class="dashboard-split h-full w-full" :horizontal="isStacked" @resized="onResized">
    <Pane :size="firstSize" :min-size="min" class="min-h-0 min-w-0">
      <slot name="first" />
    </Pane>

    <Pane v-if="showSecond" :size="secondSize" :min-size="min" class="min-h-0 min-w-0">
      <slot name="second" />
    </Pane>
  </Splitpanes>
</template>

<script lang="ts" setup>
import { Pane, Splitpanes, type SplitpanesResizedPayload } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const props = withDefaults(
  defineProps<{
    /** horizontal 左右分栏，vertical 上下分栏 */
    direction?: 'horizontal' | 'vertical'
    /** 第一块面板的初始百分比 */
    initial?: number
    /** 单侧最小百分比 */
    min?: number
    /** 传入后会把比例记到 localStorage */
    storageKey?: string
    showSecond?: boolean
  }>(),
  {
    direction: 'horizontal',
    initial: 50,
    min: 15,
    showSecond: true
  }
)

const isStacked = computed(() => props.direction === 'vertical')

function readStored() {
  if (!import.meta.client || !props.storageKey) return null

  const saved = Number(localStorage.getItem(props.storageKey))
  return saved >= props.min && saved <= 100 - props.min ? saved : null
}

const firstSize = ref(props.showSecond ? (readStored() ?? props.initial) : 100)
const secondSize = computed(() => 100 - firstSize.value)

function onResized(payload: SplitpanesResizedPayload) {
  const size = payload.panes?.[0]?.size
  if (!props.showSecond || !props.storageKey || size === undefined) return

  localStorage.setItem(props.storageKey, String(Math.round(size)))
}
</script>

<style>
.dashboard-split .splitpanes__splitter {
  position: relative;
  flex-shrink: 0;
  background-color: #e5e7eb;
  transition: background-color 0.15s;
}

.dashboard-split.splitpanes--vertical > .splitpanes__splitter {
  width: 4px;
}

.dashboard-split.splitpanes--horizontal > .splitpanes__splitter {
  height: 4px;
}

.dashboard-split .splitpanes__splitter:hover {
  background-color: #f59e0b;
}

.dark .dashboard-split .splitpanes__splitter {
  background-color: #374151;
}

.dark .dashboard-split .splitpanes__splitter:hover {
  background-color: #f59e0b;
}
</style>
