import { useListenToTRPCMutation } from '@web/hooks/use-listen-to-trpc-mutation'
import { api, parseMessageFromTRPCClientError } from '@web/lib/api'
import { toast } from 'sonner'

export function PingQuery() {
  const utils = api.useUtils()

  useListenToTRPCMutation(api.pingMutation, {
    onMutate({ id }) {
      toast.loading('Loading...', {
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
