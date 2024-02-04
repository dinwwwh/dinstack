import { useAuth } from '@clerk/clerk-react'
import { NotificationFeedPopover, NotificationIconButton } from '@knocklabs/react'
import { KnockFeedProvider, KnockProvider } from '@knocklabs/react'
import * as Portal from '@radix-ui/react-portal'
import { env } from '@web/lib/env'
import { Loader2Icon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function NotificationButton() {
  const auth = useAuth()
  const [userToken, setUserToken] = useState<string | null>(null)

  useEffect(() => {
    auth.getToken({ template: 'knock' }).then((token) => {
      setUserToken(token)
    })
  }, [JSON.stringify(auth)])

  if (!auth.isSignedIn || !userToken)
    return (
      <button type="button" className="rnf-notification-icon-button animate-spin">
        <Loader2Icon />
      </button>
    )

  return (
    <KnockProvider apiKey={env.KNOCK_PUBLIC_API_KEY} userId={auth.userId} userToken={userToken}>
      <KnockFeedProvider feedId={env.KNOCK_FEED_CHANNEL_ID}>
        <>
          <FeedPopoverButton />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  )
}

function FeedPopoverButton() {
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <NotificationIconButton ref={buttonRef} onClick={() => setIsVisible(!isVisible)} />
      <Portal.Root>
        <NotificationFeedPopover
          buttonRef={buttonRef}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      </Portal.Root>
    </>
  )
}
