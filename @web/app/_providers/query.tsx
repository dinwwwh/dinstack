'use client'

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { env } from '@web/env'
import { api } from '@web/lib/api'
import { useMemo } from 'react'
import SuperJSON from 'superjson'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache(),
        mutationCache: new MutationCache(),
      }),
    [],
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

              return headers
            },
          }),
        ],
      }),
    [],
  )

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  )
}
