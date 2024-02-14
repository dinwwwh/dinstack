import { useAuth } from '@clerk/clerk-react'
import type { FeedItem } from '@knocklabs/client'
import { NotificationFeedPopover, NotificationIconButton } from '@knocklabs/react'
import { KnockFeedProvider, KnockProvider } from '@knocklabs/react'
import { useKnockFeed } from '@knocklabs/react'
import * as Portal from '@radix-ui/react-portal'
import { env } from '@web/lib/env'
import { useSystemStore } from '@web/stores/system'
import { Loader2Icon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { match } from 'ts-pattern'

export function NotificationButton() {
  const auth = useAuth()
  const [userToken, setUserToken] = useState<string | null>(null)
  const theme = match(useSystemStore().theme)
    .with('light', () => 'light' as const)
    .with('dark', () => 'dark' as const)
    .with('system', () =>
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ('dark' as const)
        : ('light' as const),
    )
    .exhaustive()

  useEffect(() => {
    auth.getToken({ template: 'knock' }).then((token) => {
      setUserToken(token)
    })
  }, [auth])

  if (!auth.isSignedIn || !userToken)
    return (
      <button type="button" className="rnf-notification-icon-button animate-spin">
        <Loader2Icon />
      </button>
    )

  return (
    <KnockProvider apiKey={env.KNOCK_PUBLIC_API_KEY} userId={auth.userId} userToken={userToken}>
      <KnockFeedProvider feedId={env.KNOCK_FEED_CHANNEL_ID} colorMode={theme}>
        <>
          <FeedPopoverButton />
          <NotificationToaster />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  )
}

function FeedPopoverButton() {
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  return (
    <>
      <NotificationIconButton ref={buttonRef} onClick={() => setIsVisible(!isVisible)} />
      <Portal.Root>
        <NotificationFeedPopover
          buttonRef={buttonRef}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
          onNotificationClick={(e) => {
            const actionUrl =
              (e.data?.action_url as string | undefined) ??
              e.blocks.find((b) => b.name === 'action_url')?.rendered

            if (actionUrl) {
              const url = new URL(actionUrl)

              if (url.origin === window.location.origin) {
                navigate(actionUrl.replace(url.origin, ''))
              } else {
                window.location.href = actionUrl
              }
            }
          }}
        />
      </Portal.Root>
    </>
  )
}

function NotificationToaster() {
  const { feedClient } = useKnockFeed()
  const navigate = useNavigate()

  useEffect(() => {
    const onNotificationsReceived = ({ items }: { items: FeedItem[] }) => {
      items.forEach((notification) => {
        const id = `notification:${notification.id}`
        const html =
          notification.blocks.find((b) => b.name === 'body')?.rendered ??
          'You have a new notification!'
        const actionUrl =
          (notification.data?.action_url as string | undefined) ??
          notification.blocks.find((b) => b.name === 'action_url')?.rendered

        toast(
          <div className="flex justify-between w-full gap-1 items-center">
            <div
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
            {actionUrl ? (
              <button
                type="button"
                data-button=""
                className="group-[.toast]:bg-primary group-[.toast]:text-primary-foreground"
                onClick={() => {
                  toast.dismiss(id)
                  const url = new URL(actionUrl)
                  feedClient.markAsSeen(notification)
                  feedClient.markAsRead(notification)

                  if (url.origin === window.location.origin) {
                    navigate(actionUrl.replace(url.origin, ''))
                  } else {
                    window.location.href = actionUrl
                  }
                }}
              >
                View
              </button>
            ) : (
              <button
                type="button"
                data-button=""
                className="group-[.toast]:bg-primary group-[.toast]:text-primary-foreground"
                onClick={() => {
                  toast.dismiss(id)
                  feedClient.markAsSeen(notification)
                  feedClient.markAsRead(notification)
                }}
              >
                Dismiss
              </button>
            )}
          </div>,
          {
            id,
          },
        )
      })
    }

    feedClient.on('items.received.realtime', onNotificationsReceived)

    return () => feedClient.off('items.received.realtime', onNotificationsReceived)
  }, [feedClient, navigate])

  return null
}
