import UserService from '~/service/user.js'
import { createApiClient } from '~/utils/api-client.js'

export function createLoginApi(apiBase) {
  return createApiClient({
    getRuntimeConfig: () => ({ public: { apiBase } }),
    getToken: () => null,
  })
}

/**
 * @param {ReturnType<typeof useUserStore>} userStore
 */
export async function authenticateUser(userStore, { username, password }, apiBase) {
  const api = createLoginApi(apiBase)
  const authUser = await UserService.authenticate(api, { username, password })

  if (!authUser?.token) {
    throw new Error('Respuesta de autenticación inválida')
  }

  userStore.setAuthenticated({
    id: authUser.id,
    username: authUser.username || username,
    token: authUser.token,
    admin: authUser.admin,
  })

  void userStore.registrarActividad({
    evento: 'LogIn',
    result: 'LogIn Exitoso',
    username,
  })

  return authUser
}
