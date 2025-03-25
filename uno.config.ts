import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'uno-card':
      'h-full w-full gap-2 ring-inset hover:ring-1.5 hover:ring-amber overflow-hidden border border-gray-200 rounded-md border-solid p-2 transition-all ease-in-out shadow-sm dark:border-gray-600 hover:border-amber',
    'uno-btn': 'border rounded px-2 py-1 cursor-pointer shadow bg-black text-gray-1',
    'icon-btn':
      'flex-center cursor-pointer border-2 border-gray-200 dark:border-neutral-800  dark:text-gray-300 rounded-lg border-solid p-1',
    'float-btn':
      'fixed bottom-10 right-5 z-50 border border-solid border-gray-200 flex-center cursor-pointer rounded-lg dark:bg-dark dark:border-gray-600 bg-white p-2 shadow-lg',
    'uno-input':
      'block w-full border border-gray-300 rounded-md border-solid bg-gray-50 p-6px text-sm text-gray-900 dark:border-gray-600 dark:bg-dark dark:text-white dark:placeholder-gray-400',
    'uno-input-file':
      'block w-full text-sm text-gray-500 file:me-4 file:border-0 file:rounded-md file:bg-dark dark:file:bg-black file:px-3 file:py-1 file:text-sm dark:text-neutral-500 file:text-white file:disabled:pointer-events-none file:disabled:opacity-50'
  },
  theme: {
    animation: {
      keyframes: {
        'bounce-arrow-up':
          '{0% { transform: translateY(0); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0); }}',
        'bounce-scale':
          '{0% { transform: scale(0.9); } 50% { transform: scale(1.25); } 100% { transform: scale(1); }}',
        'fade-in-down-mini':
          '{0% { opacity: 0; transform: translate3d(0, -30px, 0); } 100% { opacity: 1; transform: translate3d(0, 0, 0); }}',
        'blink-caret': '{from,to { opacity: 0;} 50% { opacity: 1; }}'
      },
      durations: {
        'bounce-arrow-up': '0.4s',
        'bounce-scale': '0.4s',
        'fade-in-down-mini': '1s',
        'blink-caret': '0.8s'
      },
      timingFns: {
        'bounce-arrow-up': 'ease-in-out',
        'bounce-scale': 'ease-in-out',
        'blink-caret': 'step-end'
      },
      counts: {
        'blink-caret': 'infinite'
      }
    }
  }
})
