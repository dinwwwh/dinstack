import { api } from '@shared-react/lib/api'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError, httpBatchLink } from '@trpc/client'
import { useToast } from '@ui/ui/use-toast'
import { env } from '@web/lib/env'
import { useState } from 'react'
import SuperJSON from 'superjson'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError(err) {
            // if (err instanceof TRPCClientError && err.data?.code === 'UNAUTHORIZED') {
            //   jotaiStore.set(sessionAtom, RESET)
            // }
          },
        }),
        mutationCache: new MutationCache({
          onError(err) {
            if (err instanceof TRPCClientError) {
              const code = err.data?.code
              const message = err.message

              // if (code === 'UNAUTHORIZED') {
              //   jotaiStore.set(sessionAtom, RESET)
              // }

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
          url: new URL('/trpc', env.API_TRPC_BASE_URL).toString(),
          async headers() {
            const headers: Record<string, string> = {}

            // const session = jotaiStore.get(sessionAtom)
            // if (session) {
            //   headers['Authorization'] = `Bearer ${session.secretKey}`
            // }

            return headers
          },
          async fetch(input, init) {
            const method = init?.method?.toUpperCase() ?? 'GET'
            // if (method === 'POST' && init) {
            //   if (!jotaiStore.get(turnstileTokenAtom)) {
            //     jotaiStore.set(showTurnstileAtom, true)
            //     await new Promise((resolve) => {
            //       const unsub = jotaiStore.sub(turnstileTokenAtom, () => {
            //         const token = jotaiStore.get(turnstileTokenAtom)
            //         if (token) {
            //           unsub()
            //           resolve(token)
            //         }
            //       })
            //     })
            //     jotaiStore.set(showTurnstileAtom, false)
            //   }

            //   const token = jotaiStore.get(turnstileTokenAtom)

            //   init.headers = {
            //     ...init.headers,
            //     'X-Turnstile-Token': `${token}`,
            //   }
            //   jotaiStore.set(turnstileTokenAtom, null)
            //   jotaiStore.get(turnstileRefAtom)?.reset()
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
