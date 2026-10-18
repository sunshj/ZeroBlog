declare module 'vue-router' {
  interface RouteMeta {
    menu?: {
      icon: string
      label: string
      order: number
    }
  }
}

export {}
