import { MutationStatusIcon } from './mutation-status-icon'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { useToast } from './ui/use-toast'
import { useNotificationPermission } from '@web/hooks/use-notification-permission'
import { BellIcon } from 'lucide-react'
import { useState } from 'react'

export function PushNotificationPermissionRequest(props: { onDismiss?: () => void }) {
  const { toast } = useToast()
  const { permission, requestPermission } = useNotificationPermission()
  const [status, setStatus] = useState<'loading' | 'idle' | 'success' | 'error'>('idle')

  const subscribe = async () => {
    setStatus('loading')
    const permission = await requestPermission()

    if (permission !== 'granted') {
      toast({
        variant: 'destructive',
        title: 'Notification Permission Required',
        description: 'Please manually turn on notifications to access this feature.',
      })
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  if (permission === 'granted') return null

  return (
    <Alert>
      <BellIcon className="h-4 w-4" />
      <AlertTitle>Push Notification</AlertTitle>
      <AlertDescription>
        Enable push notification to receive notifications on this device.
        <div className="mt-3 flex space-x-7">
          <button
            type="button"
            className="rounded-md text-sm font-medium text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2"
            onClick={subscribe}
          >
            Enable <MutationStatusIcon status={status} />
          </button>
          {props.onDismiss ? (
            <button
              type="button"
              className="rounded-md text-sm font-medium text-muted-foreground hover:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={props.onDismiss}
            >
              Dismiss
            </button>
          ) : null}
        </div>
      </AlertDescription>
    </Alert>
  )
}
