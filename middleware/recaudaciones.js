export default function ({ store, redirect }) {
  const legacyAdmin = ['admin', 'master', true, 'true'].includes(store.state.user.admin)
  const permissions = store.state.user.permissions || []
  const canAccess = legacyAdmin ||
    permissions.includes('*') ||
    permissions.includes('pagosDobles.read') ||
    permissions.includes('pagosDobles.update')

  if (!canAccess) {
    return redirect('/')
  }
}
