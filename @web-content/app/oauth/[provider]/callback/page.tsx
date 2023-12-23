import { oauthAccountProviders } from '+db/schema'
import { uppercaseFirstLetter } from '+shared/lib/utils'
import { CallbackHandler } from './_components/callback-handler'
import { ReloadIcon } from '@radix-ui/react-icons'
import type { Metadata } from 'next'

type Props = {
  params: { provider: string }
}

export function generateStaticParams(): Props['params'][] {
  return oauthAccountProviders.enumValues.map((provider) => {
    return {
      provider,
    }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Handling ${uppercaseFirstLetter(params.provider)} callback`,
  }
}

export default function OauthCallbackPage() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-background">
      <CallbackHandler />
      <ReloadIcon className="h-9 w-9 animate-spin text-muted-foreground" />
    </div>
  )
}
