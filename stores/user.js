import UserService from '../service/user.js'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: null,
    id: null,
    token: null,
    admin: null,
  }),

  actions: {
    setAuthenticated({ id, username, token, admin }) {
      this.id = id
      this.username = username
      this.token = token
      this.admin = admin
      if (import.meta.client) {
        localStorage.setItem('userId', id)
        localStorage.setItem('username', username)
        localStorage.setItem('userToken', token)
        localStorage.setItem('userAdmin', admin)
      }
    },

    clearSession() {
      this.id = null
      this.username = null
      this.token = null
      this.admin = null
      if (import.meta.client) {
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        localStorage.removeItem('userToken')
        localStorage.removeItem('userAdmin')
      }
    },

    async authenticate({ username, password }) {
      const api = useApi()
      const router = useRouter()
      const nuxtApp = useNuxtApp()

      const showToast = (body, options = {}) => {
        try {
          nuxtApp.$bvToast?.toast(body, options)
        } catch (err) {
          console.warn('[login] No se pudo mostrar el toast:', err)
        }
      }

      try {
        const authUser = await UserService.authenticate(api, { username, password })
        if (!authUser?.token) {
          throw new Error('Respuesta de autenticación inválida')
        }

        this.setAuthenticated({
          id: authUser.id,
          username,
          token: authUser.token,
          admin: authUser.admin,
        })

        showToast('Ingreso exitoso.', { variant: 'success', appendToast: true, solid: true })

        // No bloquear el login si falla el registro de actividad
        void this.registrarActividad({ evento: 'LogIn', result: 'LogIn Exitoso', username })

        await router.push('/')
        return true
      } catch (e) {
        const message = e?.message || 'Error de autenticación'
        showToast(`Error iniciando sesión: ${message}`, {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
        this.clearSession()
        throw e
      }
    },

    async registrarActividad({ evento, result, username }) {
      const userId = username || this.username
      try {
        await useNuxtApp().$logUserActivity(userId, evento, result)
      } catch (error) {
        console.error('Error al registrar la actividad:', error)
      }
    },

    async changePassword({ userId, oldPassword, newPassword }) {
      const api = useApi()
      const nuxtApp = useNuxtApp()
      const toast = (body, options) => nuxtApp.$bvToast?.toast(body, options)
      try {
        const response = await UserService.changePassword(api, {
          userId,
          oldPassword,
          newPassword,
        })
        if (response) {
          toast('Contraseña cambiada con éxito.', { variant: 'success', appendToast: true, solid: true })
          return true
        }
        toast('Error al cambiar la contraseña.', { variant: 'danger', appendToast: true, solid: true })
        return false
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error)
        return false
      }
    },

    async logout() {
      this.clearSession()
      await useRouter().push('/')
    },

    async checkToken({ token }) {
      try {
        return await UserService.checkToken(useApi(), { token })
      } catch (e) {
        console.log(e)
      }
    },
  },
})
