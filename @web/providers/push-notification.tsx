import { useNotificationPermission } from '@web/hooks/use-notification-permission'
import { api } from '@web/lib/api'
import { onSWMessage, postMessageToSW } from '@web/lib/message/window'
import { useAuthStore } from '@web/stores/auth'
import { useEffect } from 'react'
import { P, match } from 'ts-pattern'

export function PushNotificationProvider(props: { children: React.ReactNode }) {
  const userId = useAuthStore().state?.session.userId
  const registeredPushNotification = !!useAuthStore().state?.session.pushSubscription
  const { permission } = useNotificationPermission()
  const { mutate } = api.auth.notification.push.register.useMutation()

  useEffect(() => {
    if (!userId) return

    return match(permission)
      .with(P.union('default', 'denied'), () => {
        if (!registeredPushNotification) return

        mutate({
          subscription: null,
        })
      })
      .with('granted', () => {
        if (registeredPushNotification) return

        const unsub = onSWMessage('handlePushSubscription', async (data) => {
          mutate({
            subscription: data.subscription,
          })
        })

        postMessageToSW('subscribePushNotification', {})

        return unsub
      })
      .exhaustive()
  }, [mutate, permission, userId, registeredPushNotification])

  return props.children
}
