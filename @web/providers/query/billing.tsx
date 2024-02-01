import { useListenToTRPCMutation } from '@web/hooks/use-listen-to-trpc-mutation'
import { trpc, parseMessageFromTRPCClientError } from '@web/lib/trpc'
import { toast } from 'sonner'

export function BillingQuery() {
  useListenToTRPCMutation(trpc.billing.checkout, {
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
