import { authenticateUser } from '~/utils/auth-login.js'

export function useLogin() {
  const userStore = useUserStore()
  const config = useRuntimeConfig()
  const { showToast } = useProjectToast()

  async function login({ username, password }) {
    await authenticateUser(userStore, { username, password }, config.public.apiBase)

    try {
      showToast('Ingreso exitoso.', {
        variant: 'success',
        appendToast: true,
        solid: true,
      })
    } catch (_) {
      /* toast opcional */
    }

    await navigateTo('/')
    return true
  }

  return { login }
}
