import { api } from '@shared-react/lib/api'
import { getTurnstileToken } from '@turnstile-react/lib/turnstile'
import { Button } from '@ui/ui/button'

export function HomePage() {
  const query = api.ping.useQuery()
  return (
    <Button
      onClick={async () => {
        console.log(await getTurnstileToken())
      }}
    >
      {JSON.stringify(query.data)}
    </Button>
  )
}
