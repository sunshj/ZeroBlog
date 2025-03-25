---
title: Event Bus
date: '2024-11-17 13:58:59'
path: /notes/event-bus
---

::code-group

```ts [EventBus.ts]
class EventBus<T extends Record<string, (...args: any[]) => void>> {
  private events: Map<keyof T, Set<T[keyof T]>>

  constructor() {
    this.events = new Map()
  }

  on<K extends keyof T>(name: K, callback: T[K]) {
    if (!this.events.has(name)) {
      this.events.set(name, new Set())
    }
    this.events.get(name)?.add(callback)
  }

  emit<K extends keyof T>(name: K, ...args: Parameters<T[K]>) {
    if (this.events.has(name)) {
      this.events.get(name)?.forEach(cb => cb(...args))
    }
  }

  off<K extends keyof T>(name: K, callback?: T[K]) {
    if (this.events.has(name)) {
      if (callback) this.events.get(name)?.delete(callback)
      else this.events.delete(name)
    }
  }

  once<K extends keyof T>(name: K, callback: T[K]) {
    const once = (...args: any[]) => {
      callback(...args)
      this.off(name, once as T[K])
    }
    this.on(name, once as T[K])
  }
}

```

```ts [test.ts]
type Events = {
  evt1: () => void
  evt2: (data: number) => void
  evt3: (data: string) => void
}

const bus = new EventBus<Events>()

function handleEvt1() {
  console.log('evt1 triggered')
}

function handleEvt2(data: number) {
  console.log('evt2 triggered', data)
}

function handleEvt3(data: string) {
  console.log('evt3 triggered', data)
}

bus.on('evt1', () => {
  console.log('evt1 triggered 2')
})

bus.on('evt1', handleEvt1)
bus.on('evt2', handleEvt2)
bus.once('evt3', handleEvt3)

bus.off('evt1', handleEvt1)
bus.emit('evt1')

bus.emit('evt2', 123)

bus.emit('evt3', '执行一次')
bus.emit('evt3', '再执行一次')

// 打印结果
// evt1 triggered 2
// evt2 triggered 123
// evt3 triggered 执行一次
```

::
