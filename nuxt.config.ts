import { fileURLToPath } from 'node:url'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s - Sistema de Ventas y Administración Comercial',
      title: 'SIVA',

      link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      }],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL, // can be overridden by NUXT_PUBLIC_API_BASE environment variable
      authOrigin: process.env.NUXT_AUTH_ORIGIN,
      appEnv: process.env.NODE_ENV || 'development',
    },
  },

  devtools: {
    enabled: true,
  },

  ssr: true,

  nitro: {
    routeRules: {
      '/siva/**': {
        proxy: {
          to: `${process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4001'}/api/**`,
        },
      },
    },
  },

  css: [
    '@core/scss/template/index.scss',
    '@styles/styles.scss',
    '@/plugins/iconify/icons.css',
    '@layouts/styles/index.scss',
  ],

  components: {
    dirs: [{
      path: '@/@core/components',
      pathPrefix: false,
    }, {
      path: '~/components/global',
      global: true,
    }, {
      path: '~/components',
      pathPrefix: false,
    }],
  },

  plugins: ['@/plugins/vuetify/index.ts', '@/plugins/iconify/index.ts', '~/plugins/api.ts'],

  imports: {
    dirs: ['./@core/utils', './@core/composable/', './plugins/*/composables/*'],
  },

  experimental: {
    typedPages: true,
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '@/*': ['../*'],
          '@layouts/*': ['../@layouts/*'],
          '@layouts': ['../@layouts'],
          '@core/*': ['../@core/*'],
          '@core': ['../@core'],
          '@images/*': ['../assets/images/*'],
          '@styles/*': ['../assets/styles/*'],
        },
      },
    },
  },

  // ℹ️ Disable source maps until this is resolved: https://github.com/vuetifyjs/vuetify-loader/issues/290
  sourcemap: {
    server: false,
    client: false,
  },

  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'swiper-container' || tag === 'swiper-slide',
    },
  },

  vite: {
    define: { 'process.env': {} },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url)),
        '@core': fileURLToPath(new URL('./@core', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./@layouts', import.meta.url)),
        '@images': fileURLToPath(new URL('./assets/images/', import.meta.url)),
        '@styles': fileURLToPath(new URL('./assets/styles/', import.meta.url)),
        '@configured-variables': fileURLToPath(new URL('./assets/styles/variables/_template.scss', import.meta.url)),
      },
    },

    build: {
      chunkSizeWarningLimit: 5000,
    },

    optimizeDeps: {
      exclude: ['vuetify'],
      entries: [
        './**/*.vue',
      ],
    },

    plugins: [
      svgLoader(),
      vuetify({
        styles: {
          configFile: 'assets/styles/variables/_vuetify.scss',
        },
      }),
    ],
  },

  build: {
    transpile: ['vuetify'],
  },

  modules: ['@vueuse/nuxt', '@nuxtjs/device', '@pinia/nuxt', '@sidebase/nuxt-auth'],
  auth: {
    originEnvKey: 'NUXT_AUTH_ORIGIN',
    baseURL: process.env.NUXT_AUTH_ORIGIN,
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        signUp: false,
        getSession: { path: '/session', method: 'get' },
      },
      pages: {
        login: '/login',
      },
      session: {
        dataType: {
          id: 'number',
          username: 'string',
          email: 'string',
          person: '{ id: number, run: string, names: string, lastName: string, employee: { jobRole: string, workShift: string } }',
        },
      },
      token: {
        signInResponseTokenPointer: '/token',
        type: 'Bearer',
        headerName: 'Authorization',
        cookieName: 'auth.token',
        maxAgeInSeconds: 890, // 15 min
        sameSiteAttribute: 'lax',
        httpOnlyCookieAttribute: false,
      },
      refresh: {
        isEnabled: true,
        endpoint: { path: '/refresh', method: 'post' },
        refreshOnlyToken: true,
        token: {
          signInResponseRefreshTokenPointer: '/refreshToken',
          refreshResponseTokenPointer: '/token',
          cookieName: 'auth.refreshToken',
          maxAgeInSeconds: 60 * 60 * 3, // 3 h
          sameSiteAttribute: 'lax',
          httpOnlyCookieAttribute: false,
        },
      },
    },
    sessionRefresh: {
      enablePeriodically: false, // ⬅️ Desactiva refresco periódico
      enableOnWindowFocus: false, // ⬅️ Desactiva refresco al enfocar ventana
    },
    globalAppMiddleware: {
      isEnabled: true,
      addDefaultCallbackUrl: false, // ⬇️ Evita verificación excesiva en rutas públicas
    },
  },
  compatibilityDate: '2025-06-08',
})
