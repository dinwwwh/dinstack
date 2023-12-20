import { sessionAtom } from '@web/atoms/auth'
import { useAtom } from 'jotai'

export function useUser() {
  const [session] = useAtom(sessionAtom)

  return session?.organizationMember.user
}

export function useAuthenticatedUser() {
  const user = useUser()

  if (!user) {
    throw new Error('This page requires authentication')
  }

  return user
}
