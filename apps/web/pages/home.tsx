import { api } from '@shared-react/lib/api'
import { Button } from '@ui/ui/button'

export function HomePage() {
  const query = api.ping.useQuery()
  return <Button>{JSON.stringify(query.data)}</Button>
}
