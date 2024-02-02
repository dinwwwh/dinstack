import { useAuth } from '@clerk/clerk-react'
import { KnockFeedProvider, KnockProvider } from '@knocklabs/react'
import { env } from '@web/lib/env'

export function NotificationProvider(props: { children: React.ReactNode }) {
  const auth = useAuth()

  if (!auth.userId) return props.children

  return (
    <KnockProvider
      apiKey={env.KNOCK_PUBLIC_API_KEY}
      userId={auth.userId}
      // In production, you must pass a signed userToken
      // and enable enhanced security mode in your Knock dashboard
      // userToken={currentUser.knockUserToken}
    >
      <KnockFeedProvider feedId={env.KNOCK_FEED_CHANNEL_ID}>
        <>{props.children}</>
      </KnockFeedProvider>
    </KnockProvider>
  )
}
