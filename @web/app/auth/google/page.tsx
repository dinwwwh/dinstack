'use client'

import { useAuthStore, useUnauthedStore } from '@web/app/stores/auth'
import { LoginScreen } from '@web/components/login-screen'
import { api } from '@web/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const navigateToPreviousPage = () => {
    // TODO:
    router.push('/')
  }

  const auth = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const mutation = api.auth.google.validate.useMutation({
    onSuccess(data) {
      if (!auth.user) {
        auth.setAuth(data.auth)
      }
      navigateToPreviousPage()
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
  }, [])

  return (
    <div className="fixed inset-0 z-50">
      <LoginScreen isLoadingGoogle={mutation.isLoading} />
    </div>
  )
}
