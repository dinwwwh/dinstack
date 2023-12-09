'use client'

import { useToast } from '@dinstack/ui/use-toast'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError, httpBatchLink } from '@trpc/client'
import { env } from '@web/env'
import { api } from '@web/lib/api'
import { useAuthStore } from '@web/stores/auth'
import { useMemo } from 'react'
import SuperJSON from 'superjson'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore()
  const { toast } = useToast()
  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError(err) {
            if (err instanceof TRPCClientError && err.data?.code === 'UNAUTHORIZED') {
              auth.reset()
            }
          },
        }),
        mutationCache: new MutationCache({
          onError(err) {
            if (err instanceof TRPCClientError) {
              const code = err.data?.code
              const message = err.message

              if (code === 'UNAUTHORIZED') {
                auth.reset()
              }

              if (message !== code && code !== 'INTERNAL_SERVER_ERROR') {
                toast({
                  variant: 'destructive',
                  title: message,
                })
              } else {
                toast({
                  variant: 'destructive',
                  title: 'Something went wrong, please try again later',
                })
              }
            }
          },
        }),
      }),
    [auth, toast],
  )

  const trpcClient = useMemo(
    () =>
      api.createClient({
        transformer: SuperJSON,
        links: [
          httpBatchLink({
            url: new URL('/trpc', env.NEXT_PUBLIC_API_URL).toString(),
            async headers() {
              const headers: Record<string, string> = {}

              if (auth.user) {
                headers['Authorization'] = `Bearer ${auth.jwt}`
              }

              return headers
            },
          }),
        ],
      }),
    [auth],
  )

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  )
}
