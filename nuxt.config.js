// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  nitro: {
    preset: 'node-server',
  },

  app: {
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
    '~/plugins/pinia-compat.js',
    '~/plugins/vuelidate-compat.js',
    '~/plugins/bv-components-compat.js',
    '~/plugins/logUserActivity.client.js',
    '~/plugins/bv-compat.client.js',
  ],

  alias: {
    'vuelidate/lib/validators': '@vuelidate/validators',
  },

  modules: ['@bootstrap-vue-next/nuxt', '@pinia/nuxt'],

  runtimeConfig: {
    public: {
      apiBase: 'https://redeterminacion-back.herokuapp.com/',
    },
  },

  components: true,

  compatibilityDate: '2024-11-01',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
        },
      },
    },
  },
})
