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
  roles: user.roles || [],
  permissions: user.permissions || [],
  accessSource: user.accessSource,
})

const RbacService = {
  getUsers: async (axios) => {
    const response = await axios.$get('/rbac/users')
    return response.data.map(formatUser)
  },

  getRoles: async (axios) => {
    const response = await axios.$get('/rbac/roles')
    return response.data.map(formatRole)
  },

  getPermissions: async (axios) => {
    const response = await axios.$get('/rbac/permissions')
    return response.data
  },

  saveRole: async (axios, role) => {
    const response = await axios.$post('/rbac/roles', role)
    return formatRole(response.data)
  },

  assignRole: async (axios, userId, roleKey) => {
    const response = await axios.$post(`/rbac/users/${userId}/roles`, { roleKey })
    return response.data
  },

  removeRole: async (axios, userId, roleKey) => {
    const response = await axios.$delete(`/rbac/users/${userId}/roles/${roleKey}`)
    return response.data
  },
}

export default RbacService
