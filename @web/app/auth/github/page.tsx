'use client'

import { LoginScreen } from '@web/components/login-screen'
import { api } from '@web/lib/api'
import { useAuthStore } from '@web/stores/auth'
import { useHistoryStore } from '@web/stores/history'
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
  const mutation = api.auth.github.validate.useMutation({
    onSuccess(data) {
      if (!auth.user) {
        auth.setAuth(data.auth)
        navigateToPreviousPage()
      }

      navigateToPreviousPage()
    },
    onSettled() {
      auth.setState(null)
    },
  })

  useEffect(() => {
    if (auth.user) {
      return navigateToPreviousPage()
    }

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!state || !code || state !== auth.state) {
      throw new Error('This page should not be accessed directly')
    }

    mutation.mutate({
      code,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-50">
      <LoginScreen isLoadingGithub={mutation.isLoading} />
    </div>
  )
}
