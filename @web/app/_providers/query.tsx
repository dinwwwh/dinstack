'use client'

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { env } from '@web/env'
import { api } from '@web/lib/api'
import { useMemo } from 'react'
import SuperJSON from 'superjson'
import { useAuthStore } from '../stores/auth'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore()
  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache(),
        mutationCache: new MutationCache(),
      }),
    [],
  )

  // TODO: toast on errors
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
