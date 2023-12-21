import { sessionAtom } from '@web/atoms/auth'
import { useAtom } from 'jotai'

export function useOrganizationMember() {
  const [session] = useAtom(sessionAtom)

  return session?.organizationMember
}

export function useAuthenticatedOrganizationMember() {
  const organizationMember = useOrganizationMember()

  if (!organizationMember) {
    throw new Error('This page requires authentication')
  }

  return organizationMember
}
