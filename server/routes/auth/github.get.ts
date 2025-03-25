export default defineOAuthGitHubEventHandler({
  config: {
    scope: ['repo', 'user:email'],
    emailRequired: true
  },
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user: {
        name: user.login,
        email: user.email,
        avatar: user.avatar_url
      },

      secure: {
        accessToken: tokens.access_token
      }
    })
    return sendRedirect(event, '/dashboard')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/dashboard')
  }
})
