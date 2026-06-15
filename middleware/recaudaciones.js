export default function ({ store, redirect }) {
  const role = store.state.user.admin
  if (role && !['recaudaciones', 'master'].includes(role)) {
    return redirect('/')
  }
}
