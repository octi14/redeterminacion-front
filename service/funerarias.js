import { unwrapData } from '~/utils/cementerio.js'

const formatFuneraria = (item = {}) => ({
  id: item.id || item._id,
  nombre: item.nombre || '',
  cuit: item.cuit || '',
  responsable: item.responsable || '',
  telefono: item.telefono || '',
  mail: item.mail || '',
  activa: item.activa !== false,
})

const formatUser = (item = {}) => ({
  id: item.id || item._id,
  username: item.username || '',
  admin: item.admin || '',
  funerariaId: item.funerariaId || '',
})

export default {
  getAll: async (axios) => {
    const response = await axios.$get('/cementerio/funerarias')
    return unwrapData(response).map(formatFuneraria)
  },

  getUsers: async (axios) => {
    const response = await axios.$get('/cementerio/funerarias/usuarios')
    return unwrapData(response).map(formatUser)
  },

  save: async (axios, funeraria) => {
    const id = funeraria.id
    const payload = { funeraria }
    const response = id
      ? await axios.$put(`/cementerio/funerarias/${id}`, payload)
      : await axios.$post('/cementerio/funerarias', payload)
    return formatFuneraria(unwrapData(response))
  },

  associateUser: async (axios, funerariaId, userId) => {
    const response = await axios.$put(`/cementerio/funerarias/${funerariaId}/usuarios/${userId}`)
    return formatUser(unwrapData(response))
  },
}
