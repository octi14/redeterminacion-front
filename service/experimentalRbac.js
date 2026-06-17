const formatRole = (role) => ({
  id: role._id,
  key: role.key,
  name: role.name,
  description: role.description,
  permissions: role.permissions || [],
  active: role.active,
})

const formatUser = (user) => ({
  id: user.id || user._id,
  username: user.username,
  admin: user.admin,
  rolesExp: user.rolesExp || [],
  permissions: user.permissions || [],
  accessSource: user.accessSource,
})

module.exports = {
  getUsers: async (axios) => {
    const response = await axios.$get('/experimental-rbac/users')
    return response.data.map(formatUser)
  },

  getRoles: async (axios) => {
    const response = await axios.$get('/experimental-rbac/roles')
    return response.data.map(formatRole)
  },

  getPermissions: async (axios) => {
    const response = await axios.$get('/experimental-rbac/permissions')
    return response.data
  },

  saveRole: async (axios, role) => {
    const response = await axios.$post('/experimental-rbac/roles', role)
    return formatRole(response.data)
  },

  assignRole: async (axios, userId, roleKey) => {
    const response = await axios.$post(`/experimental-rbac/users/${userId}/roles`, { roleKey })
    return response.data
  },

  removeRole: async (axios, userId, roleKey) => {
    const response = await axios.$delete(`/experimental-rbac/users/${userId}/roles/${roleKey}`)
    return response.data
  },
}
