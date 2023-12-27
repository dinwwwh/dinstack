import { api } from '@shared-react/lib/api'
import { Button } from '@ui/ui/button'
import { useToast } from '@ui/ui/use-toast'

export function Component() {
  const { toast } = useToast()
  const query = api.ping.useQuery()
  return (
    <Button
      onClick={async () => {
        toast({
          title: 'Hello',
          description: 'World',
        })
      }}
    >
      {JSON.stringify(query.data)}
    </Button>
  )
}
