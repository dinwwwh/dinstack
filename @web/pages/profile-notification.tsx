import { PushNotificationPermissionRequest } from '@web/components/push-notification-alert'

export function Component() {
  return (
    <main className="mt-6 md:mt-8 xl:mt-12">
      <div>
        <p className="text-sm leading-6 text-muted-foreground">
          Settings for receiving or managing profile notifications.
        </p>

        <div className="mt-6">
          <PushNotificationPermissionRequest />
        </div>
      </div>
    </main>
  )
}
