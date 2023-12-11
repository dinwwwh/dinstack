'use client'

import { authAtom, codeVerifierAtom, stateAtom } from '@web/atoms/auth'
import { LoginScreen } from '@web/components/login-screen'
import { api } from '@web/lib/api'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

export default function Page() {
  const router = useRouter()
  const [auth, setAuth] = useAtom(authAtom)
  const [oldState, setOldState] = useAtom(stateAtom)
  const [codeVerifier, setCodeVerifier] = useAtom(codeVerifierAtom)

  const navigateToPreviousPage = useCallback(() => {
    // TODO: implement it and prevent duplicate
    router.push('/dash')
  }, [router])

  const searchParams = useSearchParams()
  const mutation = api.auth.google.validate.useMutation({
    onSuccess(data) {
      if (!auth.user) {
        setAuth(data.auth)
        navigateToPreviousPage()
      }

      navigateToPreviousPage()
    },
    onSettled() {
      setOldState(RESET)
      setCodeVerifier(RESET)
    },
  })

  useEffect(() => {
    if (auth.user) {
      return navigateToPreviousPage()
    }

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!state || !code || !codeVerifier || state !== oldState) {
      throw new Error('This page should not be accessed directly')
    }

    mutation.mutate({
      code,
      codeVerifier,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-50">
      <LoginScreen isLoadingGoogle={mutation.isLoading} />
    </div>
  )
}
