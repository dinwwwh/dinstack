'use client'

import { oauthAccountProviders } from '@db/schema'
import { useIsRendered } from '@ui/hooks/use-is-rendered'
import {
  codeVerifierAtom,
  sessionAtom,
  stateAtom,
  loginRequestFromAtom,
} from '@web-content/atoms/auth'
import { api } from '@web-content/lib/api'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { z } from 'zod'

export function CallbackHandler() {
  const router = useRouter()
  const param = z
    .object({
      provider: z.enum(oauthAccountProviders.enumValues),
    })
    .parse(useParams())
  const [session, setSession] = useAtom(sessionAtom)
  const [oldState, setOldState] = useAtom(stateAtom)
  const [codeVerifier, setCodeVerifier] = useAtom(codeVerifierAtom)
  const [loginRequestFrom] = useAtom(loginRequestFromAtom)
  const isRendered = useIsRendered()

  const searchParams = useSearchParams()
  const loginMutation = api.auth.oauth.login.useMutation({
    onSuccess(data) {
      setSession(data.session)
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

    if (session) {
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
