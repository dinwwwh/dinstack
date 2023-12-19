'use client'

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError, httpBatchLink } from '@trpc/client'
import { env } from '@web/env'
import { api } from '@web/lib/api'
import { store } from '@web/lib/jotai'
import { sessionIdAtom } from '@web/services/auth/atoms'
import { RESET } from 'jotai/utils'
import { useState } from 'react'
import SuperJSON from 'superjson'
import { useToast } from '@ui/ui/use-toast'
import { showTurnstileAtom, turnstileRefAtom, turnstileTokenAtom } from './turnstile'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError(err) {
            if (err instanceof TRPCClientError && err.data?.code === 'UNAUTHORIZED') {
              store.set(sessionIdAtom, RESET)
            }
          },
        }),
        mutationCache: new MutationCache({
          onError(err) {
            if (err instanceof TRPCClientError) {
              const code = err.data?.code
              const message = err.message

              if (code === 'UNAUTHORIZED') {
                store.set(sessionIdAtom, RESET)
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
            const sessionId = store.get(sessionIdAtom)
            const headers: Record<string, string> = {}

            if (sessionId) {
              headers['Authorization'] = `Bearer ${sessionId}`
            }

            return headers
          },
          async fetch(input, init) {
            const method = init?.method?.toUpperCase() ?? 'GET'
            if (method === 'POST' && init) {
              if (!store.get(turnstileTokenAtom)) {
                store.set(showTurnstileAtom, true)
                await new Promise((resolve) => {
                  const unsub = store.sub(turnstileTokenAtom, () => {
                    const token = store.get(turnstileTokenAtom)
                    if (token) {
                      unsub()
                      resolve(token)
                    }
                  })
                })
                store.set(showTurnstileAtom, false)
              }

              const token = store.get(turnstileTokenAtom)

              init.headers = {
                ...init.headers,
                'X-Turnstile-Token': `${token}`,
              }
              store.set(turnstileTokenAtom, null)
              store.get(turnstileRefAtom)?.reset()
            }

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
