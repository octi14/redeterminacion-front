const formatProfile = ({
  _id: id = '',
  username = '',
}) => {
  return {
    id,
    username,
  }
}

const formatAuthenticatedUser = ({ _id: id, username, token, admin }) => {
  return {
    id,
    username,
    token,
    admin,
  }
}

module.exports = {
  authenticate: async (axios, { username, password }) => {
    axios.setHeader('Access-Control-Allow-Origin', true);

    try {
      const authenticateResponse = await axios.$post('/users/authenticate', {
        username,
        password,
      });

      return formatAuthenticatedUser(authenticateResponse.data);
    } catch (error) {
      if (error.response) {
        // Se recibió una respuesta del servidor con un código de estado
        if (error.response.status === 404) {
          // Usuario no encontrado
          throw new Error("Usuario no encontrado");
        } else if (error.response.status === 401) {
          // Contraseña incorrecta
          throw new Error("Contraseña incorrecta");
        }
      }

      // Otro error que no está relacionado con el código de estado
      throw new Error("Error de autenticación");
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
  // register: async (axios, { username, password }) => {
  //   const registerResponse = await axios.$post('/users/register', {
  //     username,
  //     password,
  //   })
  //   return registerResponse
  // },
}
