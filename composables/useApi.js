/**
 * Cliente HTTP compatible con la API de @nuxtjs/axios usada en service/*.js
 * ($get, $post, get, post, setHeader).
 */
export function useApi() {
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  const authHeaders = () => {
    const headers = {}
    if (userStore.token) {
      headers.Authorization = `Bearer ${userStore.token}`
    }
    return headers
  }

  const request = async (url, options = {}) => {
    try {
      return await $fetch(url, {
        baseURL: config.public.apiBase,
        headers: {
          ...authHeaders(),
          ...options.headers,
        },
        ...options,
      })
    } catch (error) {
      const status = error.statusCode ?? error.status
      if (status && !error.response) {
        error.response = {
          status,
          data: error.data,
        }
      }
      throw error
    }
  }

  return {
    setHeader() {},

    async $get(url, opts = {}) {
      return await request(url, { method: 'GET', ...opts })
    },

    async $post(url, body, opts = {}) {
      return await request(url, { method: 'POST', body, ...opts })
    },

    async get(url, opts = {}) {
      const data = await request(url, { method: 'GET', ...opts })
      return { data }
    },

    async post(url, body, opts = {}) {
      const data = await request(url, { method: 'POST', body, ...opts })
      return { data }
    },

    async put(url, body, opts = {}) {
      const data = await request(url, { method: 'PUT', body, ...opts })
      return { data }
    },

    async delete(url, opts = {}) {
      const data = await request(url, { method: 'DELETE', ...opts })
      return { data }
    },

    async $put(url, body, opts = {}) {
      return await request(url, { method: 'PUT', body, ...opts })
    },

    async $delete(url, opts = {}) {
      return await request(url, { method: 'DELETE', ...opts })
    },
  }
}
