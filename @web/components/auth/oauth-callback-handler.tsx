import type { OauthAccounts } from '@api/database/schema'
import { useEffectOnce } from '@web/hooks/use-effect-once'
import { api } from '@web/lib/api'
import { useAuthStore } from '@web/stores/auth'
import { useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

export function OauthCallbackHandler(props: {
  type: 'login' | 'connect'
  provider: (typeof OauthAccounts.$inferSelect)['provider']
  code: string
  state: string
}) {
  const navigate = useNavigate()
  const authStore = useAuthStore()

  const loginMutation = api.auth.oauth.login.useMutation({
    onSuccess(data) {
      useAuthStore.setState({ state: data.auth })
    },
    onSettled() {
      const url = authStore.oauthAuthorization?.redirectUrl
      useAuthStore.setState({ oauthAuthorization: null })
      if (!url) {
        navigate('/')
      } else {
        navigate(`${url.pathname}${url.search}${url.hash}`)
      }
    },
  })

  const connectMutation = api.auth.oauth.connect.useMutation({
    onSettled() {
      const url = authStore.oauthAuthorization?.redirectUrl
      useAuthStore.setState({ oauthAuthorization: null })
      if (!url) {
        navigate('/')
      } else {
        navigate(`${url.pathname}${url.search}${url.hash}`)
      }
    },
  })

  useEffectOnce(() => {
    if (
      !authStore.oauthAuthorization?.codeVerifier ||
      props.state !== authStore.oauthAuthorization.state
    ) {
      throw new Error('This page should not be accessed directly')
    }

    const codeVerifier = authStore.oauthAuthorization.codeVerifier

    match(props.type)
      .with('login', () => {
        loginMutation.mutate({
          provider: props.provider,
          code: props.code,
          state: props.state,
          codeVerifier,
        })
      })
      .with('connect', () => {
        connectMutation.mutate({
          provider: props.provider,
          code: props.code,
          state: props.state,
          codeVerifier,
        })
      })
      .exhaustive()
  })

  return null
}
