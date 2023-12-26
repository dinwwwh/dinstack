import { api } from '@shared-react/lib/api'
import { getTurnstileToken } from '@turnstile-react/lib/turnstile'
import { Button } from '@ui/ui/button'
import { useToast } from '@ui/ui/use-toast'

export function HomePage() {
  const { toast } = useToast()
  const query = api.ping.useQuery()
  return (
    <Button
      onClick={async () => {
        toast({
          title: 'Hello',
          description: 'World',
        })
        console.log(await getTurnstileToken())
      }}
    >
      {JSON.stringify(query.data)}
    </Button>
  )
}
