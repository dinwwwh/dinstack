import { api } from '@web/lib/api'

export function Component() {
  const query = api.ping.useQuery()

  return (
    <div>
      <pre>
        status: {query.status} data: {JSON.stringify(query.data, null, 2)} fetching:{' '}
        {query.isFetching ? 'true' : 'false'}
      </pre>
      <button type="button" onClick={() => query.refetch()}>
        refresh
      </button>
    </div>
  )
}
