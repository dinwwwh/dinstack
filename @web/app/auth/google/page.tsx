'use client'

import { codeVerifierAtom, authAtom, stateAtom, loginRequestFromAtom } from '@web/atoms/auth'
import { LoginScreen } from '@web/components/login-screen'
import { api } from '@web/lib/api'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useIsRendered } from '@ui/hooks/use-is-rendered'

export default function Page() {
  const router = useRouter()
  const [, setAuth] = useAtom(authAtom)
  const [oldState, setOldState] = useAtom(stateAtom)
  const [codeVerifier, setCodeVerifier] = useAtom(codeVerifierAtom)
  const [loginRequestFrom] = useAtom(loginRequestFromAtom)
  const isRendered = useIsRendered()

  const searchParams = useSearchParams()
  const mutation = api.auth.google.validate.useMutation({
    onSuccess(data) {
      setAuth(data.auth)
    },
    onSettled() {
      setOldState(RESET)
      setCodeVerifier(RESET)
      router.push(`${loginRequestFrom.pathname}?${loginRequestFrom.searchParams}`)
    },
  })

  useEffect(() => {
    if (!isRendered) return

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
  }, [isRendered])

  return (
    <div className="fixed inset-0 z-50">
      <LoginScreen isLoadingGoogle={mutation.isLoading} />
    </div>
  )
}
