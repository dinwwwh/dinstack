import { api } from '@shared-react/lib/api'
import { Button } from '@ui/ui/button'
import { useToast } from '@ui/ui/use-toast'

export function Component() {
  const { toast } = useToast()
  const query = api.ping.useQuery()
  return (
    <>
      <div className="h-screen"></div>
      <div className="h-screen bg-red-200"></div>
    </>
  )
}
