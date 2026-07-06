import { getAuthToken } from '~/utils/auth-token.js'

/**
 * Convierte respuestas a objetos serializables (evita Object.create(null) en hidratación Pinia).
 */
export function toPlainData(value) {
  if (value === null || value === undefined) return value
  if (typeof value !== 'object') return value
  if (
    value instanceof Blob ||
    value instanceof ArrayBuffer ||
    value instanceof Date ||
    typeof value === 'function'
  ) {
    return value
  }
  try {
    return JSON.parse(JSON.stringify(value))
  } catch {
    return value
  }
}

/**
 * Cliente HTTP compatible con @nuxtjs/axios ($get, $post, get, post, params, responseType).
 * Los métodos $* devuelven el body HTTP directo (como @nuxtjs/axios). Los métodos get/post devuelven { data }.
 */
export function createApiClient(options = {}) {
  const getRuntimeConfig =
    options.getRuntimeConfig ??
    (() => {
      try {
        return useRuntimeConfig()
      } catch {
        return { public: { apiBase: 'https://redeterminacion-back.herokuapp.com/' } }
      }
    })

  const getToken = options.getToken ?? getAuthToken

  const authHeaders = () => {
    const headers = {}
    const token = getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    return headers
  }

  const normalizeOptions = (opts = {}) => {
    const { params, headers, responseType, ...rest } = opts
    const normalized = { ...rest }

    if (params && !normalized.query) {
      normalized.query = params
    }
    if (headers) {
      normalized.headers = { ...headers }
    }
    if (responseType === 'blob') {
      normalized.responseType = 'blob'
    }

    return normalized
  }

  const request = async (url, options = {}) => {
    const config = getRuntimeConfig()
    const normalized = normalizeOptions(options)
    const headers = {
      ...authHeaders(),
      ...normalized.headers,
    }

    try {
      const result = await $fetch(url, {
        baseURL: config.public.apiBase,
        ...normalized,
        headers,
      })
      if (normalized.responseType === 'blob') {
        return result
      }
      return toPlainData(result)
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

  const client = {
    setHeader() {},

    // $* devuelven el body HTTP tal cual (como @nuxtjs/axios). El backend usa { data: ... }.
    async $get(url, opts = {}) {
      return await request(url, { method: 'GET', ...normalizeOptions(opts) })
    },

    async $post(url, body, opts = {}) {
      return await request(url, { method: 'POST', body, ...normalizeOptions(opts) })
    },

    async $put(url, body, opts = {}) {
      return await request(url, { method: 'PUT', body, ...normalizeOptions(opts) })
    },

    async $delete(url, opts = {}) {
      return await request(url, { method: 'DELETE', ...normalizeOptions(opts) })
    },

    async get(url, opts = {}) {
      const data = await request(url, { method: 'GET', ...normalizeOptions(opts) })
      return { data }
    },

    async post(url, body, opts = {}) {
      const data = await request(url, { method: 'POST', body, ...normalizeOptions(opts) })
      return { data }
    },

    async put(url, body, opts = {}) {
      const data = await request(url, { method: 'PUT', body, ...normalizeOptions(opts) })
      return { data }
    },

    async delete(url, opts = {}) {
      const data = await request(url, { method: 'DELETE', ...normalizeOptions(opts) })
      return { data }
    },
  }

  return client
}
