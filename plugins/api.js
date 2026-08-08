import { createApiClient } from '~/utils/api-client.js'
import { getAuthToken } from '~/utils/auth-token.js'

/**
 * Cliente HTTP compatible con @nuxtjs/axios.
 * Nuxt 3 reserva $api (solo lectura); exponemos el cliente como $axios.
 */
export default defineNuxtPlugin({
  name: 'api',
  dependsOn: ['pinia'],
  setup(nuxtApp) {
    const api = createApiClient({
      getToken: () => nuxtApp.runWithContext(() => getAuthToken()),
      onUnauthorized: () => nuxtApp.runWithContext(async () => {
        const userStore = useUserStore()
        userStore.clearSession()
        if (useRoute().path !== '/login') {
          await navigateTo('/login')
        }
      }),
    })

    // Nuxt 3 registra $axios como getter al hacer provide; no asignar globalProperties.
    return {
      provide: {
        axios: api,
      },
    }
  },
})
