export default {
  target: 'server',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Hacienda Villa Gesell',
    htmlAttrs: {
      lang: 'es'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ],
    script: [
      { src: 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit', async: true, defer: true }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/css/style.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vuelidate.js', ssr: true },
    '~/plugins/logUserActivity.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // baseURL: 'https://redeterminacion-back.herokuapp.com/',
    baseURL: 'http://localhost:5000/',  // Used as fallback if no runtime config is provided
  },


  // BootstrapVue module configuration https://bootstrap-vue.org/docs#nuxtjs-module
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    icons: true,
    bootstrapVueCSS: false, // Or `bvCSS: false`
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
