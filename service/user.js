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
    axios.setHeader('Access-Control-Allow-Origin', true)
    const authenticateResponse = await axios.$post('/users/authenticate', {
      username,
      password,
    })
    return formatAuthenticatedUser(authenticateResponse.data)
  },

  checkToken: async (axios, { token }) => {
    axios.setHeader('Access-Control-Allow-Origin', true)
    const response = await axios.$post('/users/verify', {
      token,
    })
    console.log(response.data)
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
