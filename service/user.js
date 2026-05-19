const formatProfile = ({
  _id: id = '',
  username = '',
}) => {
  return {
    id,
    username,
  }
}

const formatAuthenticatedUser = (user = {}) => {
  return {
    id: user._id ?? user.id ?? '',
    username: user.username ?? '',
    token: user.token ?? '',
    admin: user.admin ?? '',
  }
}

export default {
  authenticate: async (axios, { username, password }) => {
    axios.setHeader('Access-Control-Allow-Origin', true);

    try {
      const authenticateResponse = await axios.$post('/users/authenticate', {
        username,
        password,
      });

      const payload = authenticateResponse?.data ?? authenticateResponse
      return formatAuthenticatedUser(payload)
    } catch (error) {
      const status = error.response?.status ?? error.statusCode ?? error.status
      const message = error.response?.data?.message ?? error.data?.message

      if (message) {
        throw new Error(message)
      }
      if (status === 404) {
        throw new Error('Usuario no encontrado')
      }
      if (status === 401) {
        throw new Error('Contraseña incorrecta')
      }
      throw new Error('Error de autenticación')
    }
  },

  changePassword: async (axios, { userId,oldPassword, newPassword }) => {
    try {
      const response = await axios.$post('/users/changePassword', {
        userId,
        oldPassword,
        newPassword,
      });

      return true
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      return false
    }
  },

  checkToken: async (axios, { token }) => {
    axios.setHeader('Access-Control-Allow-Origin', true)
    const response = await axios.$post('/users/verify', {
      token,
    })
    return response.data
  },

  getAll: async (axios) => {
    try {
      axios.setHeader('Access-Control-Allow-Origin', true)
      const response = await axios.$get('/users')
      return response.data.map(user => ({
        id: user._id,
        username: user.username,
        admin: user.admin
      }))
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      return []
    }
  },
  // register: async (axios, { username, password }) => {
  //   const registerResponse = await axios.$post('/users/register', {
  //     username,
  //     password,
  //   })
  //   return registerResponse
  // },
}

