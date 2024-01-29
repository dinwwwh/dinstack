import { useAuth } from '@clerk/clerk-react'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError, httpBatchLink } from '@trpc/client'
import { useToast } from '@web/components/ui/use-toast'
import { api } from '@web/lib/api'
import { env } from '@web/lib/env'
import { getTurnstileToken } from '@web/lib/turnstile'
import { usePostHog } from 'posthog-js/react'
import { useMemo } from 'react'
import SuperJSON from 'superjson'

export function BaseQueryProvider({
  children,
  getAuthToken,
  signOut,
  enableTurnstile = false,
  enablePostHog = false,
}: {
  children: React.ReactNode
  getAuthToken: () => Promise<string | null | undefined> | string | null | undefined
  signOut: () => void
  enableTurnstile?: boolean
  enablePostHog?: boolean
}) {
  const ph = usePostHog()
  const { toast } = useToast()

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

            if (err instanceof TRPCClientError) {
              const code = err.data?.code
              const message = err.message

              if (code === 'UNAUTHORIZED') {
                signOut()
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
        defaultOptions: {
          queries: {
            refetchOnMount: false,
          },
        },
      }),
    [toast, ph, enablePostHog, signOut],
  )

  const trpcClient = useMemo(
    () =>
      api.createClient({
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

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  )
}

export function QueryProvider(
  props: Omit<React.ComponentPropsWithoutRef<typeof BaseQueryProvider>, 'getAuthToken' | 'signOut'>,
) {
  const { getToken, signOut } = useAuth()

  return <BaseQueryProvider {...props} getAuthToken={getToken} signOut={signOut} />
}
