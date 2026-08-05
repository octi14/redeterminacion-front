const LEGACY_ROLE_PERMISSIONS = {
  admin: ['*'],
  master: [
    '*',
  ],
  true: [
    '*',
  ],
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)))
}

export default defineNuxtPlugin(() => {
  const permissionsForCurrentUser = () => {
    const user = useUserStore()
    return unique([
      ...(user.permissions || []),
      ...(LEGACY_ROLE_PERMISSIONS[user.admin] || []),
    ])
  }

  const can = (permission) => {
    const permissions = permissionsForCurrentUser()
    return permissions.includes('*') || permissions.includes(permission)
  }

  return { provide: { can, permissionsForCurrentUser } }
})
