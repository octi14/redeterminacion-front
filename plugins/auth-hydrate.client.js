import { hydrateUserFromLocalStorage } from '~/utils/sessionHydrate'

/**
 * Restaura sesión desde localStorage al iniciar la app (cliente),
 * después de que Pinia esté activo.
 */
export default defineNuxtPlugin({
  name: 'auth-hydrate',
  dependsOn: ['pinia'],
  setup(nuxtApp) {
    hydrateUserFromLocalStorage(nuxtApp)
  },
})
