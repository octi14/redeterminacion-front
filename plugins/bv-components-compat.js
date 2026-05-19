import { BButton, BFormInput } from 'bootstrap-vue-next'

/**
 * Alias de componentes de Bootstrap-Vue 2 que BootstrapVueNext no registra.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp } = nuxtApp
  vueApp.component('BBtn', BButton)
  vueApp.component('BInput', BFormInput)
})
