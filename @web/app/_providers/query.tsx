'use client'

import { useToast } from '@dinstack/ui/use-toast'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError, httpBatchLink } from '@trpc/client'
import { env } from '@web/env'
import { api } from '@web/lib/api'
import { useAuthStore } from '@web/stores/auth'
import { useState } from 'react'
import SuperJSON from 'superjson'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError(err) {
            if (err instanceof TRPCClientError && err.data?.code === 'UNAUTHORIZED') {
              useAuthStore.getState().reset()
            }
          },
        }),
        mutationCache: new MutationCache({
          onError(err) {
            if (err instanceof TRPCClientError) {
              const code = err.data?.code
              const message = err.message

              if (code === 'UNAUTHORIZED') {
                useAuthStore.getState().reset()
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
  )

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          url: new URL('/trpc', env.NEXT_PUBLIC_API_URL).toString(),
          async headers() {
            const auth = useAuthStore.getState()
            const headers: Record<string, string> = {}

            if (auth.user) {
              headers['Authorization'] = `Bearer ${auth.jwt}`
            }

            return headers
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
