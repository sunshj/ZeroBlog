// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  nitro: {
    minify: true,
    sourceMap: true
  },

  prerender: {
    routes: ['/', '/rss.xml', '/sitemap.xml'],
    // Then crawl all the links on the page
    crawlLinks: true,
    ignore: ['/dashboard', /^\/_vercel\/image/]
  },

  css: ['~/assets/base.css', '~/assets/transitions.css'],

  routeRules: {
    '/articles/page': { redirect: '/articles', prerender: false },
    '/articles/page/1': { redirect: '/articles', prerender: false },
    '/dashboard/**': { ssr: false, prerender: false }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  experimental: {
    typedPages: true
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        // Skip type checking of generated JS (e.g. .nuxt/twoslash-mdc.config.mjs),
        // which is not written to satisfy strict type checks.
        allowJs: false
      }
    }
  },

  runtimeConfig: {
    siteUrl: '',
    siteName: '',
    githubRepo: '',

    public: {
      giscusRepo: '',
      giscusRepoId: '',
      giscusCategory: '',
      giscusCategoryId: '',

      imageBedRepo: '',
      imageBedFolder: ''
    }
  },

  modules: [
    '@sunshj/mdc',
    'nuxt-content-twoslash',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/content',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    'nuxt-og-image',
    'nuxt-auth-utils',
    'nuxt-monaco-editor'
  ],

  twoslash: {
    compilerOptions: {
      noImplicitAny: false,
      strict: false,
      allowJs: true
    },
    // Skip Twoslash in dev to improve performance. Turn this on when you want to explicitly test twoslash in dev.
    enableInDev: false
  },

  image: {
    provider: 'vercel',
    presets: {
      cover: {
        modifiers: {
          fit: 'cover',
          format: 'webp',
          width: 90,
          height: 90
        }
      }
    }
  },

  fonts: {
    families: [
      {
        name: 'AlibabaPuHui',
        src: '/fonts/Alibaba-PuHuiTi-Regular-CN.ttf',
        weight: 400,
        global: true
      }
    ]
  },

  vueuse: {
    ssrHandlers: true
  },

  colorMode: {
    classSuffix: '',
    fallback: 'light',
    storage: 'localStorage'
  },

  icon: {
    clientBundle: {
      scan: {
        globInclude: ['content/**/*.{yaml,md}']
      }
    }
  },

  content: {
    experimental: {
      sqliteConnector: 'native'
    },
    build: {
      markdown: {
        highlight: {},
        remarkPlugins: {
          'remark-reading-time': {}
        },
        toc: {
          depth: 3,
          searchDepth: 3
        }
      }
    }
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        'vue-use-fixed-header',
        '@vueuse/integrations/useFuse',
        '@giscus/vue',
        '@vue/devtools-core',
        'remark-reading-time',
        'splitpanes',
        '@shikijs/core',
        '@shikijs/engine-javascript',
        '@shikijs/engine-oniguruma',
        '@shikijs/langs/css',
        '@shikijs/langs/html',
        '@shikijs/langs/javascript',
        '@shikijs/langs/json',
        '@shikijs/langs/jsx',
        '@shikijs/langs/markdown',
        '@shikijs/langs/mdc',
        '@shikijs/langs/shellscript',
        '@shikijs/langs/tsx',
        '@shikijs/langs/typescript',
        '@shikijs/langs/vue',
        '@shikijs/langs/yaml',
        '@shikijs/themes/dark-plus',
        '@shikijs/themes/light-plus',
        '@shikijs/transformers',
        'shiki/wasm'
      ]
    }
  }
})
