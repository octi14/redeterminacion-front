export default function ({ store, redirect }) {
  const legacyAdmin = ['admin', 'master', true, 'true'].includes(store.state.user.admin)
  const permissions = store.state.user.permissions || []
  const canAccess = legacyAdmin ||
    permissions.includes('*') ||
    permissions.includes('abiertoAnual.admin')

  if (!canAccess) {
    return redirect('/')
  }
}
