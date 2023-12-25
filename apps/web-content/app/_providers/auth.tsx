'use client'

import { api } from '@shared-react/lib/api'
import { sessionAtom } from '@web-content/atoms/auth'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session] = useAtom(sessionAtom)

  return (
    <>
      {session ? <SyncSession /> : null}
      {children}
    </>
  )
}

export function SyncSession() {
  const [, setSession] = useAtom(sessionAtom)
  const query = api.auth.infos.useQuery()

  useEffect(() => {
    if (query.status !== 'success') return

    setSession(query.data.session)
  }, [query.data, query.status, setSession])

  return null
}
