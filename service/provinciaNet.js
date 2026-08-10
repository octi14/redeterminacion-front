const createPreorder = async (axios, body) => {
  return await axios.$post('/pagos/provincia-net/preorder', body)
}

const getEstado = async (axios, uuid) => {
  return await axios.$get(`/pagos/provincia-net/estado/${encodeURIComponent(uuid)}`)
}

export default {
  createPreorder,
  getEstado,
}
