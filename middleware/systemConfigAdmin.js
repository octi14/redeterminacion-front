export default function ({ store, redirect }) {
  const permissions = store.state.user.permissions || []
  const canAccess = permissions.includes('*') ||
    permissions.includes('system.config.admin')

  if (!canAccess) {
    return redirect('/')
  }
}
