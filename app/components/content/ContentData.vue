<template>
  <div class="grid gap-4" :style="gridStyle">
    <template v-for="(item, index) in items" :key="index">
      <component :is="renderComponent" v-if="renderComponent" v-bind="item" />
      <span v-else>{{ toText(item) }}</span>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'

const modules = import.meta.glob<{ default: Component }>('./*.vue', { eager: true })

const renderers: Record<string, Component> = Object.fromEntries(
  Object.entries(modules).map(([path, module]) => [path.slice(2, -4), module.default])
)

const props = withDefaults(
  defineProps<{
    dataSource: string
    dataKey?: string
    render?: string
    cols?: number | string
  }>(),
  { cols: 2 }
)

const { data } = await useAsyncData(`content-data-${props.dataSource}`, () =>
  queryCollection('data').where('stem', '=', `data/${props.dataSource}`).first()
)

/**
 * Content 把数据文件的字段统一收在 meta 里：
 * yaml 对象是 meta[文件名]，顶层数组的 json 是 meta.body。
 * 取值顺序：dataKey → 同名 key → body → 整个 meta。
 */
const items = computed<object[]>(() => {
  const item = data.value as Record<string, unknown> | null

  if (!item) return []

  const meta = (item.meta ?? {}) as Record<string, unknown>
  const source = Object.keys(meta).length > 0 ? meta : item
  const value = props.dataKey ? source[props.dataKey] : (source[props.dataSource] ?? source.body ?? source)

  if (Array.isArray(value)) return value

  return value === undefined || value === null ? [] : [value]
})

function toText(value: unknown) {
  return typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)
}

const columns = computed(() => Number(props.cols) || 2)

const gridStyle = computed(() => ({ gridTemplateColumns: `repeat(${columns.value}, minmax(0, 1fr))` }))

const renderComponent = computed(() => (props.render ? renderers[props.render] : undefined))
</script>
