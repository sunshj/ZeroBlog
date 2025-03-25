declare module '#auth-utils' {
  interface User {
    name: string
    email: string
    avatar: string
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    accessToken: string
  }
}

export {}
