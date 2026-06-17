export default function ({ store, redirect }) {
  const permissions = store.state.user.permissions || []
  const canAccess = permissions.includes('*') ||
    permissions.includes('pagosDobles.read') ||
    permissions.includes('pagosDobles.update')

  if (!canAccess) {
    return redirect('/')
  }
}
