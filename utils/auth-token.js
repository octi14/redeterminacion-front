/**
 * Token de sesión: el store (hidratado desde la cookie en plugins/session.js)
 * es la única fuente de verdad, tanto en servidor como en cliente.
 */
export function getAuthToken() {
  try {
    return useUserStore().token || null
  } catch (_) {
    return null
  }
}
