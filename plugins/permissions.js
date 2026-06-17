const LEGACY_ROLE_PERMISSIONS = {
  master: [
    'users.read',
    'users.manage',
    'roles.read',
    'roles.manage',
  ],
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)))
}

export default ({ store }, inject) => {
  const permissionsForCurrentUser = () => {
    const user = store.state.user || {}
    return unique([
      ...(user.permissions || []),
      ...(LEGACY_ROLE_PERMISSIONS[user.admin] || []),
    ])
  }

  const can = (permission) => {
    const permissions = permissionsForCurrentUser()
    return permissions.includes('*') || permissions.includes(permission)
  }

  inject('can', can)
  inject('permissionsForCurrentUser', permissionsForCurrentUser)
}
