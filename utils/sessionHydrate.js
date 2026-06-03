/**
 * Restaura la sesión desde localStorage (solo cliente).
 * @param {import('#app').NuxtApp} [nuxtApp]
 */
export function hydrateUserFromLocalStorage(nuxtApp) {
  if (import.meta.server) return false

  const run = () => {
    try {
      const store = useUserStore()
      if (store.token) return true

      const userId = localStorage.getItem('userId')
      const token = localStorage.getItem('userToken')
      if (!userId || !token) return false

      store.setAuthenticated({
        id: userId,
        username: localStorage.getItem('username') || '',
        token,
        admin: localStorage.getItem('userAdmin') || '',
      })
      return true
    } catch {
      return false
    }
  }

  if (nuxtApp) {
    return nuxtApp.runWithContext(run)
  }
  return run()
}
