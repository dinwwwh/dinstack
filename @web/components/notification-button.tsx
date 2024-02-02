import { Button } from './ui/button'
import { useAuth } from '@clerk/clerk-react'
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationFeedPopover,
  NotificationCell,
} from '@knocklabs/react'
import { env } from '@web/lib/env'
import { cn } from '@web/lib/utils'
import { BellIcon } from 'lucide-react'
import { useState, useRef } from 'react'

type Props = {
  buttonProps?: React.ComponentPropsWithoutRef<typeof Button>
  iconProps?: {
    className?: string
  }
}

export function NotificationButton({ buttonProps, iconProps }: Props) {
  const auth = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  if (!auth.userId) {
    throw new Error('Require user to be authenticated')
  }

  return (
    <KnockProvider
      apiKey={env.KNOCK_PUBLIC_API_KEY}
      userId={auth.userId}
      // In production, you must pass a signed userToken
      // and enable enhanced security mode in your Knock dashboard
      // userToken={currentUser.knockUserToken}
    >
      <KnockFeedProvider feedId={env.KNOCK_FEED_CHANNEL_ID}>
        <div>
          <Button
            {...buttonProps}
            ref={buttonRef}
            type="button"
            onClick={() => setIsVisible(!isVisible)}
          >
            <span className="sr-only">Notifications</span>
            <BellIcon className={cn('size-5', iconProps?.className)} />
          </Button>
          <NotificationFeedPopover
            buttonRef={buttonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        </div>
      </KnockFeedProvider>
    </KnockProvider>
  )
}
