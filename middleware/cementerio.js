export default function ({ store, redirect }) {
  const role = store.state.user.admin
  if (role && !['cementerio', 'master'].includes(role)) {
    return redirect('/')
  }
}
