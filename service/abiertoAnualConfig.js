import { getDefaultAbiertoAnualPeriodos } from '~/utils/abiertoAnualPeriodos'

export default {
  getAbiertoAnualPeriodos: async (axios) => {
    try {
      return await axios.$get('/config/abiertoAnualPeriodos')
    } catch {
      return getDefaultAbiertoAnualPeriodos()
    }
  },
  updateAbiertoAnualPeriodos: async (axios, config) => {
    const response = await axios.$put('/config/abiertoAnualPeriodos', config)
    return response?.data ?? response
  },
  getDefaultConfig: getDefaultAbiertoAnualPeriodos,
}
