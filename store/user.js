const UserService = require('../service/user')

export const state = () => ({
  username: null,
  id: null,
  token: null,
  admin: null,
  rolesExp: [],
  permissions: [],
  accessSource: 'legacy',
})

export const actions = {
  async authenticate({ commit, dispatch }, { username, password }) {
    try {
      const authUser = await UserService.authenticate(this.$axios, {
        username,
        password,
      });
      const { id, token, admin, rolesExp, permissions, accessSource } = authUser;
      // guardo el token y el username en state
      commit('setAuthenticated', { id, username, token, admin, rolesExp, permissions, accessSource });
      window &&
        window.$nuxt.$bvToast.toast('Ingreso exitoso.', {
          // title: '',
          variant: 'success',
          appendToast: true,
          solid: true,
        });
      await dispatch('registrarActividad', { evento: 'LogIn', result: 'LogIn Exitoso', username });
      await this.$router.push('/');
    } catch (e) {
      // Muestra el mensaje de error en el Toast
      window &&
        window.$nuxt.$bvToast.toast(`Error iniciando sesión: ${e.message}`, {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        });
      commit('logout');
    }
  },

  async registrarActividad({ state }, { evento, result, username }) {
    const userId = username || state.username; // Usa el username actual si no se pasa explícitamente
    const actionType = evento;
    const actionResult = result;

    try {
      await this.$logUserActivity(userId, actionType, actionResult);
    } catch (error) {
      console.error('Error al registrar la actividad:', error);
    }
  },

  async changePassword({ commit }, { userId, oldPassword, newPassword }) {
    try {
      const response = await UserService.changePassword(this.$axios, {
        userId,
        oldPassword,
        newPassword,
      });
  
      if (response) {
        window &&
          window.$nuxt.$bvToast.toast('Contraseña cambiada con éxito.', {
            variant: 'success',
            appendToast: true,
            solid: true,
          });
        return true;
      } else {
        window &&
          window.$nuxt.$bvToast.toast('Error al cambiar la contraseña.', {
            variant: 'danger',
            appendToast: true,
            solid: true,
          });
        return false;
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      return false;
    }
  },  
  async logout({ commit }) {
    commit('logout')
    await this.$router.push('/')
  },
  async checkToken( { commit }, { token }){
    try{
      return await UserService.checkToken(this.$axios, { token })
    }catch(e){
      console.log(e)
    }
  },
  async loadCurrentUser({ commit, state }) {
    const currentUser = await UserService.getMe(this.$axios)
    commit('setAuthenticated', { ...currentUser, token: state.token })
    return currentUser
  }
}

export const mutations = {
  setAuthenticated(state, { id, username, token, admin, rolesExp = [], permissions = [], accessSource = 'legacy' }) {
    state.id = id
    state.username = username
    state.token = token
    state.admin = admin
    state.rolesExp = rolesExp
    state.permissions = permissions
    state.accessSource = accessSource

    // localStorage.setItem('userAdmin', JSON.stringify(admin))
    if (process.client) {
      localStorage.setItem('userId', id)
      localStorage.setItem('username', username)
      localStorage.setItem('userToken', token)
      localStorage.setItem('userAdmin', admin)
      localStorage.setItem('userRolesExp', JSON.stringify(rolesExp))
      localStorage.setItem('userPermissions', JSON.stringify(permissions))
      localStorage.setItem('userAccessSource', accessSource)

    }
  },
  logout(state) {
    state.id = null
    state.username = null
    state.token = null
    state.admin = null
    state.rolesExp = []
    state.permissions = []
    state.accessSource = 'legacy'
    if (process.client) {
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      localStorage.removeItem('userToken')
      localStorage.removeItem('userAdmin')
      localStorage.removeItem('userRolesExp')
      localStorage.removeItem('userPermissions')
      localStorage.removeItem('userAccessSource')
    }
  },
}
