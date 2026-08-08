import { useSessionCookie } from '~/utils/session-cookie'

/**
 * Hidrata el store de usuario desde la cookie de sesion.
 * Corre en servidor y cliente (sin sufijo .client/.server) para que
 * el HTML de SSR y la primera hidratacion del cliente vean el mismo estado
 * de auth/roles/permisos y no se generen mismatches de hidratacion.
 */
export default defineNuxtPlugin({
  name: 'session',
  dependsOn: ['pinia'],
  setup() {
    const session = useSessionCookie()
    if (session.value?.token) {
      useUserStore().hydrate(session.value)
    }
  },
})
