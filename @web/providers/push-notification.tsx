import { useNotificationPermission } from '@web/hooks/use-notification-permission'
import { api } from '@web/lib/api'
import { onSWMessage, postMessageToSW } from '@web/lib/message/window'
import { useAuthStore } from '@web/stores/auth'
import { useEffect } from 'react'
import { P, match } from 'ts-pattern'

export function PushNotificationProvider(props: { children: React.ReactNode }) {
  const useId = useAuthStore().state?.user.id
  const { permission } = useNotificationPermission()

  const mutation = api.auth.notification.push.register.useMutation()

  // TODO: optimize it
  useEffect(() => {
    match(permission)
      .with(P.union('default', 'denied'), () => {
        mutation.mutate({
          subscription: null,
        })
      })
      .with('granted', () => {
        postMessageToSW('subscribePushNotification', {})
      })
      .exhaustive()
  }, [mutation, permission, useId])

  useEffect(() => {
    return onSWMessage('handlePushSubscription', async (data) => {
      mutation.mutate({
        subscription: data.subscription,
      })
    })
  }, [mutation])

  return props.children
}
