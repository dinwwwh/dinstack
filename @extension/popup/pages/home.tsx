import { Button } from '@web/components/ui/button'
import { api } from '@web/lib/api'
import { env } from '@web/lib/env'
import { useAuthStore } from '@web/stores/auth'

export function Component() {
  const query = api.ping.useQuery()
  const authStore = useAuthStore()

  return (
    <div className="p-5 space-y-4">
      <pre>userName: {authStore.state?.user.name}</pre>
      <pre>
        status: {query.status} data: {JSON.stringify(query.data, null, 2)} fetching:{' '}
        {query.isFetching ? 'true' : 'false'}
      </pre>
      <div className="flex gap-4">
        <Button type="button" onClick={() => query.refetch()}>
          refresh
        </Button>
        {authStore.state ? (
          <Button type="button" onClick={() => useAuthStore.setState({ state: null })}>
            logout
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => {
              chrome.tabs.create({ url: new URL('extension/login', env.WEB_BASE_URL).toString() })
            }}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  )
}
