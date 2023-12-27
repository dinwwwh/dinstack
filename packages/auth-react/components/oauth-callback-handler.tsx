import { useAuthStore } from '@auth-react/stores/auth'
import type { OauthAccounts } from '@db/schema'
import { useEffectOnce } from '@shared-react/hooks/use-effect-once'
import { api } from '@shared-react/lib/api'
import { match } from 'ts-pattern'

export function OauthCallbackHandler(props: {
  type: 'login' | 'connect'
  provider: (typeof OauthAccounts.$inferSelect)['provider']
  code: string
  state: string
  handleRedirect: (url: URL | undefined) => void
}) {
  const authStore = useAuthStore()

  const loginMutation = api.auth.oauth.login.useMutation({
    onSuccess(data) {
      useAuthStore.setState({ session: data.session })
    },
    onSettled() {
      props.handleRedirect(authStore.oauthAuthorization?.redirectUrl)
    },
  })

  const connectMutation = api.auth.oauth.connect.useMutation({
    onSettled() {
      props.handleRedirect(authStore.oauthAuthorization?.redirectUrl)
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
