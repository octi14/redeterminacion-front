const UserService = require('../service/user')

export const state = () => ({
  username: null,
  id: null,
  token: null,
})

export const actions = {
  async authenticate({ commit, dispatch }, { username, password }) {
    try {
      const authUser = await UserService.authenticate(this.$axios, {
        username,
        password,
      })
      const { id, token } = authUser
      // guardo el token y el username en state
      commit('setAuthenticated', { id, username, token })
      // dispatch('myFavRecipes', { userToken: token })
      window &&
        window.$nuxt.$bvToast.toast('Ingreso exitoso.', {
          // title: '',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
    } catch (e) {
      window &&
        window.$nuxt.$bvToast.toast('Error iniciando sesión', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      //commit('logout')
    }

    await this.$router.push('/')
  },
  async register({ dispatch }, { email, password }) {
    // TODO: add loading
    try {
      const registerResponse = await UserService.register(this.$axios, {
        username,
        password,
      })
      if (registerResponse.message === 'Created') {
        dispatch('authenticate', {
          email,
          password,
        })
      }
    } catch (e) {
      throw new Error('Error registrando usuario')
    }
  },
  async logout({ commit }) {
    commit('logout')
    await this.$router.push('/')
  },
}

export const mutations = {
  setAuthenticated(state, { id, username, token }) {
    state.id = id
    state.username = username
    state.token = token

    if (process.client) {
      localStorage.setItem('userId', id)
      localStorage.setItem('username', username)
      localStorage.setItem('userToken', token)
    }
  },
  logout(state) {
    state.id = null
    state.username = null
    state.token = null
    if (process.client) {
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      localStorage.removeItem('userToken')
    }
  },
}
