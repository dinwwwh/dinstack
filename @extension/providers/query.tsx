import { useAuthStore } from '@extension/stores/auth'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError, httpBatchLink } from '@trpc/client'
import { api } from '@web/lib/api'
import { env } from '@web/lib/env'
import { useState } from 'react'
import SuperJSON from 'superjson'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError(err) {
            if (err instanceof TRPCClientError && err.data?.code === 'UNAUTHORIZED') {
              useAuthStore.setState({ state: null })
            }
          },
        }),
        mutationCache: new MutationCache({
          onError(err) {
            if (err instanceof TRPCClientError) {
              const code = err.data?.code
              const message = err.message

              if (code === 'UNAUTHORIZED') {
                useAuthStore.setState({ state: null })
              }

              if (message !== code && code !== 'INTERNAL_SERVER_ERROR') {
                // TODO
                // toast({
                //   variant: 'destructive',
                //   title: message,
                // })
              } else {
                // TODO
                // toast({
                //   variant: 'destructive',
                //   title: 'Something went wrong, please try again later',
                // })
              }
            }
          },
        }),
        defaultOptions: {
          queries: {
            refetchOnMount: false,
          },
        },
      }),
  )

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          url: env.API_TRPC_BASE_URL,
          async headers() {
            const headers: Record<string, string> = {}

            const auth = useAuthStore.getState().state
            if (auth) {
              headers['Authorization'] = `Bearer ${auth.jwt}`
            }

            return headers
          },
          async fetch(input, init) {
            // TODO
            // const method = init?.method?.toUpperCase() ?? 'GET'
            // if (method === 'POST' && init) {
            //   const token = await getTurnstileToken()

            //   init.headers = {
            //     ...init.headers,
            //     'X-Turnstile-Token': `${token}`,
            //   }
            // }

            return await fetch(input, init)
          },
        }),
      ],
    }),
  )

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  )
}
