'use client'

import { useAuthStore } from '@web/app/stores/auth'
import { useHistoryStore } from '@web/app/stores/history'
import { LoginScreen } from '@web/components/login-screen'
import { api } from '@web/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

export default function Page() {
  const historyStore = useHistoryStore()
  const router = useRouter()

  const navigateToPreviousPage = useCallback(() => {
    if (historyStore.previousPathname && !historyStore.previousPathname.includes('/auth')) {
      router.push(`${historyStore.previousPathname}?${historyStore.previousSearchParams}`)
    } else {
      router.push('/dash')
    }
  }, [historyStore, router])

  const auth = useAuthStore()
  const searchParams = useSearchParams()
  const mutation = api.auth.google.validate.useMutation({
    onSuccess(data) {
      if (!auth.user) {
        auth.setAuth(data.auth)
        navigateToPreviousPage()
      }

      navigateToPreviousPage()
    },
    onSettled() {
      auth.setState(null)
      auth.setCodeVerifier(null)
    },
  })

  useEffect(() => {
    if (auth.user) {
      return navigateToPreviousPage()
    }

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const codeVerifier = auth.codeVerifier

    if (!state || !code || !codeVerifier || state !== auth.state) {
      throw new Error('This page should not be accessed directly')
    }

    mutation.mutate({
      code,
      codeVerifier,
    })
  }, [auth, mutation, navigateToPreviousPage, searchParams])

  return (
    <div className="fixed inset-0 z-50">
      <LoginScreen isLoadingGoogle={mutation.isLoading} />
    </div>
  )
}
