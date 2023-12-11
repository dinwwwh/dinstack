'use client'

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError, httpBatchLink } from '@trpc/client'
import { sessionAtom } from '@web/atoms/auth'
import { env } from '@web/env'
import { api } from '@web/lib/api'
import { RESET } from 'jotai/utils'
import { useState } from 'react'
import SuperJSON from 'superjson'
import { useToast } from '@ui/ui/use-toast'
import { store } from './jotai'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError(err) {
            if (err instanceof TRPCClientError && err.data?.code === 'UNAUTHORIZED') {
              store.set(sessionAtom, RESET)
            }
          },
        }),
        mutationCache: new MutationCache({
          onError(err) {
            if (err instanceof TRPCClientError) {
              const code = err.data?.code
              const message = err.message

              if (code === 'UNAUTHORIZED') {
                store.set(sessionAtom, RESET)
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
            const session = store.get(sessionAtom)
            const headers: Record<string, string> = {}

            if (session) {
              headers['Authorization'] = `Bearer ${session.id}`
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
