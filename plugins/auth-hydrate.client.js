/**
 * Migracion unica de sesiones viejas guardadas en localStorage (pre-cookie).
 * Si el plugin `session` ya hidrato desde la cookie no hace nada.
 * Si encuentra una sesion legacy, la vuelca a la cookie via setAuthenticated
 * y limpia las claves viejas para no volver a correr.
 */
export default defineNuxtPlugin({
  name: 'auth-hydrate-legacy-migration',
  dependsOn: ['pinia', 'session'],
  setup() {
    const userStore = useUserStore()
    if (userStore.token) return

    try {
      const legacyToken = localStorage.getItem('userToken')
      if (!legacyToken) return

      userStore.setAuthenticated({
        id: localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        token: legacyToken,
        admin: localStorage.getItem('userAdmin'),
        roles: JSON.parse(localStorage.getItem('userRoles') || '[]'),
        permissions: JSON.parse(localStorage.getItem('userPermissions') || '[]'),
        accessSource: localStorage.getItem('userAccessSource') || 'legacy',
      })
    } catch {
      /* sesion legacy corrupta: se ignora, el usuario debera reloguearse */
    } finally {
      ;['userId', 'username', 'userToken', 'userAdmin', 'userRoles', 'userPermissions', 'userAccessSource'].forEach(
        (key) => localStorage.removeItem(key),
      )
    }
  },
})
