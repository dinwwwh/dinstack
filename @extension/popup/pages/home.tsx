import { useAuthStore } from '@extension/stores/auth'
import { api } from '@web/lib/api'

export function Component() {
  const query = api.ping.useQuery()
  const authStore = useAuthStore()

  return (
    <div>
      <pre>userName: {authStore.state?.user.name}</pre>
      <pre>
        status: {query.status} data: {JSON.stringify(query.data, null, 2)} fetching:{' '}
        {query.isFetching ? 'true' : 'false'}
      </pre>
      <button type="button" onClick={() => query.refetch()}>
        refresh
      </button>
      <button type="button" onClick={() => useAuthStore.setState({ state: null })}>
        logout
      </button>
    </div>
  )
}
