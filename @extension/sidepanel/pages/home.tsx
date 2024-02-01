import { useAuthStore } from '@extension/stores/auth'
import { Button } from '@web/components/ui/button'
import { env } from '@web/lib/env'
import { trpc } from '@web/lib/trpc'
import { toast } from 'sonner'

export function Component() {
  const query = trpc.ping.useQuery()
  const mutation = trpc.pingMutation.useMutation()
  const authStore = useAuthStore()

  return (
    <div className="p-5 space-y-4">
      <pre>
        status: {query.status} data: {JSON.stringify(query.data, null, 2)} fetching:{' '}
        {query.isFetching ? 'true' : 'false'}
      </pre>
      <div className="flex gap-4 flex-wrap">
        <Button type="button" onClick={() => query.refetch()}>
          refresh
        </Button>
        <Button type="button" onClick={() => mutation.mutate()}>
          mutation
        </Button>
        <Button type="button" onClick={() => toast('hi from test')}>
          test toast
        </Button>
        {authStore.state ? (
          <Button
            type="button"
            onClick={() => {
              chrome.tabs.create({
                url: new URL('extension/sign-out', env.WEB_BASE_URL).toString(),
              })
            }}
          >
            logout
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => {
              chrome.tabs.create({ url: new URL('extension/sign-in', env.WEB_BASE_URL).toString() })
            }}
          >
            Login
          </Button>
        )}
      </div>

      <div className="h-screen"></div>
    </div>
  )
}
