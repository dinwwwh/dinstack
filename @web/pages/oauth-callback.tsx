import { oauthAccountSchema } from '@api/database/schema'
import { OauthCallbackHandler } from '@web/components/auth/oauth-callback-handler'
import { useAuthStore } from '@web/stores/auth'
import { Loader2Icon } from 'lucide-react'
import { useParams, useSearchParams } from 'react-router-dom'
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

  const authStore = useAuthStore()

  return (
    <div className="flex items-center justify-center h-full">
      <Loader2Icon className="h-10 w-10 animate-spin text-muted-foreground" />

      <OauthCallbackHandler
        type={authStore.state ? 'connect' : 'login'}
        provider={params.provider}
        code={searchParams.code}
        state={searchParams.state}
      />
    </div>
  )
}
