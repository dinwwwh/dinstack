'use client'

import { api } from '@web/lib/api'
import { useAuthStore } from '@web/stores/auth'
import { useEffect } from 'react'

export function AuthProvider(props: { children: React.ReactNode }) {
  const authStore = useAuthStore()

  return (
    <>
      {authStore.session ? <SyncAuth /> : null}
      {props.children}
    </>
  )
}

function SyncAuth() {
  const query = api.auth.infos.useQuery()

  useEffect(() => {
    if (query.status === 'error') {
      useAuthStore.setState({ session: null })
    }

    if (query.status === 'success') {
      useAuthStore.setState({ session: query.data.session })
    }
  }, [query.data, query.status])

  return null
}
