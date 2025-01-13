const UserService = require('../service/user')

export const state = () => ({
  username: null,
  id: null,
  token: null,
  admin: null,
})

export const actions = {
  async authenticate({ commit, dispatch }, { username, password }) {
    try {
      const authUser = await UserService.authenticate(this.$axios, {
        username,
        password,
      });
      const { id, token, admin } = authUser;
      // guardo el token y el username en state
      commit('setAuthenticated', { id, username, token, admin });
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
  }
}

export const mutations = {
  setAuthenticated(state, { id, username, token, admin }) {
    state.id = id
    state.username = username
    state.token = token
    state.admin = admin

    // localStorage.setItem('userAdmin', JSON.stringify(admin))
    if (process.client) {
      localStorage.setItem('userId', id)
      localStorage.setItem('username', username)
      localStorage.setItem('userToken', token)
      localStorage.setItem('userAdmin', admin)

    }
  },
  logout(state) {
    state.id = null
    state.username = null
    state.token = null
    state.admin = null
    if (process.client) {
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      localStorage.removeItem('userToken')
      localStorage.removeItem('userAdmin')
    }
  },
}
