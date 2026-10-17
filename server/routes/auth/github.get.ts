export default defineOAuthGitHubEventHandler({
  config: {
    scope: ['repo', 'user:email'],
    emailRequired: true
  },
  async onSuccess(event, { user, tokens }) {
    const accessToken = tokens.access_token
    if (!accessToken) {
      throw createError({ statusCode: 401, statusMessage: 'GitHub did not return an access token' })
    }

    await setUserSession(event, {
      user: {
        name: user.login,
        email: user.email ?? '',
        avatar: user.avatar_url
      },

      secure: {
        accessToken
      }
    })
    return sendRedirect(event, '/dashboard')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event) {
    return sendRedirect(event, '/dashboard')
  }
})
