import { useListenToTRPCMutation } from '@web/hooks/use-listen-to-trpc-mutation'
import { trpc, parseMessageFromTRPCClientError } from '@web/lib/trpc'
import { toast } from 'sonner'

export function PingQuery() {
  const utils = trpc.useUtils()

  useListenToTRPCMutation(trpc.pingMutation, {
    onMutate({ id }) {
      toast.loading('Mutating ping...', {
        id,
      })
    },
    onSuccess({ id }) {
      toast.success('Ping has been mutate successfully', {
        id,
      })
    },
    onError({ id, error }) {
      toast.error(parseMessageFromTRPCClientError(error), {
        id,
      })
    },
    onSettled() {
      utils.ping.invalidate()
    },
  })

  return null
}
