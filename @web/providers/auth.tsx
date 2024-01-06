import { AUTH_JWT_LIVE_TIME_IN_SECONDS } from '@api/lib/auth'
import { TRPCClientError } from '@trpc/client'
import { api } from '@web/lib/api'
import { useAuthStore } from '@web/stores/auth'
import { useEffect } from 'react'

export function AuthProvider(props: { children: React.ReactNode }) {
  const utils = api.useUtils()
  useEffect(() => {
    const handler = async () => {
      if (!useAuthStore.getState().state) return

      try {
        const data = await utils.auth.infos.fetch()
        useAuthStore.setState({ state: data.auth })
      } catch (err) {
        if (err instanceof TRPCClientError) {
          const code = err.data?.code

          if (code === 'UNAUTHORIZED') {
            useAuthStore.setState({ state: null })
          }
        }
      }
    }

    handler()

    const id = window.setInterval(handler, AUTH_JWT_LIVE_TIME_IN_SECONDS * 0.8 * 1000)

    return () => {
      window.clearInterval(id)
    }
  }, [utils])

  return props.children
}
