'use client'

import { oauthAccountProviders } from '@api/database/schema'
import { codeVerifierAtom, authAtom, stateAtom, loginRequestFromAtom } from '@web/atoms/auth'
import { api } from '@web/lib/api'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { z } from 'zod'
import { useIsRendered } from '@ui/hooks/use-is-rendered'

export function CallbackHandler() {
  const router = useRouter()
  const param = z
    .object({
      provider: z.enum(oauthAccountProviders.enumValues),
    })
    .parse(useParams())
  const [auth, setAuth] = useAtom(authAtom)
  const [oldState, setOldState] = useAtom(stateAtom)
  const [codeVerifier, setCodeVerifier] = useAtom(codeVerifierAtom)
  const [loginRequestFrom] = useAtom(loginRequestFromAtom)
  const isRendered = useIsRendered()

  const searchParams = useSearchParams()
  const loginMutation = api.auth.oauth.login.useMutation({
    onSuccess(data) {
      setAuth(data.auth)
    },
    onSettled() {
      setOldState(RESET)
      setCodeVerifier(RESET)
      router.push(`${loginRequestFrom.pathname}?${loginRequestFrom.searchParams}`)
    },
  })

  const connectMutation = api.auth.oauth.connect.useMutation({
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

    if (auth) {
      connectMutation.mutate({
        provider: param.provider,
        state,
        code,
        codeVerifier,
      })
    } else {
      loginMutation.mutate({
        provider: param.provider,
        state,
        code,
        codeVerifier,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRendered])

  return null
}
