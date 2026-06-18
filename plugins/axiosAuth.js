export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    const token = store.state.user && store.state.user.token
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  $axios.onError((error) => {
    const status = error.response && error.response.status
    const message = error.response && error.response.data && error.response.data.message
    const isStaleUserSession = status === 401 && message === 'Usuario no encontrado.'

    if (isStaleUserSession && store.state.user && store.state.user.token) {
      store.commit('user/logout')
    }

    return Promise.reject(error)
  })
}
