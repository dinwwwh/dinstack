'use client'

import { oauthAccountProviders } from '@api/database/schema'
import { api } from '@web/lib/api'
import { oauthStateAtom, sessionSecretKeyAtom } from '@web/services/auth/atoms'
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
  const [sessionSecretKey, setSessionSecretKey] = useAtom(sessionSecretKeyAtom)
  const [state, setState] = useAtom(oauthStateAtom)
  const isRendered = useIsRendered()

  const searchParams = useSearchParams()
  const loginMutation = api.auth.oauth.login.useMutation({
    onSuccess(data) {
      setSessionSecretKey(data.sessionSecretKey)
    },
    onSettled() {
      setState(RESET)
      router.push(state?.authorizationRedirectUrl || '/dash')
    },
  })

  const connectMutation = api.auth.oauth.connect.useMutation({
    onSettled() {
      setState(RESET)
      router.push(state?.authorizationRedirectUrl || '/dash')
    },
  })

  useEffect(() => {
    if (!isRendered) return

    const code = searchParams.get('code')
    const urlState = searchParams.get('state')

    if (!state || !code || !state.codeVerifier || urlState !== state.state) {
      throw new Error('This page should not be accessed directly')
    }

    if (sessionSecretKey) {
      connectMutation.mutate({
        provider: param.provider,
        state: urlState,
        code,
        codeVerifier: state.codeVerifier,
      })
    } else {
      loginMutation.mutate({
        provider: param.provider,
        state: urlState,
        code,
        codeVerifier: state.codeVerifier,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRendered])

  return null
}
