import { useUser } from '@clerk/clerk-react'
import { env } from '@web/lib/env'
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
  const { user } = useUser()
  const posthog = usePostHog()

  useEffect(() => {
    if (user) {
      posthog.identify(user.id, {
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
      })
    } else {
      posthog.reset()
    }
  }, [user, posthog])

  return null
}
