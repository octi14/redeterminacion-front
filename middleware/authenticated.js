export default defineNuxtRouteMiddleware(() => {
  const { $store } = useNuxtApp()
  if (!$store.state.user.token) {
    return navigateTo('/')
  }
})
