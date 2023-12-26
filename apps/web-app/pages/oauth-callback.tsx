import { oauthAccountSchema } from '../../../packages/db/schema'
import { OauthCallbackHandler } from '@auth-react/components/oauth-callback-handler'
import { useAuthStore } from '@auth-react/stores/auth'
import { Loader, Loader2 } from 'lucide-react'
import { redirect, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { z } from 'zod'

export function Component() {
  const params = z
    .object({
      provider: oauthAccountSchema.shape.provider,
    })
    .parse(useParams())
  const searchParams = z
    .object({
      code: z.string(),
      state: z.string(),
    })
    .parse(Object.fromEntries(useSearchParams()[0].entries()))

  const navigate = useNavigate()
  const authStore = useAuthStore()

  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 strokeWidth={1.5} className="h-10 w-10 animate-spin text-muted-foreground" />

      <OauthCallbackHandler
        type={authStore.session ? 'connect' : 'login'}
        provider={params.provider}
        code={searchParams.code}
        state={searchParams.state}
        handleRedirect={(url) => {
          if (!url) {
            return navigate('/')
          }
          navigate(`${url.pathname}${url.search}${url.hash}`)
        }}
      />
    </div>
  )
}
