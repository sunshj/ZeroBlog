---
title: Nuxt Async Generator API
date: '2024-12-09 15:08:00'
path: /notes/nuxt-async-generator-api
---
 
在 Nuxt 中使用 AsyncGenerator eventHandler，服务端可以将一个异步生成器作为响应返回，客户端通过流式读取数据。

:async-generator-api-play

### server

```ts [server/api/iterator.ts]
export default defineEventHandler(event => {
  async function* generate() {
    yield {
      msg: 'received',
      payload
    }
    await delay(200)
    yield {
      msg: 'processing',
      payload
    }
    await delay(3000)
    yield {
      msg: 'done',
      payload: processedPayload
    }
    await delay(200)
    return
  }

  sendIterable(event, generate())
})

```

### client
```vue [app.vue]
<template>
  <div v-for="item in data" :key="item">{{ item }}</div>
</template>

<script setup>
const data = ref([])

async function run() {
  const response = await $fetch('/api/iterator', { responseType: 'stream' })
  const decoder = new TextDecoder()
  const reader = response.getReader()
  if (!reader) return
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value, { stream: true })
    data.value.push(text);
  }
}
</script>

```

