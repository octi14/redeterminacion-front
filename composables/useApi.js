/**
 * Cliente HTTP compatible con la API de @nuxtjs/axios usada en service/*.js
 */
export function useApi() {
  const api = useNuxtApp().$axios
  if (!api) {
    throw new Error('[useApi] Cliente HTTP ($axios) no está disponible. ¿Cargó el plugin api?')
  }
  return api
}
