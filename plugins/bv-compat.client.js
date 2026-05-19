import { useToastController } from 'bootstrap-vue-next'

/**
 * Compatibilidad con $bvToast y window.$nuxt.$bvToast del stack Nuxt 2.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const { show } = useToastController()

  const bvToast = {
    toast(body, options = {}) {
      show({
        props: {
          body: String(body),
          title: options.title,
          variant: options.variant || 'info',
        },
        solid: options.solid ?? true,
        appendToast: options.appendToast ?? true,
      })
    },
  }

  nuxtApp.provide('bvToast', bvToast)

  if (import.meta.client) {
    window.$nuxt = nuxtApp
    if (!nuxtApp.$bvToast) {
      nuxtApp.$bvToast = bvToast
    }
  }
})
