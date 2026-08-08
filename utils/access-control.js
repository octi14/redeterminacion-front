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
  const roleKeys = [userStore.admin, ...(userStore.roles || []).map((role) => role.key || role)]
  return roleKeys.some((role) => allowedRoles.includes(role))
}

export function userHasPermission(userStore, permission) {
  if (!userStore?.token || !permission) return false
  const permissions = userStore.permissions || []
  const hasLegacyFullAccess = ['admin', 'master', 'true'].includes(String(userStore.admin))
  return hasLegacyFullAccess || permissions.includes('*') || permissions.includes(permission)
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
