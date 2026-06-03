import UserService from '../service/user.js'
import { defineStore } from 'pinia'
import { authenticateUser } from '../utils/auth-login.js'
import { useToastController } from 'bootstrap-vue-next'

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
      const config = useRuntimeConfig()
      const nuxtApp = useNuxtApp()
      try {
        await authenticateUser(this, { username, password }, config.public.apiBase)
        try {
          const show = nuxtApp.vueApp.runWithContext(() => useToastController()?.show)
          show?.({
            props: {
              body: 'Ingreso exitoso.',
              title: undefined,
              variant: 'success',
              solid: true,
              pos: 'top-end',
              value: 5000,
            },
            appendToast: true,
          })
        } catch (_) {
          /* toast opcional */
        }
        if (import.meta.client) {
          await navigateTo('/')
        }
        return true
      } catch (e) {
        const message = e?.message || 'Error de autenticación'
        try {
          const show = nuxtApp.vueApp.runWithContext(() => useToastController()?.show)
          show?.({
            props: {
              body: `Error iniciando sesión: ${message}`,
              title: 'Error',
              variant: 'danger',
              solid: true,
              pos: 'top-end',
              value: 5000,
            },
            appendToast: true,
          })
        } catch (_) {
          /* toast opcional */
        }
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
      const show = nuxtApp.vueApp.runWithContext(() => useToastController()?.show)
      try {
        const response = await UserService.changePassword(api, {
          userId,
          oldPassword,
          newPassword,
        })
        if (response) {
          show?.({
            props: {
              body: 'Contraseña cambiada con éxito.',
              title: undefined,
              variant: 'success',
              solid: true,
              pos: 'top-end',
              value: 5000,
            },
            appendToast: true,
          })
          return true
        }
        show?.({
          props: {
            body: 'Error al cambiar la contraseña.',
            title: undefined,
            variant: 'danger',
            solid: true,
            pos: 'top-end',
            value: 5000,
          },
          appendToast: true,
        })
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
