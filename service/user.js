const formatProfile = ({
  _id: id = '',
  username = '',
}) => {
  return {
    id,
    username,
  }
}

const formatAuthenticatedUser = ({ _id: id, token }) => {
  return {
    id,
    token,
  }
}

module.exports = {
  authenticate: async (axios, { username, password }) => {
    const authenticateResponse = await axios.$post('/users/authenticate', {
      username,
      password,
    })
    return formatAuthenticatedUser(authenticateResponse.data)
  },
  register: async (axios, { email, password }) => {
    const registerResponse = await axios.$post('/users/register', {
      email,
      password,
    })
    return registerResponse
  },
}
