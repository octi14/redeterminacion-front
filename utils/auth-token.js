/**
 * Token de sesión: Pinia primero, localStorage como respaldo en cliente.
 */
export function getAuthToken() {
  if (import.meta.client) {
    try {
      const token = useUserStore().token
      if (token) return token
    } catch (_) {
      /* Pinia aún no activo */
    }
    return localStorage.getItem('userToken') || null
  }

  try {
    return useUserStore().token || null
  } catch (_) {
    return null
  }
}
