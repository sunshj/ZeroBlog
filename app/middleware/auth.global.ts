export default defineNuxtRouteMiddleware(to => {
  const { loggedIn } = useUserSession()

  if (loggedIn.value && to.path.startsWith('/dashboard/signin')) {
    return navigateTo('/dashboard')
  }

  if (
    !loggedIn.value &&
    to.path.startsWith('/dashboard') &&
    !to.path.startsWith('/dashboard/signin')
  ) {
    return navigateTo('/dashboard/signin')
  }
})
