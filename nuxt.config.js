// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  nitro: {
    preset: 'node-server',
  },

  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    layoutTransition: false,
    head: {
      title: 'Hacienda Villa Gesell',
      htmlAttrs: { lang: 'es' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
      script: [
        {
          src: 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit',
          async: true,
          defer: true,
        },
      ],
    },
  },

  css: [
    '~/assets/css/style.scss',
    'bootstrap-icons/font/bootstrap-icons.css',
  ],

  bootstrapVueNext: {
    css: true,
  },

  plugins: [
    '~/plugins/pinia-payload.server.js',
    '~/plugins/api.js',
    '~/plugins/project-toast.client.js',
    '~/plugins/bform-file-fix.client.js',
    '~/plugins/auth-hydrate.client.js',
    '~/plugins/router-cleanup.client.js',
    '~/plugins/vuelidate.js',
    '~/plugins/logUserActivity.client.js',
  ],

  alias: {
    'vuelidate/lib/validators': '@vuelidate/validators',
  },

  modules: ['./modules/nuxt-dev-fix.js', '@bootstrap-vue-next/nuxt', '@pinia/nuxt'],

  runtimeConfig: {
    public: {
      apiBase: 'https://redeterminacion-back.herokuapp.com/',
      // apiBase: 'http://127.0.0.1:5000/',
    },
  },

  components: true,

  compatibilityDate: '2024-11-01',

  future: {
    compatibilityVersion: 3,
  },

  vite: {
    ssr: {
      // Librerías que usan navigator/DOM: no evaluarlas en el bundle SSR.
      external: ['file-saver', 'jspdf', 'jszip', 'xlsx'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
        },
      },
    },
  },
})
