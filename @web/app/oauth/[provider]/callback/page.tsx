import { oauthAccountProviders } from '@api/database/schema'
import { ReloadIcon } from '@radix-ui/react-icons'
import { CallbackHandler } from './_components/callback-handler'

export function generateStaticParams() {
  return oauthAccountProviders.enumValues.map((provider) => {
    return {
      provider,
    }
  })
}

export default function OauthCallbackPage() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-background">
      <CallbackHandler />
      <ReloadIcon className="h-9 w-9 animate-spin text-muted-foreground" />
    </div>
  )
}
