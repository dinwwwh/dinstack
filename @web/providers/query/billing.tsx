import { useListenToTRPCMutation } from '@web/hooks/use-listen-to-trpc-mutation'
import { api, parseMessageFromTRPCClientError } from '@web/lib/api'
import { toast } from 'sonner'

export function BillingQuery() {
  useListenToTRPCMutation(api.billing.checkout, {
    onMutate({ id }) {
      toast.loading('Creating checkout popup...', {
        id,
      })
    },
    onSuccess({ id }) {
      toast.success('Your checkout popup is up and running', {
        id,
      })
    },
    onError({ id, error }) {
      toast.error(parseMessageFromTRPCClientError(error), {
        id,
      })
    },
  })

  return null
}
