import { userHasPermission } from '~/utils/access-control'

export function createPermissionMiddleware(permissions = []) {
  return defineNuxtRouteMiddleware(() => {
    const userStore = useUserStore()
    if (!userStore.token) return navigateTo('/login')

    if (!permissions.some((permission) => userHasPermission(userStore, permission))) {
      return navigateTo('/')
    }
  })
}
