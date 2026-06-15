export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    const token = store.state.user && store.state.user.token
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
}
