import { hydrateUserFromLocalStorage } from '~/utils/sessionHydrate'
import { userCanAccessAdminRoute } from '~/utils/access-control'

/**
 * Requiere sesión y acceso declarado en definePageMeta:
 * - adminRoles: roles permitidos (ej. "compras", "master")
 * - allowedUsernames (opcional): usuarios puntuales sin ese rol
 * Debe ejecutarse después de `authenticated`.
 */
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const nuxtApp = useNuxtApp()
  hydrateUserFromLocalStorage(nuxtApp)
  const userStore = useUserStore()

  if (!userStore.token) {
    return navigateTo('/login')
  }

  const adminRoles = to.meta.adminRoles
  const allowedUsernames = to.meta.allowedUsernames
  const hasRoles = Array.isArray(adminRoles) && adminRoles.length > 0
  const hasUsernames = Array.isArray(allowedUsernames) && allowedUsernames.length > 0

  if (!hasRoles && !hasUsernames) {
    if (import.meta.dev) {
      console.warn('[require-admin] Falta adminRoles o allowedUsernames en', to.path)
    }
    return navigateTo('/')
  }

  if (!userCanAccessAdminRoute(userStore, {
    adminRoles: hasRoles ? adminRoles : [],
    allowedUsernames: hasUsernames ? allowedUsernames : [],
  })) {
    return navigateTo('/')
  }
})
