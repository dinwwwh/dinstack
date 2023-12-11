'use client'

import { useIsRendered } from '@dinstack/ui/hooks/use-is-rendered'
import { authAtom, stateAtom } from '@web/atoms/auth'
import { LoginScreen } from '@web/components/login-screen'
import { api } from '@web/lib/api'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

export default function Page() {
  const router = useRouter()
  const [, setAuth] = useAtom(authAtom)
  const [oldState, setOldState] = useAtom(stateAtom)
  const isRendered = useIsRendered()

  const navigateToPreviousPage = useCallback(() => {
    // TODO: implement it
    router.push('/dash')
  }, [router])

  const searchParams = useSearchParams()
  const mutation = api.auth.github.validate.useMutation({
    onSuccess(data) {
      setAuth(data.auth)
      navigateToPreviousPage()
    },
    onSettled() {
      setOldState(RESET)
    },
  })

  useEffect(() => {
    if (!isRendered) return

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!state || !code || state !== oldState) {
      throw new Error('This page should not be accessed directly')
    }

    mutation.mutate({
      code,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRendered])

  return (
    <div className="fixed inset-0 z-50">
      <LoginScreen isLoadingGithub={mutation.isLoading} />
    </div>
  )
}
