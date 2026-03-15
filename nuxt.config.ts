// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  nitro: {
    minify: true,
    sourceMap: true,
    prerender: {
      routes: ['/', '/rss.xml', '/sitemap.xml'],
      // Then crawl all the links on the page
      crawlLinks: true
    }
  },

  css: ['~/assets/base.css', '~/assets/transitions.css'],

  routeRules: {
    '/articles/page': { redirect: '/articles', prerender: false },
    '/articles/page/1': { redirect: '/articles', prerender: false },
    '/dashboard/**': { ssr: false }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  future: {
    compatibilityVersion: 4
  },

  experimental: {
    typedPages: true
  },

  build: {
    transpile: ['trpc-nuxt']
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
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/content',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    'nuxt-og-image',
    'nuxt-auth-utils',
    'nuxt-monaco-editor'
  ],

  image: {
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

  ogImage: {
    fonts: [
      {
        name: 'AlibabaPuHui',
        weight: 400,
        path: '/fonts/Alibaba-PuHuiTi-Regular-CN.ttf'
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
    highlight: {},
    experimental: {
      search: {
        indexed: false,
        filterQuery: {
          _path: { $regex: '^/(articles|notes)/' }
        }
      }
    },
    markdown: {
      remarkPlugins: ['remark-reading-time'],
      toc: {
        depth: 3,
        searchDepth: 3
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
      include: ['vue-use-fixed-header', '@vueuse/integrations/useFuse', '@giscus/vue']
    }
  }
})
