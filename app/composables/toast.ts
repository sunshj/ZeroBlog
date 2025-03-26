import { createApp } from 'vue'
import Toast from '~/components/ui/Toast.vue'

interface ToastOptions {
  className?: string
  style?: object
  duration?: number
}

export function useToast(options: ToastOptions = {}) {
  const { className, style, duration = 2000 } = options

  function show(message: string) {
    const div = document.createElement('div')
    const app = createApp(Toast, { class: className, style, message })
    app.mount(div)
    document.body.append(div)

    let timer: any = null

    timer = setTimeout(() => {
      app.unmount()
      div.remove()
      clearTimeout(timer)
    }, duration)
  }

  return {
    show
  }
}
