export default function ({ store, redirect }) {
  const permissions = store.state.user.permissions || []
  const canAccess = permissions.includes('*') ||
    permissions.includes('cementerio.admin')

  if (!canAccess) {
    return redirect('/')
  }
}
