import { Button } from '@web/components/ui/button'
import { api } from '@web/lib/api'
import { Helmet } from 'react-helmet-async'

export function Component() {
  const testPushNotificationMutation = api.auth.notification.push.postTest.useMutation()

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <div>
        <div className="h-screen p-6">
          <Button type="button" onClick={() => testPushNotificationMutation.mutate()}>
            Test Push notification
          </Button>
        </div>
        <div className="h-screen bg-red-200"></div>
      </div>
    </>
  )
}
