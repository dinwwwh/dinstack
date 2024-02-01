import { BillingQuery } from './billing'
import { PingQuery } from './ping'
import { useAuth } from '@clerk/clerk-react'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError, httpBatchLink } from '@trpc/client'
import { env } from '@web/lib/env'
import { trpc } from '@web/lib/trpc'
import { getTurnstileToken } from '@web/lib/turnstile'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useMemo } from 'react'
import SuperJSON from 'superjson'

export function BaseQueryProvider({
  children,
  getAuthToken,
  signOut,
  enableTurnstile = false,
  enablePostHog = false,
  auth,
}: {
  children: React.ReactNode
  getAuthToken: () => Promise<string | null | undefined> | string | null | undefined
  signOut: () => void
  enableTurnstile?: boolean
  enablePostHog?: boolean
  auth: object | null
}) {
  const ph = usePostHog()

  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError(err) {
            console.error(err)

            if (enablePostHog) {
              ph.startSessionRecording()
            }

            if (err instanceof TRPCClientError && err.data?.code === 'UNAUTHORIZED') {
              signOut()
            }
          },
        }),
        mutationCache: new MutationCache({
          onError(err) {
            console.error(err)

            if (enablePostHog) {
              ph.startSessionRecording()
            }
          },
        }),
        defaultOptions: {
          queries: {
            refetchOnMount: false,
          },
        },
      }),
    [ph, enablePostHog, signOut],
  )

  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        transformer: SuperJSON,
        links: [
          httpBatchLink({
            url: env.API_TRPC_BASE_URL,
            async headers() {
              const headers: Record<string, string> = {}

              const token = await getAuthToken()
              if (token) {
                headers['Authorization'] = `Bearer ${token}`
              }

              return headers
            },
            async fetch(input, init) {
              const method = init?.method?.toUpperCase() ?? 'GET'
              if (method === 'POST' && init && enableTurnstile) {
                const token = await getTurnstileToken()

                init.headers = {
                  ...init.headers,
                  'X-Turnstile-Token': `${token}`,
                }
              }

              return await fetch(input, init)
            },
          }),
        ],
      }),
    [enableTurnstile, getAuthToken],
  )

  useEffect(() => {
    queryClient.invalidateQueries()
  }, [auth, queryClient])

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <PingQuery />
        <BillingQuery />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export function QueryProvider(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof BaseQueryProvider>,
    'getAuthToken' | 'signOut' | 'auth'
  >,
) {
  const auth = useAuth()

  return (
    <BaseQueryProvider {...props} getAuthToken={auth.getToken} signOut={auth.signOut} auth={auth} />
  )
}
