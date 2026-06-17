export default function ({ store, redirect }) {
  const permissions = store.state.user.permissions || []
  const canAccess = permissions.includes('*') ||
    permissions.includes('cementerio.review')

  if (!canAccess) {
    return redirect('/')
  }
}
