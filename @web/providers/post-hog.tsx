import { env } from '@web/lib/env'
import { useAuthStore } from '@web/stores/auth'
import { PostHogProvider as Base, usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <Base
      apiKey={env.POSTHOG_API_KEY}
      options={{
        api_host: env.POSTHOG_HOST,
        disable_session_recording: true,
        session_recording: {
          maskNetworkRequestFn: (request) => {
            request.url = request.url.split('?')[0]!
            return request
          },
        },
      }}
    >
      <IdentifyUser />
      {children}
    </Base>
  )
}

function IdentifyUser() {
  const auth = useAuthStore()
  const posthog = usePostHog()

  useEffect(() => {
    if (auth.state) {
      posthog.identify(auth.state.user.id, {
        name: auth.state.user.name,
        email: auth.state.user.email,
      })
    } else {
      posthog.reset()
    }
  }, [auth, posthog])

  return null
}
