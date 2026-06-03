import {
  getDefaultAbiertoAnualPeriodos,
  normalizeAbiertoAnualPeriodos,
} from '~/utils/abiertoAnualPeriodos'

export default {
  getAbiertoAnualPeriodos: async (axios) => {
    try {
      const data = await axios.$get('/config/abiertoAnualPeriodos')
      return normalizeAbiertoAnualPeriodos(data)
    } catch {
      return getDefaultAbiertoAnualPeriodos()
    }
  },
  getDefaultConfig: getDefaultAbiertoAnualPeriodos,
}
