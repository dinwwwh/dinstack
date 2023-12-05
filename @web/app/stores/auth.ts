import { parseJWT } from 'oslo/jwt'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  id: string
  name: string
  avatarUrl: string
  email: string
}

type Authed = {
  user: User
  jwt: string
}

type Unauthed = {
  user: null
  jwt: null
  setAuth: (authed: { user: User; jwt: string }) => void
}

export const useAuthStore = create(
  persist<
    (Authed | Unauthed) & {
      reset: () => void
    }
  >(
    (set) => ({
      user: null,
      jwt: null,
      setAuth(auth) {
        set(() => auth)
      },
      reset() {
        set(() => ({ user: null, jwt: null }))
      },
    }),
    {
      name: 'auth-store',
      version: 0,
      onRehydrateStorage: () => {
        return (state) => {
          if (!state || !state.jwt) return

          try {
            const jwt = parseJWT(state.jwt)

            if (!jwt?.expiresAt || jwt.expiresAt.getTime() < Date.now() - 60 * 60 * 1000) {
              state.reset()
            }
          } catch {
            state.reset()
          }
        }
      },
    },
  ),
)

export function useUnauthedStore() {
  const auth = useAuthStore()
  if (auth.user) {
    throw new Error('Require session to be unauthenticated')
  }

  return auth
}

export function useAuthedStore() {
  const auth = useAuthStore()
  if (!auth.user) {
    throw new Error('Require session to be authenticated')
  }

  return auth
}
