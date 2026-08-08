const COOKIE_NAME = 'vg_session'
const COOKIE_MAX_AGE = 60 * 60 * 48 // 48h, en linea con TOKEN_TIMEOUT del backend

/**
 * Cookie isomorfica (SSR + cliente) con la sesion completa.
 * Reemplaza a localStorage para que el servidor pueda hidratar
 * el store antes de renderizar y evitar mismatches de hidratacion.
 */
export function useSessionCookie() {
  return useCookie(COOKIE_NAME, {
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
  })
}
