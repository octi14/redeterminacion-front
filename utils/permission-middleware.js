import { hydrateUserFromLocalStorage } from '~/utils/sessionHydrate'
import { userHasPermission } from '~/utils/access-control'

export function createPermissionMiddleware(permissions = []) {
  return defineNuxtRouteMiddleware(() => {
    if (import.meta.server) return

    hydrateUserFromLocalStorage(useNuxtApp())
    const userStore = useUserStore()
    if (!userStore.token) return navigateTo('/login')

    if (!permissions.some((permission) => userHasPermission(userStore, permission))) {
      return navigateTo('/')
    }
  })
}
