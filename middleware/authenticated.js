import { hydrateUserFromLocalStorage } from '~/utils/sessionHydrate'

export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const nuxtApp = useNuxtApp()
  hydrateUserFromLocalStorage(nuxtApp)
  const userStore = useUserStore()

  if (!userStore.token) {
    return navigateTo('/')
  }
})
