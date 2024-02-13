import type * as _B from '../../node_modules/@trpc/react-query/dist/createTRPCReact'
import type { AppRouter, AppRouterOutputs } from '@api/core/router'
import type * as _K from '@api/node_modules/@clerk/backend/dist/types'
import type * as _N from '@api/node_modules/@clerk/backend/dist/types/api/endpoints'
import type * as _H from '@api/node_modules/@clerk/backend/dist/types/tokens/authStatus'
import type * as _M from '@api/node_modules/@clerk/backend/dist/types/tokens/interstitial'
import type * as _A from '@api/node_modules/@knocklabs/node/dist/src/knock'
import type * as _C from '@api/node_modules/@lemonsqueezy/lemonsqueezy.js/dist/index.cjs'
import type * as _D from '@api/node_modules/posthog-node/lib'
import type * as _E from '@api/node_modules/svix/dist'
import type { TRPCClientErrorLike } from '@trpc/react-query'
import { createTRPCReact } from '@trpc/react-query'
import type { TRPCInferrable } from '@trpc/server/unstable-core-do-not-import'

export const trpc = createTRPCReact<AppRouter>({
  overrides: {
    useMutation: {
      /**
       * This function is called whenever a `.useMutation` succeeds
       **/
      async onSuccess(opts) {
        /**
         * @note that order here matters:
         * The order here allows route changes in `onSuccess` without
         * having a flash of content change whilst redirecting.
         **/
        // Calls the `onSuccess` defined in the `useQuery()`-options:
        await opts.originalFn()
        // Invalidate all queries in the react-query cache:
        // await opts.queryClient.invalidateQueries()
      },
    },
  },
})

export function parseMessageFromTRPCClientError(
  err: TRPCClientErrorLike<TRPCInferrable>,
  defaultMessage: string = 'Something went wrong',
) {
  const code = err.data?.code
  const message = err.message

  if (message === code || code === 'INTERNAL_SERVER_ERROR') return defaultMessage

  return message
}

export type ApiOutputs = AppRouterOutputs
