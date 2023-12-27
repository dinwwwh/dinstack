import { Button } from '@web/components/ui/button'
import { api } from '@web/lib/api'

export function HomePage() {
  const query = api.ping.useQuery()
  return <Button>{JSON.stringify(query.data)}</Button>
}
