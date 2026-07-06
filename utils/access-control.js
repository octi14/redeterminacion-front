/** Usuario con acceso restringido al dashboard de combustible (sin órdenes ni vehículos). */
export const COMBUSTIBLE_DASHBOARD_USERNAMES = ['gustavociriaco@gesell.gob.ar']

/**
 * Comprueba si el usuario tiene alguno de los roles de administración permitidos.
 * Los valores de `allowedRoles` deben coincidir con `userStore.admin` (ej. "recaudaciones", "master").
 *
 * @param {import('../stores/user.js').useUserStore} userStore
 * @param {string[]} allowedRoles
 */
export function userHasAnyAdminRole(userStore, allowedRoles = []) {
  if (!userStore?.token || !Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    return false
  }
  const admin = userStore.admin
  return allowedRoles.includes(admin)
}

/**
 * @param {import('../stores/user.js').useUserStore} userStore
 * @param {{ adminRoles?: string[], allowedUsernames?: string[] }} options
 */
export function userCanAccessAdminRoute(userStore, { adminRoles = [], allowedUsernames = [] } = {}) {
  if (!userStore?.token) return false
  if (userHasAnyAdminRole(userStore, adminRoles)) return true
  const username = userStore.username
  return Array.isArray(allowedUsernames) && allowedUsernames.includes(username)
}
